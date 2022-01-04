from flask import Flask, render_template
from flask_socketio import SocketIO
import os,json,shutil
import argparse

from openpibo.speech import Dialog
from openpibo.vision import *
from openpibo.device import Device
from openpibo.motion import Motion
from openpibo.oled import Oled

import base64
import cv2
import asyncio
from threading import Thread, Lock
from queue import Queue
import datetime

app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/")
def main():
  return render_template('index.html')

# vision
async def async_detect_face(im):
  def f():
    return fac.detect(im)
  loop = asyncio.get_event_loop()
  return await loop.run_in_executor(None, f)

async def async_detect_object(im):
  def f():
    return det.detect_object(im)
  loop = asyncio.get_event_loop()
  return await loop.run_in_executor(None, f)

async def async_detect_qr(im):
  def f():
    return det.detect_qr(im)
  loop = asyncio.get_event_loop()
  return await loop.run_in_executor(None, f)

def to_base64(im):
  im = cv2.imencode('.jpg', im)[1].tobytes()
  return base64.b64encode(im).decode('utf-8')

def vision_loop():
  global frame
  while True:
    frame = cam.read()  # read the camera frame
    im = frame.copy()
    socketio.emit('stream', to_base64(cv2.resize(im, (320,240))), callback=None)

@socketio.on('cartoon')
def f_cartoon(d, method=['GET', 'POST']):
  im = frame.copy()
  im = cam.cartoonize(frame)
  socketio.emit('cartoon', to_base64(im), callback=None)

@socketio.on('detect')
def f_detect(d, method=['GET', 'POST']):
  im = frame.copy()
  asyncio.set_event_loop(asyncio.new_event_loop())
  loop = asyncio.get_event_loop()
  funcs = [async_detect_face(im), async_detect_object(im), async_detect_qr(im)]
  faces, objs, qr = loop.run_until_complete(asyncio.gather(*funcs))

  res_face = ""
  res_qr = ""
  res_object = ""

  if len(faces) > 0:
    x,y,w,h = faces[0]
    face = fac.get_ageGender(frame, faces[0])
    colors = (200,100,0) if face["gender"] == "Male" else (100,200,0)
    cam.rectangle(im, (x,y), (x+w, y+h), colors, 1)
    cam.putText(im, face["gender"]+face["age"], (x-10, y-10),0.6,colors,2)
    res_face += "[{}/{}-({},{})] ".format(face["gender"], face["age"], x, y)

  if qr["type"] != "":
    x1,y1,x2,y2 = qr["position"]
    colors = (100,0,200)
    cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
    cam.putText(im, "QR", (x1-10, y1-10),0.6,colors,2)
    res_qr += "[{}-({},{})] ".format(qr["data"], x1, y1)

  for obj in objs:
    x1,y1,x2,y2 = obj["position"]
    colors = (100,100,200)
    cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
    cam.putText(im, obj["name"], (x1-10, y1-10),0.6,colors,2)
    res_object += "[{}-({},{})] ".format(obj["name"], x1, y1)

  socketio.emit('detect', {"img":to_base64(im), "data":{"face":res_face, "qr":res_qr, "object":res_object}}, callback=None)

# device
system_value = ['','','','','','']
neopixel_value = [0,0,0,0,0,0]
next_cmd = [False, ""]
que = Queue()

def send_message(code, data=""):
  global que
  pkt = "#{}:{}!".format(code, data)
  que.put(pkt)

def decode_pkt(pkt):
  global system_value
  print("Recv:", pkt, pkt.split(":")[1].split("-"))
  pkt = pkt.split(":")
  code, data = pkt[0], pkt[1]

  if code == "15": # battery
    socketio.emit('update_battery', data, callback=None)

  if code == "14": # dc
    system_value[2] = data
    socketio.emit('update_device', system_value, callback=None)

  if code == "40": # system
    data = data.split("-")

    if data[2] == '':
      data[2] = system_value[2]

    system_value = data
    socketio.emit('update_device', system_value, callback=None)

def device_loop():
  system_check_time = time.time()
  battery_check_time = time.time()

  while True:
    if que.qsize() > 0:
      data = dev.send_raw(que.get())
      decode_pkt(data)

    if time.time() - system_check_time > 1:  # 시스템 메시지 1초 간격 전송
      data = dev.send_cmd(Device.code_list['SYSTEM'])
      decode_pkt(data)
      system_check_time = time.time()

    if time.time() - battery_check_time > 10: # 배터리 메시지 10초 간격 전송
      data = dev.send_cmd(Device.code_list['BATTERY'])
      decode_pkt(data)
      battery_check_time = time.time()

    time.sleep(0.01)

