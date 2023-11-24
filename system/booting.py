import time,json,subprocess,os
from openpibo.oled import Oled
from openpibo.motion import Motion

def disp(v):
  wip, ssid, sn = v[2] if v[0] == "" else v[0], v[3] if v[1] == "" else v[1], v[4]
  o.set_font(size=13)
  o.draw_text((0, 5), f'SN: {sn} - @')
  o.draw_text((0,25), f'I P: {wip.strip()}')
  o.draw_text((0,45), f'AP: {ssid}')
  o.show()

if __name__ == "__main__":
  os.system('echo "#20:200,200,200!" >/dev/ttyS0')

  try:
    with open('/home/pi/.OS_VERSION', 'r') as f:
      os_version = str(f.readlines()[0].split('\n')[0].split('OPENPIBO_')[1])
  except Exception as ex:
    os_version = "OS (None)"
    pass

  try:
    o = Oled()
    o.clear()
    o.draw_image("/home/pi/openpibo-os/system/themaker.jpg")
    o.set_font(size=15)
    o.draw_text((5,40), os_version)
    o.show()

    m = Motion()
    m.set_motion("wake_up2", 1)
    m.set_motors([0,0,-80,0, 0,0, 0,0,80,0], 3000)
    o.clear()

    for i in range(1,10):
      data = subprocess.check_output(['/home/pi/openpibo-os/system/get_network.sh']).decode('utf-8').strip('\n').split(',')
      if (data[0] != '' and data[0][0:3] != '169') or (data[2] != '' and data[2][0:3] != '169'):
       os.system('systemctl stop hostapd;ip link set ap0 down')
       break

      o.draw_image("/home/pi/openpibo-os/system/pibo.jpg")
      o.draw_text((5,5), "˚".join(["" for _ in range(i+1)]))
      o.show()
      time.sleep(2.5)
    o.clear()
    disp(data)

  except Exception as ex:
    with open('/home/pi/boot_errmsg', 'w') as f:
      f.write(f'[{time.ctime()}]\n{ex}')

  try:
    with open('/home/pi/config.json', 'r') as f:
      tmp = json.load(f)
      os.system('echo "#23:{}!" >/dev/ttyS0'.format(tmp['eye']))
  except Exception as ex:
      pass
