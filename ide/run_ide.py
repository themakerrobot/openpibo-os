import os
import sys
import asyncio
import shutil
import base64
import datetime
import subprocess
from pathlib import Path
from typing import List, Union

from fastapi import FastAPI, Request, UploadFile, File, Form, Body, Depends
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager
from starlette.websockets import WebSocketDisconnect
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
  asyncio.create_task(periodic_system_update())
  yield

try:
  app = FastAPI(lifespan=lifespan)
  socket_manager = SocketManager(app=app, mount_location='/socket.io')
  templates = Jinja2Templates(directory="templates")

  app.mount("/static", StaticFiles(directory="static"), name="static")
  app.mount("/svg", StaticFiles(directory="svg"), name="svg")
  app.mount("/webfonts", StaticFiles(directory="webfonts"), name="webfonts")
except Exception as ex:
  print(f'Server error{ex}')

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

codeExec = {
  'python': 'python3',
  'shell': 'sh',
}

protectList = [
  '/home/pi/openpibo-os',
  '/home/pi/openpibo-files',
  '/home/pi/node_modules',
  '/home/pi/package.json',
  '/home/pi/package-lock.json',
  '/home/pi/config.json',
]

ENV_PATH = '/home/pi/.pyenv/bin'
record = ''
ps = None
PATH = '/home/pi/code'
codeText = ''
codePath = ''

mutex = asyncio.Lock()


def is_protect(p):
  for protected_path in protectList:
    if protected_path in p:
      return True
  return False


def read_directory(d):
  dlst = []
  flst = []
  try:
    for p in os.scandir(d):
      if p.is_dir(follow_symlinks=False) or p.is_symlink():
        dlst.append({
          'name': p.name,
          'type': 'folder',
          'protect': is_protect(f"{d}/{p.name}")
        })
      else:
        flst.append({
          'name': p.name,
          'type': 'file',
          'protect': is_protect(d) or is_protect(f"{d}/{p.name}")
        })
  except Exception as err:
    print(err)
    return False
  return dlst + flst


def file_extension_check(filename):
  return filename.split('.')[-1].lower()


@app.get('/dir')
async def get_directory(folderName: str):
  #file_types = filetype.split(",")
  files = []
  try:
    for p in os.scandir(folderName):
      if not p.is_dir() and not p.is_symlink() and not p.name.startswith('.'):
        #ext = file_extension_check(p.name)
        #if ext in file_types:
        files.append(p.name)
  except Exception as err:
    files = []
  return files


@app.get('/', response_class=HTMLResponse)
async def read_root(request: Request):
  return templates.TemplateResponse("index.html", {"request": request})


@app.get('/download')
async def download_file(filename: str):
  if is_protect(os.path.join(PATH, filename)):
    await socket_manager.emit('update', {'dialog': '파일 다운로드 오류: 보호 디렉토리입니다.'})
    return JSONResponse(content={'error': '파일 다운로드 오류: 보호 디렉토리입니다.'}, status_code=403)
  return FileResponse(os.path.join(PATH, filename), filename=filename)


@app.post('/upload')
async def upload_file(files: List[UploadFile] = File(...)):
  if is_protect(PATH):
    await socket_manager.emit('update', {'dialog': '파일 업로드 오류: 보호 디렉토리입니다.'})
    return JSONResponse(content={'error': '파일 업로드 오류: 보호 디렉토리입니다.'}, status_code=403)
  for file in files:
    file_location = os.path.join(PATH, file.filename)
    with open(file_location, "wb") as f:
      content = await file.read()
      f.write(content)
  # Update file manager
  directory_data = read_directory(PATH)
  await socket_manager.emit('update_file_manager', {'data': directory_data})
  try:
    shutil.chown(PATH, user='pi', group='pi')
  except Exception as err:
    print(err)
  return JSONResponse(content={"message": "파일 업로드 완료"}, status_code=200)


@app.post('/show')
async def show_file(data: UploadFile = File(...)):
  try:
    tmp_path = '/home/pi/.tmp.jpg'
    with open(tmp_path, 'wb') as f:
      content = await data.read()
      f.write(content)
    with open(tmp_path, 'rb') as f:
      image_data = f.read()
      encoded_image = base64.b64encode(image_data).decode('utf-8')
      await socket_manager.emit('update', {'image': encoded_image, 'filepath': tmp_path})
  except Exception as err:
    print(err)
    await socket_manager.emit('update', {'dialog': f'보기 오류: {str(err)}'})
  return JSONResponse(content={"message": "이미지 표시 완료"}, status_code=200)


@app.sio.on('connection')
async def handle_connection(sid, *args, **kwargs):
  pass  # Placeholder for any connection initialization


@app.sio.on('init')
async def handle_init(sid):
  global codeText, codePath
  try:
    system_info = subprocess.check_output(['/home/pi/openpibo-os/system/system.sh']).decode().strip().split(',')
    await app.sio.emit('system', system_info)
  except Exception as err:
    print(err)
    await app.sio.emit('update', {'dialog': '초기화: 시스템 파일 오류입니다.'})

  try:
    with open(codePath, 'r') as f:
      codeText = f.read()
  except Exception as err:
    codeText = ''
  await app.sio.emit('init', {'codepath': codePath, 'codetext': codeText, 'path': PATH})


