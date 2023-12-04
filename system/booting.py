import time,json,subprocess,os
from openpibo.oled import Oled
from openpibo.motion import Motion
from openpibo.audio import Audio

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
    a = Audio()
    m = Motion()

    a.play("/home/pi/openpibo-os/system/opening.mp3", 70, True)
    o.clear()
    o.draw_image("/home/pi/openpibo-os/system/themaker.jpg")
    o.set_font(size=15)
    o.draw_text((5,40), os_version)
    o.show()

    m = Motion()
    m.set_motion("wake_up2", 1)
    m.set_motors([0,0,-80,0, 0,0, 0,0,80,0], 3000)

  except Exception as ex:
    with open('/home/pi/boot_errmsg', 'w') as f:
      f.write(f'[{time.ctime()}]\n{ex}')

  try:
    with open('/home/pi/config.json', 'r') as f:
      tmp = json.load(f)
      os.system('echo "#23:{}!" >/dev/ttyS0'.format(tmp['eye']))
  except Exception as ex:
      pass
