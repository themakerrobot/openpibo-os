
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

def to_base64(im):
  im = cv2.imencode('.jpg', im)[1].tobytes()
  return base64.b64encode(im).decode('utf-8')

class Pibo:
  def __init__(self, emit_function=None):
    self.emit = emit_function

  def start(self):
    self.chat_list = []
    self.system_value = ['','','','','','']
    self.neopixel_value = [0,0,0,0,0,0]
    self.next_cmd = [False, ""]
    self.que = Queue()

    self.__d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
    self.__p = [] # current pos list value
    self.__j = {} # current json value
    
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
    self.onoff = True

  def stop(self):
    self.onoff = False

  def system_loop(self):
    while True:
      if self.onoff == False:
        break
      res = os.popen('/home/pi/openpibo-tools/project/system.sh').read().split(',')
      socketio.emit("system", res)
      time.sleep(10)

  # vision
  def vision_loop():
    while True:
      if self.onoff == False:
        break
      self.frame = cam.read()  # read the camera frame
      im = self.frame.copy()
      socketio.emit('stream', to_base64(cv2.resize(im, (320,240))), callback=None)
  
  def cartoon(self):
    im = self.frame.copy()
    im = cam.cartoonize(im)
    socketio.emit('cartoon', to_base64(im), callback=None)

  def detect(self):
    im = self.frame.copy()
    faces = fac.detect(im)
    objs = det.detect_object(im)
    qr = det.detect_qr(im)

    res_face = ""
    res_qr = ""
    res_object = ""

    if len(faces) > 0:
      x,y,w,h = faces[0]
      face = fac.get_ageGender(im, faces[0])
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


  ## chatbot
  def question(self, q):
    ans = dialog.get_dialog(q)
    self.chat_list.append([str(datetime.datetime.now()).split('.')[0], q, ans])
    socketio.emit('answer', {"answer":ans, "chat_list":list(reversed(self.chat_list))})

    if len(self.chat_list) == 5:
      self.chat_list.pop(0)



  ## device
  def send_message(self, code, data=""):
    self.que.put("#{}:{}!".format(code, data))

  def set_neopixel(self, d):
    self.neopixel_value[d['idx']] = d['value']
    self.send_message(Device.code_list['NEOPIXEL_EACH'], ",".join([str(_) for _ in self.neopixel_value]))

  def set_oled(self, d):
    ole.clear()
    ole.set_font(size=d['size'])
    ole.draw_text((d['x'], d['y']), d['text'])
    ole.show()


  def decode_pkt(self, pkt):
    print("Recv:", pkt, pkt.split(":")[1].split("-"))
    pkt = pkt.split(":")
    code, data = pkt[0], pkt[1]

    if code == "15": # battery
      socketio.emit('update_battery', data, callback=None)

    if code == "14": # dc
      self.system_value[2] = data
      socketio.emit('update_device', self.system_value, callback=None)

    if code == "40": # system
      data = data.split("-")

      if data[2] == '':
        data[2] = self.system_value[2]

      self.system_value = data
      socketio.emit('update_device', self.system_value, callback=None)

  def device_loop(self):
    system_check_time = time.time()
    battery_check_time = time.time()

    while True:
      if self.onoff == False:
        break
        
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

## motion

def make_raw(self):
  return {'init_def':1, 'init':__p[0]['d'], 'pos':__p[1:]} if __p[0]['seq'] == 0 else {'init_def':0, 'pos':__p}

def motor_init(self):
  socketio.emit('init_motion', __d)
  socketio.emit('disp_record', __p)

def set_pos(self, motor_idx, motor_val):
  __d[motor_idx] = motor_val
  mot.set_speed(motor_idx, 50)
  mot.set_acceleration(motor_idx, 0)
  mot.set_motor(motor_idx, motor_val)

def add_frame(self, seq):
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

def remove_frame(self, seq):
  for idx, pos in enumerate(__p):
    if pos['seq'] == seq:
      del __p[idx]
      break

def init_frame(self):
  __p = []

def set_motion(self, cycle):
  raw = make_raw()
  mot.set_motion_raw(raw, int(cycle))

def add_motion(self, name):
  __j[name] = make_raw()
  socketio.emit('disp_code', __j)

def load_motion(self, name):
  if name in __j:
    __p = []
    a = __j[name]

    if 'init_def' in a and 'init' in a:
      __p.append({'d':a['init'], 'seq':0})
    if 'pos' in a:
      for item in a['pos']:
        __p.append(item)
  socketio.emit('disp_record', __p)

def del_motion(self, name):
  if name in __j:
    del __j[name]
  socketio.emit('disp_code', __j)

def export(self):
  with open("/home/pi/mymotion.json", "w") as f:
    json.dump(__j, f)
  shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
  socketio.emit('disp_code', __j)

def display(self):
  socketio.emit('disp_code', __j)

def reset(self):
  __j = {}
  os.remove('/home/pi/mymotion.json')
  socketio.emit('disp_code', __j)