@app.sio.on('reset_log')
async def handle_reset_log(sid):
  global record
  record = f'[{datetime.datetime.now()}]: \n\n'
  subprocess.Popen([f'{ENV_PATH}/python3', '/home/pi/openpibo-os/system/network_disp.py'])


@app.sio.on('poweroff')
async def handle_poweroff(sid):
  subprocess.Popen(['shutdown', '-h', 'now'])
  subprocess.Popen(['echo', '"#11:!"', '>', '/dev/ttyS0'])


@app.sio.on('restart')
async def handle_restart(sid):
  subprocess.Popen(['shutdown', '-r', 'now'])


@app.sio.on('load_directory')
async def handle_load_directory(sid, p):
  global PATH
  res = read_directory(p)
  if res is not False:
    PATH = p
  else:
    res = read_directory(PATH)
  await app.sio.emit('update_file_manager', {'data': res, 'path': PATH})

@app.sio.on('view')
async def handle_view(sid, p):
  try:
    with open(p, 'rb') as f:
      data = f.read()
      encoded_image = base64.b64encode(data).decode('utf-8')
      await app.sio.emit('update', {'image': encoded_image, 'filepath': p})
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'보기 오류: {str(err)}'})


@app.sio.on('play')
async def handle_play(sid, p):
  try:
    with open(p, 'rb') as f:
      data = f.read()
      encoded_audio = base64.b64encode(data).decode('utf-8')
      await app.sio.emit('update', {'audio': encoded_audio, 'filepath': p})
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'재생 오류: {str(err)}'})


@app.sio.on('load')
async def handle_load(sid, p):
  global codeText, codePath
  if is_protect(p):
    await app.sio.emit('update', {'dialog': '파일 불러오기 오류: 보호 파일입니다.'})
    return
  try:
    with open(p, 'r') as f:
      codeText = f.read()
      codePath = p
      await app.sio.emit('update', {'code': codeText, 'filepath': codePath})
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'파일 불러오기 오류: {str(err)}'})


@app.sio.on('delete')
async def handle_delete(sid, d):
  global codeText, codePath
  if is_protect(d):
    await app.sio.emit('update', {'dialog': '파일 삭제 오류: 보호 파일입니다.'})
    return
  if d == codePath:
    codePath = ""
    codeText = ""
  try:
    if os.path.isdir(d):
      shutil.rmtree(d)
    else:
      os.remove(d)
  except Exception as err:
    print(err)
    await app.sio.emit('update', {'dialog': '파일 삭제 오류: 파일명 파싱 에러입니다.'})
    return
  directory_data = read_directory(PATH)
  await app.sio.emit('update_file_manager', {'data': directory_data})


@app.sio.on('rename')
async def handle_rename(sid, d):
  global codeText, codePath
  oldpath = d['oldpath']
  newpath = d['newpath']
  if is_protect(oldpath) or is_protect(newpath):
    await app.sio.emit('update', {'dialog': '파일 이름 변경 오류: 보호 파일입니다.'})
    return
  try:
    os.rename(oldpath, newpath)
  except Exception as err:
    await app.sio.emit('update', {'dialog': '파일 이름 변경 오류: 파일명 파싱 에러입니다.'})
    return
  directory_data = read_directory(PATH)
  await app.sio.emit('update_file_manager', {'data': directory_data})
  if oldpath == codePath:
    try:
      with open(newpath, 'r') as f:
        codeText = f.read()
        codePath = newpath
        await app.sio.emit('update', {'code': codeText, 'filepath': codePath})
    except Exception as err:
      await app.sio.emit('update', {'dialog': f'파일 불러오기 오류: {str(err)}'})


@app.sio.on('add_file')
async def handle_add_file(sid, p):
  global codeText, codePath
  if is_protect(PATH):
    await app.sio.emit('update', {'dialog': '파일 생성 오류: 보호 디렉토리입니다.'})
    return
  if not os.path.exists(p):
    try:
      os.makedirs(os.path.dirname(p), exist_ok=True)
      open(p, 'a').close()
      shutil.chown(os.path.dirname(p), user='pi', group='pi')
      directory_data = read_directory(PATH)
      await app.sio.emit('update_file_manager', {'data': directory_data})
    except Exception as err:
      await app.sio.emit('update', {'dialog': f'파일 생성 오류: {str(err)}'})
      return
  codePath = p
  try:
    with open(p, 'r') as f:
      codeText = f.read()
      await app.sio.emit('update', {'code': codeText, 'filepath': p})
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'파일 불러오기 오류: {str(err)}'})


@app.sio.on('add_directory')
async def handle_add_directory(sid, p):
  if is_protect(PATH):
    await app.sio.emit('update', {'dialog': '디렉토리 생성 오류: 보호 폴더입니다.'})
    return
  try:
    os.makedirs(p, exist_ok=True)
    shutil.chown(p, user='pi', group='pi')
    directory_data = read_directory(PATH)
    await app.sio.emit('update_file_manager', {'data': directory_data})
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'디렉토리 생성 오류: {str(err)}'})


