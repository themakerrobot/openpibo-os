from fastapi_socketio import SocketManager
from fastapi import FastAPI,Request,UploadFile,File
from fastapi.responses import HTMLResponse,FileResponse,JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import argparse
from lib import Pibo, to_base64
from threading import Thread
import time, datetime, os, json, shutil, log, cv2
import network_disp

MODEL_PATH = "/home/pi/models"

try:
  app = FastAPI()
  app.mount("/static", StaticFiles(directory="static"), name="static")
  app.mount("/webfonts", StaticFiles(directory="webfonts"), name="webfonts")
  templates = Jinja2Templates(directory="templates")
  socketio = SocketManager(app=app)
except Exception as ex:
  logger.error(f'Server Error:{ex}')

@app.get('/', response_class=HTMLResponse)
async def f(request:Request):
  return templates.TemplateResponse("index.html", {"request": request})

@app.get('/download_img', response_class=FileResponse)
async def f():
  if pibo.onoff:
    pibo.imwrite('/home/pi/capture.jpg')
  return FileResponse(path="/home/pi/capture.jpg", media_type="image/jpeg", filename="capture.jpg")

@app.get('/wifi')
async def f(ssid=None, psk=None):
  if ssid == None or psk == None:
    with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'r') as f:
      tmp = f.readlines()
    ipaddress = os.popen('/home/pi/openpibo-os/tools/system.sh').read().split(',')[6]
    return JSONResponse(content={'result':'ok', 'ssid':tmp[4].split('"')[1], 'psk':tmp[5].split('"')[1], 'ipaddress':ipaddress}, status_code=200)
  else:
    if len(psk) < 8:
      return JSONResponse(content={'result':'fail', 'data':'psk must be at least 8 digits.'}, status_code=200)

    tmp='country=KR\n'
    tmp+='ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\n'
    tmp+='update_config=1\n'
    tmp+='network={\n'
    tmp+='\tssid="{}"\n'.format(ssid)
    tmp+='\tpsk="{}"\n'.format(psk)
    tmp+='\tkey_mgmt=WPA-PSK\n'
    tmp+='}\n'

    with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'w') as f:
      f.write(tmp)
    os.system('wpa_cli -i wlan0 reconfigure')
    os.system("shutdown -r now")

@app.post('/upload_tm')
async def f(data:UploadFile = File(...)):
  data.filename = "models.zip"
  os.system(f"mkdir -p {MODEL_PATH}")
  os.system(f"rm -rf {MODEL_PATH}/*")

  with open(f"{MODEL_PATH}/{data.filename}", 'wb') as f:
    content = await data.read()
    f.write(content)

  os.system(f"unzip {MODEL_PATH}/{data.filename} -d {MODEL_PATH}")
  if pibo.onoff:
    pibo.tm.load(f"{MODEL_PATH}/model_unquant.tflite", f"{MODEL_PATH}/labels.txt")
  return JSONResponse(content={"filename":data.filename}, status_code=200)

@app.post('/upload_oled')
async def f(data:UploadFile = File(...)):
  data.filename = "tmp.jpg"

  filepath = f"/home/pi/{data.filename}"
  with open(filepath, 'wb') as f:
    content = await data.read()
    f.write(content)
  if pibo.onoff:
    pibo.set_oled_image(filepath)
  os.remove(filepath)
  return JSONResponse(content={"filename":data.filename}, status_code=200)

# vision
@app.sio.on('disp_vision')
async def f(sid, d=None):
  if pibo.onoff:
    await emit('disp_vision', pibo.vision_type)
  return

@app.sio.on('detect')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.vision_type=d
  return

# device
@app.sio.on('set_neopixel')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_neopixel(d)
  return
  
@app.sio.on('set_oled')
async def f_set_oled(sid, d=None):
  if pibo.onoff:
    pibo.set_oled(d)
  return

@app.sio.on('oledpath_update')
async def f(sid, d=None):
  return await emit('oledpath_update', os.listdir(d))

@app.sio.on('set_oled_image')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_oled_image(d)
  return

@app.sio.on('clear_oled')
async def f(sid, d=None):
  if pibo.onoff:
    network_disp.run()
  return

@app.sio.on('mic')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.mic(d)
    await emit('mic', '')
    pibo.play_audio('/home/pi/stream.wav', d['volume'], True)
  return

@app.sio.on('mic_replay')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.play_audio('/home/pi/stream.wav', d['volume'], True)
  return

@app.sio.on('tts')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.tts(d)
  return

@app.sio.on('play_audio')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.stop_audio()
    res = pibo.play_audio(d["filename"], d["volume"], True)
  return

@app.sio.on('stop_audio')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.stop_audio()
  return

# speech
@app.sio.on('question')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.question(d)
    await emit('disp_speech', {'answer':res, 'chat_list':list(reversed(pibo.chat_list))})
  return

@app.sio.on('disp_speech')
async def f(sid, d=None):
  if pibo.onoff:
    await emit('disp_speech', {'chat_list':list(reversed(pibo.chat_list))})
  return

