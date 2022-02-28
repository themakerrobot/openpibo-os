from flask import Flask, render_template
from flask_socketio import SocketIO
import argparse

from lib import Pibo

from threading import Thread
import time, datetime, os

app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/")
def main():
  return render_template('index.html')

# vision
@socketio.on('cartoon')
def f_cartoon(d, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.cartoon()

@socketio.on('detect')
def f_detect(d, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.object_detect()

# device
@socketio.on('set_neopixel')
def f_set_neopixel(d, methods=['GET', 'POST']):
  if pibo.onoff:
    pibo.set_neopixel(d)

@socketio.on('set_oled')
def f_set_oled(d, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.set_oled(d)

@socketio.on('mic')
def f_mic(d, method=['GET', 'POST']):
  if pibo.onoff:
    pibo.mic(d)

# chatbot
@socketio.on('question')
def question(q):
  if pibo.onoff:
    pibo.question(q)

# motion
@socketio.on('motor_init')
def motor_init():
  if pibo.onoff:
    pibo.motion_init()

@socketio.on('set_pos')
def set_pos(idx, pos):
  if pibo.onoff:
    pibo.set_pos(idx, pos)

@socketio.on('add_frame')
def add_frame(seq):
  if pibo.onoff:
    pibo.add_frame(seq)

@socketio.on('remove_frame')
def remove_frame(seq):
  if pibo.onoff:
    pibo.remove_frame(seq)

@socketio.on('init_frame')
def init_frame():
  if pibo.onoff:
    pibo.init_frame()

@socketio.on('play_frame')
def play_frame(cycle):
  if pibo.onoff:
    pibo.play_frame(cycle)

@socketio.on('add_motion')
def add_motion(name):
  if pibo.onoff:
    pibo.add_motion(name)

@socketio.on('load_motion')
def load_motion(name):
  if pibo.onoff:
    pibo.load_motion(name)

@socketio.on('del_motion')
def del_motion(name):
  if pibo.onoff:
    pibo.del_motion(name)

@socketio.on('save')
def save():
  if pibo.onoff:
    pibo.save()

@socketio.on('display')
def display():
  if pibo.onoff:
    pibo.display()

@socketio.on('reset')
def reset():
  if pibo.onoff:
    pibo.reset()

@socketio.on('onoff')
def onoff(d=None):
  if d != None:
    if d == 'on':
      pibo.start()
    if d == 'off':
      pibo.stop()
  socketio.emit('onoff', "on" if pibo.onoff else "off")

def emit(__key, __data, callback=None):
  socketio.emit(__key, __data, callback=callback)

def system_loop():
  while True:
    res = os.popen('/home/pi/openpibo-tools/project2/system.sh').read().split(',')
    socketio.emit("system", res)
    time.sleep(10)

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import network_disp
  print("Network Display:", network_disp.run())

  Thread(name="system_loop", target=system_loop, args=(), daemon=True).start()

  pibo = Pibo(emit)
  socketio.run(app, host='0.0.0.0', port=args.port)
