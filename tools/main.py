#from flask import Flask, render_template, send_from_directory
#from flask_app.sio import SocketIO

from fastapi_socketio import SocketManager
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# ValueError: Too many packets in payload issue
from engineio.payload import Payload
Payload.max_decode_packets = 50

import argparse
from lib import Pibo
from lib import to_base64
from threading import Thread
import time, datetime, os, json, shutil
import network_disp
import log
import cv2
#logger = log.configure_logger()

try:
  #app = Flask(__name__)
  #app.sio = SocketIO(app)
  app = FastAPI()
  app.mount("/static", StaticFiles(directory="static"), name="static")
  templates = Jinja2Templates(directory="templates")
  socketio = SocketManager(app=app)
except Exception as ex:
  logger.error(f'Flask Error:{ex}')

#@app.route('/')
@app.get('/', response_class=HTMLResponse)
async def main(request:Request):
  return templates.TemplateResponse("index.html", {"request": request})
  #return render_template('index.html')

# vision
@app.sio.on('stream')
async def f_stream(sid, d=None):
  if pibo.onoff:
    await emit('stream', to_base64(cv2.resize(pibo.frame.copy(), (320,240))))

@app.sio.on('cartoon')
async def f_cartoon(sid, d=None):
  if pibo.onoff:
    res = pibo.cartoon()
    await emit('cartoon', res)

@app.sio.on('detect')
async def f_detect(sid, d=None):
  if pibo.onoff:
    res = pibo.object_detect()
    await emit('detect', res)

# device
@app.sio.on('set_neopixel')
async def f_set_neopixel(sid, d=None):
  if pibo.onoff:
    pibo.set_neopixel(d)

@app.sio.on('set_oled')
async def f_set_oled(sid, d=None):
  if pibo.onoff:
    pibo.set_oled(d)

@app.sio.on('mic')
async def f_mic(sid, d=None):
  if pibo.onoff:
    pibo.mic(d)

# chatbot
@app.sio.on('question')
async def question(sid, d=None):
  if pibo.onoff:
    res = pibo.question(d)
    await emit('answer', {'answer':res, 'chat_list':list(reversed(pibo.chat_list))})

# motion
@app.sio.on('motor_init')
async def motor_init(sid, d=None):
  if pibo.onoff:
    pos, rec = pibo.motor_init()
    await emit('init_motion', pos)
    await emit('disp_motor_table', rec)

@app.sio.on('set_pos')
async def set_pos(sid, d=None):
  if pibo.onoff:
    pibo.set_pos(d['idx'], d['pos'])

@app.sio.on('add_frame')
async def add_frame(sid, d=None):
  if pibo.onoff:
    res = pibo.add_frame(d)
    await emit('disp_motor_table', res)

@app.sio.on('remove_frame')
async def remove_frame(sid, d=None):
  if pibo.onoff:
    res = pibo.remove_frame(d)
    await emit('disp_motor_table', res)

@app.sio.on('init_frame')
async def init_frame(sid, d=None):
  if pibo.onoff:
    res = pibo.init_frame()
    await emit('disp_motor_table', res)

@app.sio.on('play_frame')
async def play_frame(sid, d=None):
  if pibo.onoff:
    pibo.play_frame(d)

@app.sio.on('add_motion')
async def add_motion(sid, d=None):
  if pibo.onoff:
    res = pibo.add_motion(d)
    await emit('disp_motor_record', res)

@app.sio.on('load_motion')
async def load_motion(sid, d=None):
  if pibo.onoff:
    res = pibo.load_motion(d)
    await emit('disp_motor_table', res)

@app.sio.on('del_motion')
async def del_motion(sid, d=None):
  if pibo.onoff:
    res = pibo.del_motion(d)
    await emit('disp_motor_record', res)

@app.sio.on('reset_motion')
async def reset_motion(sid, d=None):
  if pibo.onoff:
    res = pibo.reset_motion(d)
    await emit('disp_motor_record', res)

@app.sio.on('onoff')
async def onoff(sid, d=None):
  if d != None:
    if d == 'on':
      if pibo.onoff == True:
        logger.info('Already Start')
      pibo.motion_start()
      await emit('disp_motor_record', pibo.motion_j)
      logger.info('motor init')
      pibo.chatbot_start()
      pibo.device_start()
      pibo.vision_start()
      pibo.onoff = True
    elif d == 'off':
      if pibo.onoff == False:
        logger.info('Already Stop')
      pibo.vision_stop()
      pibo.device_stop()
      pibo.chatbot_stop()
      pibo.motion_stop()
      pibo.onoff = False
    network_disp.run()
  
  await emit('onoff', 'on' if pibo.onoff else 'off')

@app.sio.on('wifi')
async def wifi(sid, d=None):
  if d == None:
    with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'r') as f:
      tmp = f.readlines()
      await emit('wifi', {'ssid':tmp[4].split('"')[1], 'psk':tmp[5].split('"')[1]})
  else:
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

@app.sio.on('config')
async def config(sid, d=None):
  with open('/home/pi/config.json', 'r') as f:
    tmp = json.load(f)
  if d != None:
    if 'kakaokey' in d:
      tmp['kakaokey'] = d['kakaokey']
    elif 'eye' in d:
      tmp['eye'] = d['eye']
    with open('/home/pi/config.json', 'w') as f:
      json.dump(tmp, f)
    shutil.chown('/home/pi/config.json', 'pi', 'pi')
    pibo.config(tmp)
  await emit('config', {'kakaokey':tmp['kakaokey'], 'eye':tmp['eye']})

@app.sio.on('system')
async def system(sid, d=None):
  res = os.popen('/home/pi/openpibo-tools/tools/system.sh').read().split(',')
  await emit('system', res)

@app.sio.on('poweroff')
async def poweroff(sid, d=None):
  pibo.stop()
  os.system('shutdown -h now &')
  os.system('echo "#11:!" > /dev/ttyS0')

@app.sio.on('restart')
async def restart(sid, d=None):
  os.system("shutdown -r now")

@app.on_event("startup")
async def startup_event():
  global logger, pibo
  logger = log.configure_logger()
  logger.info(f'Network Display: {network_disp.run()}')
  pibo = Pibo(emit)

async def emit(key, data, callback=None):
  try:
    await app.sio.emit(key, data, callback=callback)
  except Exception as ex:
    logger.error(f'[emit] Error: {ex}')
    pass

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  #logger.info(f'Network Display: {network_disp.run()}')
  import uvicorn
  uvicorn.run("main:app", host="0.0.0.0", port=args.port)
  #pibo = Pibo(emit)
  #app.sio.run(app, host='0.0.0.0', port=args.port)