@app.sio.on('save')
async def handle_save(sid, d):
  global codeText, codePath
  try:
    if is_protect(d['codepath']) or is_protect(os.path.dirname(d['codepath'])):
      await app.sio.emit('update', {'dialog': '파일 저장 오류: 보호 파일입니다.'})
      return
    codeText = d['codetext']
    codePath = d['codepath']
    os.makedirs(os.path.dirname(codePath), exist_ok=True)
    with open(codePath, 'w') as f:
      f.write(codeText)
    shutil.chown(os.path.dirname(codePath), user='pi', group='pi')
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'파일 저장 오류: {str(err)}'})


async def execute(EXEC, codepath):
  global record, ps
  async with mutex:
    record = f'[{datetime.datetime.now()}]: \n\n'
    await app.sio.emit('update', {'record': record})
    if EXEC == 'python3':
      ps = await asyncio.create_subprocess_exec(
        f"{ENV_PATH}/{EXEC}", '-u', codepath,
        cwd=PATH,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        stdin=asyncio.subprocess.PIPE
      )
    else:
      ps = await asyncio.create_subprocess_exec(
        EXEC, codepath,
        cwd=PATH,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        stdin=asyncio.subprocess.PIPE
      )
    while True:
      line = await ps.stdout.readline()
      if not line:
        break
      record += line.decode()
      await app.sio.emit('update', {'record': record})

    err = await ps.stderr.read()
    if err:
      record += err.decode()
      await app.sio.emit('update', {'record': record})

    await ps.wait()
    ps = None  # 프로세스가 종료되었으므로 ps를 None으로 설정
    record += "\n종료됨."
    await app.sio.emit('update', {'record': record, 'exit': True})
    directory_data = read_directory(PATH)
    await app.sio.emit('update_file_manager', {'data': directory_data})

# execute 핸들러 수정
@app.sio.on('execute')
async def handle_execute(sid, d):
  global codeText, codePath, ps
  try:
    if is_protect(d['codepath']) or is_protect(os.path.dirname(d['codepath'])):
      await app.sio.emit('update', {'dialog': '실행 오류: 보호 파일입니다.', 'exit': True})
      return
    codeText = d['codetext']
    codePath = d['codepath']
    if ps and ps.returncode is None:
      ps.kill()
      await ps.wait()
    os.makedirs(os.path.dirname(codePath), exist_ok=True)
    with open(codePath, 'w') as f:
      f.write(codeText)
    shutil.chown(os.path.dirname(codePath), user='pi', group='pi')
    await execute(codeExec[d["codetype"]], codePath)
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'실행 오류: {str(err)}', 'exit': True})

# executeb 핸들러 수정
@app.sio.on('executeb')
async def handle_executeb(sid, d):
  global ps
  try:
    if ps and ps.returncode is None:
      ps.kill()
      await ps.wait()
    os.makedirs(os.path.dirname(d['codepath']), exist_ok=True)
    with open(d['codepath'], 'w') as f:
      f.write(d['codetext'])
    shutil.chown(os.path.dirname(d['codepath']), user='pi', group='pi')
    await execute(codeExec[d["codetype"]], d['codepath'])
  except Exception as err:
    await app.sio.emit('update', {'dialog': f'실행 오류: {str(err)}', 'exit': True})

# stop 핸들러 수정
@app.sio.on('stop')
async def handle_stop(sid):
  global ps
  subprocess.Popen(['pkill', 'play'])
  subprocess.Popen(['servo', 'init'])
  if ps and ps.returncode is None:
    ps.kill()
    await ps.wait()


@app.sio.on('prompt')
async def handle_prompt(sid, s):
  global ps
  if ps and ps.stdin:
    ps.stdin.write((s + "\n").encode())
    await ps.stdin.drain()


# Additional code for the periodic system status updates
async def periodic_system_update():
  while True:
    try:
      system_info = subprocess.check_output(['/home/pi/openpibo-os/system/system.sh']).decode().strip().split(',')
      await app.sio.emit('system', system_info)
    except Exception as err:
      await app.sio.emit('update', {'dialog': '초기화: 시스템 파일 오류입니다.'})

    try:
      battery_status = subprocess.check_output(['curl', '-s', 'http://0.0.0.0:8080/device/%2315%3A%21']).decode()
      battery_value = battery_status.replace('"', '').split(':')[1]
      await app.sio.emit('update_battery', battery_value)
    except Exception as err:
      pass

    try:
      dc_status = subprocess.check_output(['curl', '-s', 'http://0.0.0.0:8080/device/%2314%3A%21']).decode()
      dc_value = dc_status.replace('"', '').split(':')[1]
      await app.sio.emit('update_dc', dc_value)
    except Exception as err:
      pass

    await asyncio.sleep(10)


#@app.on_event('startup')
#async def on_startup():
#  asyncio.create_task(periodic_system_update())


if __name__ == '__main__':
  import argparse
  import uvicorn

  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=50000)
  args = parser.parse_args()

  uvicorn.run('run_ide:app', host='0.0.0.0', port=int(args.port), access_log=False)