@app.post('/upload_csv')
async def f(data:UploadFile = File(...)):
  if pibo.onoff:
    data.filename = "mychat.csv"

    filepath = f"/home/pi/{data.filename}"
    with open(filepath, 'wb') as f:
      content = await data.read()
      f.write(content)

    pibo.load_csv(filepath)
    os.remove(filepath)
  return JSONResponse(content={"filename":data.filename}, status_code=200)

@app.sio.on('reset_csv')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.reset_csv()
  return

# motion
@app.sio.on('disp_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.get_motor_info()
    await emit('disp_motion', {'pos':res[0], 'table':res[1], 'record':res[2]})
  return

@app.sio.on('set_motor')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_motor(d['idx'], d['pos'])
  return

@app.sio.on('set_motors')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_motors(d['pos_lst'])
  return

@app.sio.on('add_frame')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.add_frame(d)
    await emit('disp_motor', {'table':res})
  return

@app.sio.on('delete_frame')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.delete_frame(d)
    await emit('disp_motor', {'table':res})
  return

@app.sio.on('init_frame')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.init_frame()
    await emit('disp_motor',{'table':res})
  return

@app.sio.on('play_frame')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.play_frame(d)
  return

@app.sio.on('stop_frame')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.stop_frame()
  return

@app.sio.on('add_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.add_motion(d)
    await emit('disp_motor', {'record':res})
  return

@app.sio.on('load_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.load_motion(d)
    await emit('disp_motor', {'table':res})
  return

@app.sio.on('delete_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.delete_motion(d)
    await emit('disp_motor', {'record':res})
  return

@app.sio.on('reset_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.reset_motion()
    await emit('disp_motor', {'record':res})
  return

@app.sio.on('onoff')
async def f(sid, d=None):
  if d != None:
    if d == 'on':
      if pibo.onoff == True:
        logger.info('Already Start')
      else:
        pibo.motion_start()
        pibo.chatbot_start()
        pibo.device_start()
        await emit('update_neopixel', pibo.neopixel_value)
        pibo.vision_start()
        pibo.onoff = True
    elif d == 'off':
      if pibo.onoff == False:
        logger.info('Already Stop')
      else:
        pibo.vision_stop()
        pibo.device_stop()
        pibo.chatbot_stop()
        pibo.motion_stop()
        pibo.onoff = False
    network_disp.run()
  
  return await emit('onoff', 'on' if pibo.onoff else 'off')

@app.sio.on('wifi')
async def f(sid, d=None):
  if d == None:
    with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'r') as f:
      tmp = f.readlines()
      await emit('wifi', {'ssid':tmp[4].split('"')[1], 'psk':tmp[5].split('"')[1]})
  else:
    if len(d['psk']) < 8:
      logger.error("psk must be at least 8 digits.")
      return
    tmp='country=KR\n'
    tmp+='ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\n'
    tmp+='update_config=1\n'
    tmp+='network={\n'
    tmp+='\tssid="{}"\n'.format(d['ssid'])
    tmp+='\tpsk="{}"\n'.format(d['psk'])
    tmp+='\tkey_mgmt=WPA-PSK\n'
    tmp+='}\n'

    with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'w') as f:
      f.write(tmp)
    os.system('wpa_cli -i wlan0 reconfigure')
    os.system("shutdown -r now")
  return

@app.sio.on('audio_path')
async def f(sid, d=None):
  return await emit('audio_path', os.listdir(d))

@app.sio.on('eye_update')
async def f(sid, d=None):
  with open('/home/pi/config.json', 'r') as f:
    tmp = json.load(f)

  if d != None:
    tmp['eye'] = d
    with open('/home/pi/config.json', 'w') as f:
      json.dump(tmp, f)
    shutil.chown('/home/pi/config.json', 'pi', 'pi')
  return await emit('eye_update', tmp['eye'])

@app.sio.on('system')
async def f(sid, d=None):
  res = os.popen('/home/pi/openpibo-os/tools/system.sh').read().split(',')
  return await emit('system', res)

@app.sio.on('poweroff')
async def f(sid, d=None):
  os.system('shutdown -h now &')
  os.system('echo "#11:!" > /dev/ttyS0')
  return

@app.sio.on('restart')
async def f(sid, d=None):
  os.system("shutdown -r now")
  return

@app.sio.on('swupdate')
async def f(sid, d=None):
  os.system("curl -s https://raw.githubusercontent.com/themakerrobot/themakerrobot/main/update/main.sh > /home/pi/update")
  os.system("bash /home/pi/update")

@app.on_event("startup")
async def f():
  global logger, pibo
  logger = log.configure_logger()
  logger.info(f'Network Display: {network_disp.run()}')
  pibo = Pibo(emit)
  return

async def emit(key, data, callback=None):
  try:
    await app.sio.emit(key, data, callback=callback)
  except Exception as ex:
    logger.error(f'[emit] Error: {ex}')
    pass
  return

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import uvicorn
  uvicorn.run("main:app", host="0.0.0.0", port=args.port)
