from flask import Flask, render_template
from flask_socketio import SocketIO
from openpibo.motion import Motion
from copy import copy
import json
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

current_d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0]
pos_table = []

pibo = Motion()
pibo.set_speeds([20,50,40,20, 20,10, 20,50,40,20])
pibo.set_accelerations([10,10,10,10, 10,10, 10,10,10,10])
pibo.set_motors(current_d)


@app.route("/")
def main():
    return render_template('main.html')

@socketio.on('motor_init')
def init():
    socketio.emit('init_motion', current_d)
    socketio.emit('disp_record', pos_table)

@socketio.on('set_pos')
def set_pos(motor_idx, motor_val):
    global current_d
    current_d[motor_idx] = motor_val
    pibo.set_motor(motor_idx, motor_val)

@socketio.on('add_frame')
def add_frame(seq):
    if int(seq) not in map(lambda x: x['seq'], pos_table):
        pos_table.append({"d": copy(current_d), "seq": int(seq)})
        pos_table.sort(key=lambda x: x['seq'])
        socketio.emit('disp_record', pos_table)

@socketio.on('remove_frame')
def remove_frame(seq):
    for idx, pos in enumerate(pos_table):
        if pos['seq'] == seq:
            del pos_table[idx]
            break

@socketio.on('init_frame')
def init_frame():
    global pos_table
    pos_table = []

def make_raw():
    raw = {}
    if pos_table[0]['seq'] == 0:
        raw.setdefault('init_def', 1)
        raw.setdefault('init', pos_table[0]['d'])
    else:
        raw.setdefault('init_def', 0)
    raw.setdefault('pos', pos_table)
    return raw

@socketio.on('play_frame')
def set_motion(cycle):
    raw = make_raw()
    pibo.set_motion_raw(raw, int(cycle))

@socketio.on('export')
def export(motion_name):
    if not pos_table:
        socketio.emit('disp_code', "작성된 동작이 없습니다.")
    else:
        raw = make_raw()
        if motion_name == "":
            motion_name = 'TEST'
        code = {motion_name: raw}
        # json파일 만들기
        with open(f"{motion_name}.json", "w") as f:
            json.dump(code, f)
        code = "module.exports="+str(code)
        socketio.emit('disp_code', code)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', help='set port number', default=8888)
    args = parser.parse_args()
    socketio.run(app, host='0.0.0.0', port=args.port)