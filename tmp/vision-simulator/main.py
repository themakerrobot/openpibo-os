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

def to_base64(im):
  im = cv2.imencode('.jpg', im)[1].tobytes()
  return base64.b64encode(im).decode('utf-8')

def update():
  global frame
  while True:
    frame = cam.read()  # read the camera frame
    im = frame.copy()
    socketio.emit('stream', to_base64(cv2.resize(im,(320,240))), callback=None)

@app.route('/')
def sessions():
  return render_template('index.html')

#def messageReceived(methods=['GET', 'POST']):
#  print()

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
    colors = (50,200,50)
    cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
    cam.putText(im, "QR", (x1-10, y1-10),0.6,colors,2)
    res_qr += "[{}-({},{})] ".format(qr["data"], x1, y1)

  for obj in objs:
    x1,y1,x2,y2 = obj["position"]
    colors = (50,50,200)
    cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
    cam.putText(im, obj["name"], (x1-10, y1-10),0.6,colors,2)
    res_object += "[{}-({},{})] ".format(obj["name"], x1, y1)
  
  socketio.emit('detect', {"img":to_base64(im), "data":{"face":res_face, "qr":res_qr, "object":res_object}}, callback=None)

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
