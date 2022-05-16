from flask import Flask, render_template
from flask_socketio import SocketIO

# ValueError: Too many packets in payload issue
from engineio.payload import Payload
Payload.max_decode_packets = 50

import argparse
from lib import Pibo
from threading import Thread
import time, datetime, os, json, shutil
import network_disp
import log
logger = log.configure_logger()

try:
  app = Flask(__name__)
  socketio = SocketIO(app)
except Exception as ex:
  logger.error("Flask Error" + str(ex))

@app.route("/")
def main():
  return render_template('index.html')

# vision
@socketio.on('cartoon')
def f_cartoon(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.cartoon()

@socketio.on('detect')
def f_detect(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.object_detect()

# device
@socketio.on('set_neopixel')
def f_set_neopixel(d=None, methods=['GET', 'POST']):
  if pibo.onoff:
    pibo.set_neopixel(d)

@socketio.on('set_oled')
def f_set_oled(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.set_oled(d)

@socketio.on('mic')
def f_mic(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.mic(d)

# chatbot
@socketio.on('question')
def question(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.question(d)

# motion
@socketio.on('motor_init')
def motor_init(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.motor_init()

@socketio.on('set_pos')
def set_pos(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.set_pos(d['idx'], d['pos'])

@socketio.on('add_frame')
def add_frame(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.add_frame(d)

@socketio.on('remove_frame')
def remove_frame(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.remove_frame(d)

@socketio.on('init_frame')
def init_frame(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.init_frame()

@socketio.on('play_frame')
def play_frame(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.play_frame(d)

@socketio.on('add_motion')
def add_motion(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.add_motion(d)

@socketio.on('load_motion')
def load_motion(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.load_motion(d)

@socketio.on('del_motion')
def del_motion(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.del_motion(d)

@socketio.on('save')
def save(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.save()

@socketio.on('display')
def display(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.display()

@socketio.on('reset')
def reset(d=None, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.reset()

@socketio.on('onoff')
def onoff(d=None, method=['GET', 'POST']):
  if d != None:
    if d == 'on':
      pibo.start()
      network_disp.run()
    if d == 'off':
      pibo.stop()
      network_disp.run()
  socketio.emit('onoff', "on" if pibo.onoff else "off")

@socketio.on('wifi')
def wifi(d=None, method=['GET', 'POST']):
  if d == None:
    with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'r') as f:
      tmp = f.readlines()
      socketio.emit('wifi', {'ssid':tmp[4].split('"')[1], 'psk':tmp[5].split('"')[1]})
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
    network_disp.run()

@socketio.on('config')
def config(d=None, method=['GET', 'POST']):
  with open('/home/pi/config.json', 'r') as f:
    tmp = json.load(f)
  if d != None:
    if 'datapath' in d:
      tmp['datapath'] = d['datapath']
    elif 'kakaokey' in d:
      tmp['kakaokey'] = d['kakaokey']
    elif 'eyeled' in d:
      tmp['eyeled'] = d['eyeled']
    with open('/home/pi/config.json', 'w') as f:
      json.dump(tmp, f)
    shutil.chown('/home/pi/config.json', 'pi', 'pi')
    pibo.config(tmp)

  socketio.emit('config', {'datapath':tmp['datapath'], 'kakaokey':tmp['kakaokey'], 'eyeled':tmp['eyeled']})

@socketio.on('system')
def system(d=None, method=['GET', 'POST']):
  res = os.popen('/home/pi/openpibo-tools/project/system.sh').read().split(',')
  socketio.emit("system", res)

def emit(__key, __data, callback=None):
  try:
    socketio.emit(__key, __data, callback=callback)
  except Exception as ex:
    logger.error(f'[emit] Error: {ex}')
    pass

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  logger.info(f'Network Display: {network_disp.run()}')

  pibo = Pibo(emit)
  socketio.run(app, host='0.0.0.0', port=args.port)