@socketio.on('set_neopixel')
def f_set_neopixel(d, methods=['GET', 'POST']):
  global neopixel_value
  neopixel_value[d['idx']] = d['value']
  send_message(Device.code_list['NEOPIXEL_EACH'], ",".join([str(_) for _ in neopixel_value]))

@socketio.on('set_oled')
def f_set_oled(d, method=['GET', 'POST']):
  ole.clear()
  ole.set_font(size=d['size'])
  ole.draw_text((d['x'], d['y']), d['text'])
  ole.show()

## chatbot
chat_list = []

@socketio.on('question')
def question(q):
  global chat_list
  ans = dialog.get_dialog(q)
  chat_list.append([str(datetime.datetime.now()).split('.')[0], q, ans])
  socketio.emit('answer', {"answer":ans, "chat_list":list(reversed(chat_list))})

  if len(chat_list) == 5:
    chat_list.pop(0)

## motion
__d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
__p = [] # current pos list value
__j = {} # current json value

def make_raw():
  return {'init_def':1, 'init':__p[0]['d'], 'pos':__p[1:]} if __p[0]['seq'] == 0 else {'init_def':0, 'pos':__p}

@socketio.on('motor_init')
def motor_init():
  socketio.emit('init_motion', __d)
  socketio.emit('disp_record', __p)

@socketio.on('set_pos')
def set_pos(motor_idx, motor_val):
  global __d
  __d[motor_idx] = motor_val
  mot.set_speed(motor_idx, 50)
  mot.set_acceleration(motor_idx, 0)
  mot.set_motor(motor_idx, motor_val)

@socketio.on('add_frame')
def add_frame(seq):
  global __p
  seq = int(seq)
  _check = False
  for idx, pos in enumerate(__p):
    if pos['seq'] == seq:
      __p[idx] = {"d": __d[:], "seq": int(seq)}
      _check = True
      break

  if _check == False:
    __p.append({"d": __d[:], "seq": int(seq)})
    __p.sort(key=lambda x: x['seq'])

  socketio.emit('disp_record', __p)

@socketio.on('remove_frame')
def remove_frame(seq):
  for idx, pos in enumerate(__p):
    if pos['seq'] == seq:
      del __p[idx]
      break

@socketio.on('init_frame')
def init_frame():
  global __p
  __p = []

@socketio.on('play_frame')
def set_motion(cycle):
  raw = make_raw()
  mot.set_motion_raw(raw, int(cycle))

@socketio.on('add_motion')
def add_motion(name):
  __j[name] = make_raw()
  socketio.emit('disp_code', __j)

@socketio.on('load_motion')
def load_motion(name):
  global __p

  if name in __j:
    __p = []
    a = __j[name]

    if 'init_def' in a and 'init' in a:
      __p.append({'d':a['init'], 'seq':0})
    if 'pos' in a:
      for item in a['pos']:
        __p.append(item)
  socketio.emit('disp_record', __p)

@socketio.on('del_motion')
def del_motion(name):
  if name in __j:
    del __j[name]
  socketio.emit('disp_code', __j)

@socketio.on('save')
def export():
  with open("/home/pi/mymotion.json", "w") as f:
    json.dump(__j, f)
  shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
  socketio.emit('disp_code', __j)

@socketio.on('display')
def display():
  socketio.emit('disp_code', __j)

@socketio.on('reset')
def reset():
  __j = {}
  os.remove('/home/pi/mymotion.json')
  socketio.emit('disp_code', __j)

def system_loop():

  while True:
    res = os.popen('/home/pi/openpibo-tools/project/system.sh').read().split(',')
    socketio.emit("system", res)
    time.sleep(10)

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import network_disp
  print("Network Display:", network_disp.run())

  cam = Camera()
  fac = Face()
  det = Detect()
  mot = Motion()
  dev = Device()
  ole = Oled()
  dialog = Dialog()

  mot.set_speeds([50,50,50,50,50, 50,50,50,50,50])
  mot.set_accelerations([0,0,0,0,0,0,0,0,0,0])
  mot.set_motors(__d)

  send_message(Device.code_list['BATTERY'], "on")
  send_message(Device.code_list['PIR'], "on")
  send_message(Device.code_list['DC_CONN'])
  send_message(Device.code_list['NEOPIXEL_EACH'], ",".join([str(_) for _ in neopixel_value]))

  Thread(name="device_loop", target=device_loop, args=(), daemon=True).start()
  Thread(name="vision_loop", target=vision_loop, args=(), daemon=True).start()
  Thread(name="system_loop", target=system_loop, args=(), daemon=True).start()

  try:
    with open("/home/pi/mymotion.json", "rb") as f:
      __j = json.load(f)
  except Exception as ex:
    print("Error:", ex)
    pass

  socketio.emit('disp_code', __j)
  socketio.run(app, host='0.0.0.0', port=args.port)
