from flask import Flask, render_template
from flask_socketio import SocketIO
import os,json,shutil
import argparse

from lib import Pibo

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
@socketio.on('cartoon')
def f_cartoon(d, method=['GET', 'POST']):

@socketio.on('detect')
def f_detect(d, method=['GET', 'POST']):

@socketio.on('set_neopixel')
def f_set_neopixel(d, methods=['GET', 'POST']):

@socketio.on('set_oled')
def f_set_oled(d, method=['GET', 'POST']):

@socketio.on('question')
def question(q):

@socketio.on('motor_init')
def motor_init():

@socketio.on('set_pos')
def set_pos(motor_idx, motor_val):

@socketio.on('add_frame')
def add_frame(seq):

@socketio.on('remove_frame')
def remove_frame(seq):

@socketio.on('init_frame')
def init_frame():

@socketio.on('play_frame')
def set_motion(cycle):

@socketio.on('add_motion')
def add_motion(name):

@socketio.on('load_motion')
def load_motion(name):

@socketio.on('del_motion')
def del_motion(name):

@socketio.on('save')
def export():

@socketio.on('display')
def display():

@socketio.on('reset')
def reset():

def emit(__key, __data):
  sockeio.emit(__key, __data, callback=None)

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import network_disp
  print("Network Display:", network_disp.run())

  pibo = Pibo(emit)
  pibo.start()
  socketio.run(app, host='0.0.0.0', port=args.port)
