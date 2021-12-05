from flask import Flask, render_template
from flask_socketio import SocketIO
from openpibo.motion import Motion
import os,json,shutil
import argparse

app = Flask(__name__)
socketio = SocketIO(app)

motors = {
  'Right Foot': 0,
  'Right Leg' : 1,
  'Right Arm' : 2,
  'Right Hand': 3,
  'Head Pan'  : 4,
  'Head Tilt' : 5,
  'Left Foot' : 6,
  'Left Leg'  : 7,
  'Left Arm'  : 8,
  'Left Hand' : 9,
}

# current d value
__d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0]
# current pos list value
__p = []
# current json value
__j = {}

pibo = Motion()
pibo.set_speeds([50,50,50,50,50, 50,50,50,50,50])
pibo.set_accelerations([0,0,0,0,0,0,0,0,0,0])
pibo.set_motors(__d)

def make_raw():
  return {'init_def':1, 'init':__p[0]['d'], 'pos':__p[1:]} if __p[0]['seq'] == 0 else {'init_def':0, 'pos':__p}


@app.route("/")
def main():
  return render_template('index.html')

@socketio.on('motor_init')
def init():
  socketio.emit('init_motion', __d)
  socketio.emit('disp_record', __p)

@socketio.on('set_pos')
def set_pos(motor_idx, motor_val):
  global __d
  __d[motor_idx] = motor_val
  pibo.set_speed(motor_idx, 50)
  pibo.set_acceleration(motor_idx, 0)
  pibo.set_motor(motor_idx, motor_val)


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
  pibo.set_motion_raw(raw, int(cycle))


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


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import network_disp
  print("Network Display:", network_disp.run())

  try:
    with open("/home/pi/mymotion.json", "rb") as f:
      __j = json.load(f)
  except Exception as ex:
    print("Error:", ex)
    pass
  
  socketio.emit('disp_code', __j)
  socketio.run(app, host='0.0.0.0', port=args.port)
