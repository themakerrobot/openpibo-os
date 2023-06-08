from fastapi_socketio import SocketManager
from fastapi import FastAPI,Request,UploadFile,File,Body
from fastapi.responses import HTMLResponse,FileResponse,JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from lib import Pibo
from collections import Counter
import time,os,json,shutil,log
import network_disp
from urllib import parse
import argparse
import wifi

MODEL_PATH = "/home/pi/models"
try:
  app = FastAPI()
  app.mount("/static", StaticFiles(directory="static"), name="static")
  app.mount("/webfonts", StaticFiles(directory="webfonts"), name="webfonts")
  app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
  templates = Jinja2Templates(directory="templates")
  socketio = SocketManager(app=app, cors_allowed_origins=[])
except Exception as ex:
  logger.error(f'Server Error:{ex}')

@app.get('/', response_class=HTMLResponse)
async def f(request:Request):
  return templates.TemplateResponse("index.html", {"request": request})

@app.get('/account')
async def f():
  try:
    res = {"username":"", "password":""}
    with open('/home/pi/.account.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    logger.error(f'[login] Error: {ex}')
    pass
  return JSONResponse(content=res, status_code=200)

@app.post('/account')
async def f(data: dict = Body(...)):
  if 'username' in data and 'password' in data:
    with open('/home/pi/.account.json', 'w') as f:
      json.dump(data, f)
    return JSONResponse(content=data, status_code=200)
  else:
    return JSONResponse(content={'result':'account data 오류'}, status_code=500)

@app.get('/usedata/{key}')
async def f(key="tools"):
  try:
    res = {}
    with open(f'/home/pi/.{key}.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    logger.error(f'[login] Error: {ex}')
    pass
  return JSONResponse(content=res, status_code=200)

@app.post('/usedata/{key}')
async def f(key="tools", data: dict = Body(...)):
  try:
    res = None
    with open(f'/home/pi/.{key}.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    logger.error(f'[usedata] Error: {ex}')
    pass

  if res == None:
    with open(f'/home/pi/.{key}.json', 'w') as f:
      json.dump(data, f)     
  else:
    tmp = {}
    for k in data:
      if type(data[k]) is dict:
        tmp[k] = dict(Counter(res[k]) + Counter(data[k]))
      else:
        tmp[k] = res[k] + data[k] if k in res else data[k]

    with open(f'/home/pi/.{key}.json', 'w') as f:
      json.dump(tmp, f)
  return JSONResponse(content=res, status_code=200)

@app.get('/download_img', response_class=FileResponse)
async def f():
  if pibo.onoff == False:
    return JSONResponse(content={'result':'OFF 상태입니다.'}, status_code=500)

  pibo.imwrite('/home/pi/capture.jpg')
  return FileResponse(path="/home/pi/capture.jpg", media_type="image/jpeg", filename="capture.jpg")

@app.get('/wifi_scan')
async def f():
  return JSONResponse(content=wifi.wifi_scan(), status_code=200)

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
    tmp+=f'\tssid="{ssid}"\n'
    tmp+=f'\tpsk="{psk}"\n'
    tmp+='\tkey_mgmt=WPA-PSK\n'
    tmp+='}\n'

    with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'w') as f:
      f.write(tmp)
    os.system('wpa_cli -i wlan0 reconfigure')
    os.system("shutdown -r now")

@app.post('/upload_tm')
async def f(data:UploadFile = File(...)):
  if pibo.onoff == False:
    return JSONResponse(content={'result':'OFF 상태입니다.'}, status_code=500)

  data.filename = "models.zip"
  os.system(f"mkdir -p {MODEL_PATH}")
  os.system(f"rm -rf {MODEL_PATH}/*")

  with open(f"{MODEL_PATH}/{data.filename}", 'wb') as f:
    content = await data.read()
    f.write(content)

  os.system(f"unzip {MODEL_PATH}/{data.filename} -d {MODEL_PATH}")
  os.remove(f"{MODEL_PATH}/{data.filename}")
  model_names = [s for s in os.listdir(f"{MODEL_PATH}") if s.split(".")[1] in ["h5", "tflite"]]
  if len(model_names) != 1:
    os.system(f"rm -rf {MODEL_PATH}/*")
    return JSONResponse(content={'result':'Model에 문제가 있습니다.'}, status_code=500)

  pibo.tm.load(f"{MODEL_PATH}/{model_names[0]}", f"{MODEL_PATH}/labels.txt")
  return JSONResponse(content={"filename":data.filename}, status_code=200)

@app.post('/upload_oled')
async def f(data:UploadFile = File(...)):
  if pibo.onoff == False:
    return JSONResponse(content={'result':'OFF 상태입니다.'}, status_code=500)

  data.filename = "tmp.jpg"
  filepath = f"/home/pi/{data.filename}"
  with open(filepath, 'wb') as f:
    content = await data.read()
    f.write(content)
  pibo.set_oled_image(filepath)
  os.remove(filepath)
  return JSONResponse(content={"filename":data.filename}, status_code=200)

@app.post('/upload_file/{directory}')
async def f(directory="myaudio", data:UploadFile = File(...)):
  if directory not in ["myaudio", "myimage"]:
    return JSONResponse(content={'result':'myaudio, myimage로 업로드만 가능합니다.'}, status_code=500)

  os.system(f"mkdir -p /home/pi/{directory}")
  filepath = f"/home/pi/{directory}/{data.filename}"
  with open(filepath, 'wb') as f:
    content = await data.read()
    f.write(content)
  return JSONResponse(content={"filename":data.filename}, status_code=200)

## socktio
# vision
@app.sio.on('disp_vision')
async def f(sid, d=None):
  if pibo.onoff:
    await emit('disp_vision', pibo.vision_type)

@app.sio.on('detect')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.vision_type=d

# device
@app.sio.on('set_neopixel')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_neopixel(d)

@app.sio.on('set_oled')
async def f_set_oled(sid, d=None):
  if pibo.onoff:
    pibo.set_oled(d)

@app.sio.on('oled_path')
async def f(sid, d=None):
  return await emit('oled_path', os.listdir(d))

@app.sio.on('set_oled_image')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_oled_image(d)

@app.sio.on('clear_oled')
async def f(sid, d=None):
  if pibo.onoff:
    network_disp.run()

@app.sio.on('mic')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.mic(d)
    await emit('mic', '')
    pibo.play_audio('/home/pi/stream.wav', d['volume'], True)

@app.sio.on('mic_replay')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.play_audio('/home/pi/stream.wav', d['volume'], True)

@app.sio.on('tts')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.tts(d)

@app.sio.on('play_audio')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.stop_audio()
    pibo.play_audio(d["filename"], d["volume"], True)

@app.sio.on('stop_audio')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.stop_audio()

# speech
@app.sio.on('question')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.question(d)
    await emit('disp_speech', {'answer':res, 'chat_list':list(reversed(pibo.chat_list))})

@app.sio.on('disp_speech')
async def f(sid, d=None):
  if pibo.onoff:
    await emit('disp_speech', {'chat_list':list(reversed(pibo.chat_list))})

@app.post('/upload_csv')
async def f(data:UploadFile = File(...)):
  if pibo.onoff == False:
    return JSONResponse(content={'result':'OFF 상태입니다.'}, status_code=500)

  data.filename = "mychat.csv"
  filepath = f"/home/pi/{data.filename}"
  with open(filepath, 'wb') as f:
    content = await data.read()
    f.write(content)

  res = pibo.load_csv(filepath)
  os.remove(filepath)
  if res:
    return JSONResponse(content={}, status_code=200)
  else:
    return JSONResponse(content={'result':'csv 파일 에러'}, status_code=500)

@app.sio.on('reset_csv')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.reset_csv()

# motion
@app.sio.on('disp_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.get_motor_info()
    await emit('disp_motion', {'pos':res[0], 'table':res[1], 'record':res[2]})

@app.sio.on('set_motor')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_motor(d['idx'], d['pos'])

@app.sio.on('set_motors')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.set_motors(d['pos_lst'])

@app.sio.on('add_frame')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.add_frame(d)
    await emit('disp_motion', {'table':res})

@app.sio.on('delete_frame')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.delete_frame(d)
    await emit('disp_motion', {'table':res})

@app.sio.on('init_frame')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.init_frame()
    await emit('disp_motion',{'table':res})

@app.sio.on('play_frame')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.play_frame(d)

@app.sio.on('stop_frame')
async def f(sid, d=None):
  if pibo.onoff:
    pibo.stop_frame()

@app.sio.on('add_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.add_motion(d)
    await emit('disp_motion', {'record':res})

@app.sio.on('load_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.load_motion(d)
    await emit('disp_motion', {'table':res})

@app.sio.on('delete_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.delete_motion(d)
    await emit('disp_motion', {'record':res})

@app.sio.on('reset_motion')
async def f(sid, d=None):
  if pibo.onoff:
    res = pibo.reset_motion()
    await emit('disp_motion', {'record':res})

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

############################################################################################
@app.sio.on('sim_play_item')
async def f(sid, d=None):
  key = d['key']
  content = d['content']
  if pibo.onoff == True:
    if key == 'eye':
      pibo.set_neopixel(content)
      return await emit('sim_result', {'eye':'stop'})
    elif key == 'motion':
      if d['type'] == 'default':
        pibo.async_sim_motion(content, d['cycle'])
      if d['type'] == 'mymotion':
        pibo.async_sim_motion(content, d['cycle'], "/home/pi/mymotion.json")
    elif key == 'audio':
      pibo.async_sim_audio(d["type"]+content, d["volume"])
    elif key == 'oled':
      if d['type'] == 'text':
        pibo.set_oled({'x':d['x'], 'y': d['y'], 'size': d['size'], 'text': content})
      else:
        pibo.set_oled_image(content)
      return await emit('sim_result', {'oled':'stop'})
    elif key == 'tts':
      pibo.tts({'text': content, 'voice_type': d['type'], 'volume': d['volume']})
      return await emit('sim_result', {'tts':'stop'})
    else:
      return await emit('sim_result', "sim_play_item error: " + d)

@app.sio.on('sim_stop_item')
async def f(sid, d=None):
  if pibo.onoff == True:
    if d == 'eye':
      pibo.set_neopixel([0,0,0,0,0,0])
    elif d == 'motion':
      pibo.stop_frame()
      pibo.set_motors([0, 0, -80, 0, 0, 0, 0, 0, 80, 0])
    elif d == 'audio':
      pibo.stop_audio()
    elif d == 'oled':
      network_disp.run()
    elif d == 'tts':
      pibo.stop_audio()
    return await emit('sim_result', "sim_stop_item ok")

@app.sio.on('sim_update_audio')
async def f(sid, d=None):
  if pibo.onoff == True:
    return await emit('sim_update_audio', os.listdir(d))

@app.sio.on('sim_update_oled')
async def f(sid, d=None):
  if pibo.onoff == True:
    return await emit('sim_update_oled', os.listdir(d))

@app.sio.on('sim_update_motion')
async def f(sid, d=None):
  if pibo.onoff == True:
    return await emit('sim_update_motion', pibo.mot.get_motion() if d == 'default' else pibo.mot.get_motion(path="/home/pi/mymotion.json"))

@app.sio.on('sim_play_items')
async def f(sid, d=None):
  if pibo.onoff == True:
    pibo.start_simulate(d)

@app.sio.on('sim_stop_items')
async def f(sid, d=None):
  if pibo.onoff == True:
    pibo.stop_simulate()

@app.sio.on('sim_add_items')
async def f(sid, d=None):
  if pibo.onoff == True:
    try:
      res = {}
      with open('/home/pi/mysim.json', 'rb') as f:
        res = json.load(f)
    except Exception as ex:
      logger.error(f'[simulation] Error: {ex}')
      pass

    res[d['name']] = d['data']
    with open('/home/pi/mysim.json', 'w') as f:
      json.dump(res, f)
    return await emit('sim_result', "sim_add_items ok")

@app.sio.on('sim_remove_items')
async def f(sid, d=None):
  if pibo.onoff == True:
    res = {}
    if d != None:
      try:
        res = {}
        with open('/home/pi/mysim.json', 'rb') as f:
          res = json.load(f)
      except Exception as ex:
        logger.error(f'[simulation] Error: {ex}')
        pass

      if d in res:
        del res[d]

    with open('/home/pi/mysim.json', 'w') as f:
      json.dump(res, f)
    shutil.chown('/home/pi/mysim.json', 'pi', 'pi')
    return await emit('sim_result', "sim_remove_items ok")

@app.sio.on('sim_load_items')
async def f(sid, d=None):
  if pibo.onoff == True:
    try:
      res = {}
      with open('/home/pi/mysim.json', 'rb') as f:
        res = json.load(f)
    except Exception as ex:
      logger.error(f'[simulation] Error: {ex}')
      pass
    return await emit('sim_load_items', [item for item in res])

@app.sio.on('sim_load_item')
async def f(sid, d=None):
  if pibo.onoff == True:
    try:
      res = {}
      with open('/home/pi/mysim.json', 'rb') as f:
        res = json.load(f)
    except Exception as ex:
      logger.error(f'[simulation] Error: {ex}')
      pass
    return await emit('sim_load_item', res[d])
############################################################################################

@app.sio.on('system')
async def f(sid, d=None):
  return await emit('system', pibo.system_status)

@app.sio.on('poweroff')
async def f(sid, d=None):
  os.system('shutdown -h now &')
  os.system('echo "#11:!" > /dev/ttyS0')

@app.sio.on('restart')
async def f(sid, d=None):
  os.system('shutdown -r now')

@app.sio.on('swupdate')
async def f(sid, d=None):
  os.system('curl -s https://raw.githubusercontent.com/themakerrobot/themakerrobot/main/update/main > /home/pi/update')
  os.system('bash /home/pi/update')

@app.sio.on('restore')
async def f(sid, d=None):
  for item in os.listdir('/home/pi/'):
    if item[0] == '.' or item in ['node_modules', 'package.json', 'package-lock.json', 'openpibo-os', 'openpibo-files']:
      continue
    if item in ['code', 'myimage', 'myaudio']:
      os.system(f'rm -rf /home/pi/{item}/*')
    else:
      os.system(f'rm -rf /home/pi/{item}')
  os.system('shutdown -r now')

@app.on_event('startup')
async def f():
  global logger, pibo
  logger = log.configure_logger(level='info')
  logger.info(f'Network Display: {network_disp.run()}')
  pibo = Pibo(emit, logger)

async def emit(key, data, callback=None):
  try:
    logger.debug(f'{key}')
    await app.sio.emit(key, data, callback=callback)
  except Exception as ex:
    logger.error(f'[emit] Error: {ex}')

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import uvicorn
  uvicorn.run('main:app', host='0.0.0.0', port=args.port, access_log=False)
