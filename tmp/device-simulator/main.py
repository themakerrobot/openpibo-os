import os
import sys
import argparse

from openpibo.device import Device

import time
from threading import Thread, Lock

from flask import Flask, render_template
from flask_socketio import SocketIO

from queue import Queue

system_value = ['','','','','','']
neopixel_value = [0,0,0,0,0,0]
obj = Device()
next_cmd = [False, ""]
que = Queue()
app = Flask(__name__)
socketio = SocketIO(app)

def send_message(code, data=""):
  global que
  pkt = "#{}:{}!".format(code, data)
  que.put(pkt)
  #if obj.locked() == True:
  #  next_cmd = [True, pkt]
  #else:
  #  next_cmd = [False, ""]
  #  data = obj.send_raw(pkt)

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

def update():
  system_check_time = time.time()
  battery_check_time = time.time()

  while True:
    if que.qsize() > 0:
      data = obj.send_raw(que.get())
      decode_pkt(data)

    if time.time() - system_check_time > 1:  # 시스템 메시지 1초 간격 전송
      data = obj.send_cmd(Device.code_list['SYSTEM'])
      decode_pkt(data)
      system_check_time = time.time()

    if time.time() - battery_check_time > 10: # 배터리 메시지 10초 간격 전송
      data = obj.send_cmd(Device.code_list['BATTERY'])
      decode_pkt(data)
      battery_check_time = time.time()

    time.sleep(0.01)

@app.route('/')
def sessions():
  return render_template('index.html')

#def messageReceived(methods=['GET', 'POST']):
#  print()

@socketio.on('set_neopixel')
def f_set_neopixel(d, methods=['GET', 'POST']):
  global neopixel_value
  neopixel_value[d['idx']] = d['value']
  send_message(Device.code_list['NEOPIXEL_EACH'], ",".join([str(_) for _ in neopixel_value]))

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import network_disp
  print("Network Display:", network_disp.run())

  send_message(Device.code_list['BATTERY'], "on")
  send_message(Device.code_list['PIR'], "on")
  send_message(Device.code_list['DC_CONN'])
  send_message(Device.code_list['NEOPIXEL_EACH'], ",".join([str(_) for _ in neopixel_value]))
  
  t = Thread(target=update, args=())
  t.daemon = True
  t.start()

  socketio.run(app, host='0.0.0.0', port=args.port, debug=False)
