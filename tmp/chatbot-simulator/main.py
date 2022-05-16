from flask import Flask, render_template
from flask_socketio import SocketIO
from openpibo.speech import Dialog 
import datetime
from queue import Queue
import argparse

app = Flask(__name__)
socketio = SocketIO(app)

dialog = Dialog()
record = []

@app.route("/")
def main():
  return render_template('index.html')

@socketio.on('question')
def question(q):
  global record
  ans = dialog.get_dialog(q)
  record.append([str(datetime.datetime.now()).split('.')[0], q, ans])
  socketio.emit('answer', {"answer":ans, "record":list(reversed(record))})

  if len(record) == 5:
    record.pop(0)

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=80)
  args = parser.parse_args()

  import network_disp
  print("Network Display:", network_disp.run())

  socketio.run(app, host='0.0.0.0', port=args.port)
