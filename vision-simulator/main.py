import os
import sys
import argparse
import base64
from openpibo.vision import *
import cv2

import time
from threading import Thread, Lock

import asyncio
from flask import Flask, render_template, Response
from flask_socketio import SocketIO

#cam = Camera()
#fac = Face()
#det = Detect()

app = Flask(__name__)
socketio = SocketIO(app)

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

#def gen_frames():
#  cam = Camera()
#  fac = Face()
#  det = Detect()
#  while True:
#    frame = cam.read()  # read the camera frame
#    bframe = cv2.imencode('.jpg', frame)[1].tobytes()
#    yield (b'--frame\r\n' + b'Content-Type: image/jpeg\r\n\r\n' + bframe + b'\r\n')  # concat frame one by one and show result

#@app.route('/video_feed')
#def video_feed():
#  return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame') 

def update():
  global frame
  while True:
    frame = cam.read()  # read the camera frame
    im = frame.copy()
    faces = fac.detect(im)
    if len(faces) > 0:
      x,y,w,h = faces[0]
      ret = fac.get_ageGender(frame, faces[0])
      
      color = (150,50,0) if ret["gender"] == "Male" else (50,150,0)
      cam.rectangle(im, (x,y), (x+w, y+h), color, 2)
      cam.putText(im, ret["gender"]+ret["age"], (x-10, y-10),0.8,color,2)
    im = cv2.imencode('.jpg', im)[1].tobytes()
    im = base64.b64encode(im).decode('utf-8')
    socketio.emit('stream', im, callback=None)
    time.sleep(0.1)

@app.route('/')
def sessions():
  return render_template('index.html')

#def messageReceived(methods=['GET', 'POST']):
#  print()

@socketio.on('cartoon')
def f_cartoon(d, method=['GET', 'POST']):
  im = cam.cartoonize(frame)
  im = cv2.imencode('.jpg', im)[1].tobytes()
  im = base64.b64encode(im).decode('utf-8')
  socketio.emit('cartoon', im, callback=None)

@socketio.on('detect')
def f_detect(d, method=['GET', 'POST']):
  im = frame.copy()
  objs = det.detect_object(im)
  qr = det.detect_qr(im)

  asyncio.set_event_loop(asyncio.new_event_loop())
  loop = asyncio.get_event_loop()
  funcs = [async_detect_object(im), async_detect_qr(im)]
  objs, qr = loop.run_until_complete(asyncio.gather(*funcs))

  if qr["type"] != "":
    cam.putText(im, qr["data"], (30, 30),1,(0,0,255),2)

  for obj in objs:
    x1,y1,x2,y2 = obj["position"]
    cam.rectangle(im, (x1,y1), (x2, y2),(0,255,0),2)
    cam.putText(im, obj["name"], (x1-10, y1-10),0.8,(0,255,0),2)
  
  im = cv2.imencode('.jpg', im)[1].tobytes()
  im = base64.b64encode(im).decode('utf-8')
  socketio.emit('detect', im, callback=None)

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import network_disp
  print("Network Display:", network_disp.run())
  
  cam = Camera()
  fac = Face()
  det = Detect()
  
  Thread(name="stream", target=update, args=(), daemon=True).start()
  socketio.run(app, host='0.0.0.0', port=args.port, debug=False)
