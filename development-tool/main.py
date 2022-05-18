from flask import Flask, render_template
from flask_socketio import SocketIO

from datetime import datetime
from threading import Thread
import os,sys,subprocess,time,argparse
import cv2,base64

try:
  from flask_codemirror import CodeMirror
  from flask_codemirror.fields import CodeMirrorField
  from flask_wtf import FlaskForm
except:
  os.system('sudo pip3 install -r /home/pi/openpibo-tools/development-tool/requirements.txt')
  from flask_codemirror import CodeMirror
  from flask_codemirror.fields import CodeMirrorField
  from flask_wtf import FlaskForm


EXEC = sys.executable
CodePath = os.path.join('/tmp/test.py')
ImagePath = os.path.join('/tmp/test.jpg')

p = None
t = None
return_log = ""

def decode(s):
  try:
    return s.decode('utf-8')
  except UnicodeDecodeError:
    return s.decode('gbk')

def to_base64(im):
  im = cv2.imencode('.jpg', im)[1].tobytes()
  return base64.b64encode(im).decode('utf-8')

def python_exec(code):
  global p, return_log
  with open(CodePath, 'w', encoding='utf-8') as f:
    f.write(code)
  try:
    p = subprocess.Popen([EXEC, "-u", CodePath],
                 stdout=subprocess.PIPE,
                 stderr=subprocess.STDOUT,
                 universal_newlines=True)
  except subprocess.CalledProcessError as e:
    socketio.emit('updatelog', decode(e.output))
  else:
    while p.poll() == None:
      return_log += p.stdout.readline()
      socketio.emit('updatelog', return_log)
      time.sleep(0.001)
  finally:
    return_log += 'All programs terminated'
    socketio.emit('updatelog', return_log)

class MyForm(FlaskForm):
  code_configs ={
    'lineNumbers': 'true',
  }
  codepath = CodePath
  imgpath = ImagePath
  source_code = CodeMirrorField(language='python', config=code_configs)

# mandatory
CODEMIRROR_LANGUAGES = ['python']
#CODEMIRROR_LANGUAGES = ['python', 'yaml', 'htmlembedded']
WTF_CSRF_ENABLED = True
SECRET_KEY = 'secret'
# optional
CODEMIRROR_THEME = 'cobalt'
#CODEMIRROR_ADDONS = (
#    ('fold','foldgutter'),
#)

app = Flask(__name__)
app.config.from_object(__name__)
codemirror = CodeMirror(app)
socketio = SocketIO(app)

@app.route('/', methods = ['GET', 'POST'])
def index():
  form = MyForm()
  return render_template('index.html', form=form)

@socketio.on('stop')
def stop():
  global return_log
  if p != None and p.poll() == None:
    p.kill()
    t.join()
  return_log = ""
  socketio.emit('updatelog', return_log)

@socketio.on('show')
def show():
  try:
    img = to_base64(cv2.imread(ImagePath))
  except Exception as ex:
    img = None
  finally:
    socketio.emit('show', img)

@socketio.on('compile')
def compile(text):
  global t,return_log
  if p != None and p.poll() == None:
    p.kill()
    t.join()

  return_log = '{}: pi@themaker:~ $ sudo python{} {}'.format(datetime.now(), sys.version_info.major, CodePath)
  return_log += '\n' + ''.join([ '=' for _ in range(len(return_log))]) + '\n'
  t = Thread(name="python_exec", target=python_exec, args=(text,), daemon=True)
  t.start()

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=50000)
  args = parser.parse_args()

  os.system('v4l2-ctl -c vertical_flip=1,horizontal_flip=1,white_balance_auto_preset=3')
  socketio.run(app, host='0.0.0.0', port=args.port)
