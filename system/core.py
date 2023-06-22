import argparse,time,json,serial,wifi,os
from threading import Timer,Lock
from fastapi import FastAPI,Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def send_raw(raw):
  lock.acquire()
  ser.write(raw.encode('utf-8'))

  data = ""
  while True:
    ch = ser.read().decode()
    if ch == '#' or ch == '\r' or ch == '\n':
      continue
    if ch == '!':
      break
    data += ch

  time.sleep(0.01)
  lock.release()
  return data

def battery_loop():
  system_data['battery'] = send_raw("#15:!")
  bt = Timer(10, battery_loop)
  bt.daemon=True
  bt.start()

def system_loop():
  system_data['system'] = send_raw("#40:!")
  st = Timer(1, system_loop)
  st.daemon=True
  st.start()

@app.get('/device/{pkt}')
async def f(pkt="#40:!"):
  try:
    if pkt == "#15:!":
        return JSONResponse(content=system_data['battery'], status_code=200)
    elif pkt == "#40:!":
        return JSONResponse(content=system_data['system'], status_code=200)
    else:
        return JSONResponse(content=send_raw(pkt), status_code=200)
  except Exception as ex:
    return JSONResponse(content=f"Error: {str(ex)}", status_code=500)

@app.get('/wifi_scan')
async def f():
  return JSONResponse(content=wifi.wifi_scan(), status_code=200)

@app.get('/wifi')
async def f():
  with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'r') as f:
      tmp = f.readlines()
  ipaddress = os.popen('/home/pi/openpibo-os/tools/system.sh').read().split(',')[6]
  return JSONResponse(content={'result':'ok', 'ssid':tmp[4].split('"')[1], 'psk':tmp[5].split('"')[1] if 'psk' in tmp[5] else "", 'ipaddress':ipaddress}, status_code=200)

@app.post('/wifi')
async def f(data: dict = Body(...)):
  if data['psk'] != "" and len(data['psk']) < 8:
    return JSONResponse(content={'result':'fail', 'data':'psk must be at least 8 digits.'}, status_code=200)

  tmp='country=KR\n'
  tmp+='ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\n'
  tmp+='update_config=1\n'
  tmp+='network={\n'
  tmp+=f'\tssid="{data["ssid"]}"\n'
  if data['psk'] == "":
    tmp+='\tkey_mgmt=NONE\n'
  else:
    tmp+=f'\tpsk="{data["psk"]}"\n'
    tmp+='\tkey_mgmt=WPA-PSK\n'
  tmp+='}\n'

  with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'w') as f:
    f.write(tmp)
  #os.system('wpa_cli -i wlan0 reconfigure')
  os.system("shutdown -r now")

@app.get('/account')
async def f():
  try:
    res = {"username":"", "password":""}
    with open('/home/pi/.account.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    print(f'[login] Error: {ex}')
    pass
  return JSONResponse(content=res, status_code=200)

@app.post('/account')
async def f(data: dict = Body(...)):
  if 'username' in data and 'password' in data:
    with open('/home/pi/.account.json', 'w') as f:
      json.dump(data, f)
    return JSONResponse(content=data, status_code=200)
  else:
    return JSONResponse(content={'result':'account data 오류'}, status_code=500)

@app.get('/usedata/{key}')
async def f(key="tools"):
  try:
    res = {}
    with open(f'/home/pi/.{key}.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    print(f'[login] Error: {ex}')
    pass
  return JSONResponse(content=res, status_code=200)

@app.post('/usedata/{key}')
async def f(key="tools", data: dict = Body(...)):
  try:
    res = None
    with open(f'/home/pi/.{key}.json', 'rb') as f:
      res = json.load(f)
  except Exception as ex:
    print(f'[usedata] Error: {ex}')
    pass

  try:
    if res == None:
      with open(f'/home/pi/.{key}.json', 'w') as f:
        json.dump(data, f)
    else:
      tmp = {}
      for k in data:
        if type(data[k]) is dict:
          tmp[k] = dict(Counter(res[k]) + Counter(data[k]))
        else:
          tmp[k] = res[k] + data[k] if k in res else data[k]
      with open(f'/home/pi/.{key}.json', 'w') as f:
        json.dump(tmp, f)
  except Exception as ex:
    with open(f'/home/pi/.{key}.json', 'w') as f:
        json.dump(data, f)

  return JSONResponse(content=res, status_code=200)

@app.on_event('startup')
async def f():
  global ser, system_data, lock
  system_data = {}
  ser = serial.Serial(port="/dev/ttyS0", baudrate=9600)
  lock = Lock()
  battery_loop()
  system_loop()

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=51000)
  args = parser.parse_args()

  import uvicorn
  uvicorn.run('core:app', host='0.0.0.0', port=args.port, access_log=False)