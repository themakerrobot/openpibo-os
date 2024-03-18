from openpibo.oled import Oled
from openpibo.audio import Audio
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from threading import Timer
from collections import Counter
import os,argparse,json,time,os,shutil
import wifi, network_disp
import argparse

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

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
    print(f'[usedata] Error: {ex}')
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
      shutil.chown(f'/home/pi/.{key}.json', 'pi', 'pi')
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
    shutil.chown(f'/home/pi/.{key}.json', 'pi', 'pi')

  return JSONResponse(content=res, status_code=200)

@app.get('/wifi_scan')
async def f():
  return JSONResponse(content=wifi.wifi_scan(), status_code=200)

@app.get('/wifi')
async def f():
  with open('/etc/wpa_supplicant/wpa_supplicant.conf', 'r') as f:
    tmp = f.readlines()
  return JSONResponse(content={'result':'ok', 'ssid':tmp[4].split('"')[1], 'psk':tmp[5].split('"')[1] if 'psk' in tmp[5] else "", 'ipaddress':wifi_info[0], 'eth1': wifi_info[2]}, status_code=200)

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
  os.system('wpa_cli -i wlan0 reconfigure')
  os.system("shutdown -r now")

def wifi_update():
  global wifi_info
  tmp = os.popen('/home/pi/openpibo-os/system/system.sh').read().strip('\n').split(',')
  if wifi_info != tmp[6:9]:
    print(f'Network Change {wifi_info} -> {tmp[6:9]}')
    network_disp.run()
  wifi_info = tmp[6:9]
  _ = Timer(10, wifi_update)
  _.daemon = True
  _.start()

## boot
def boot():
  try:
    with open('/home/pi/.OS_VERSION', 'r') as f:
      os_version = str(f.readlines()[0].split('\n')[0].split('OPENPIBO_')[1])
  except Exception as ex:
    os_version = "OS (None)"
    pass

  try:
    with open('/home/pi/config.json', 'r') as f:
      tmp = json.load(f)
      os.system('echo "#23:{}!" >/dev/ttyS0'.format(tmp['eye']))
  except Exception as ex:
    pass

  aud.play("/home/pi/openpibo-os/system/opening.mp3", 70, True)
  ole.clear()
  ole.draw_image("/home/pi/openpibo-os/system/themaker.jpg")
  ole.set_font(size=15)
  ole.draw_text((5,40), os_version)
  ole.show()
  time.sleep(5)
  for i in range(1,10):
    tmp = os.popen('/home/pi/openpibo-os/system/system.sh').read().strip('\n').split(',')
    if (tmp[6] != '' and tmp[6][0:3] != '169') or (tmp[8] != '' and tmp[8][0:3] != '169'):
      os.system("systemctl stop hostapd;wpa_cli -i wlan0 reconfigure")
      break
    ole.draw_image("/home/pi/openpibo-os/system/pibo.jpg")
    ole.draw_text((5,5), "˚".join(["" for _ in range(i+1)]))
    ole.show()
    time.sleep(3)
  network_disp.run()
  _ = Timer(10, wifi_update)
  _.daemon = True
  _.start()

@app.on_event('startup')
async def f():
  global wifi_info, ole, aud
  ole = Oled()
  aud = Audio()
  wifi_info = ['','','']
  boot()

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('--port', help='set port number', default=8080)
  args = parser.parse_args()

  import uvicorn
  uvicorn.run('booting:app', host='0.0.0.0', port=args.port, access_log=False)
