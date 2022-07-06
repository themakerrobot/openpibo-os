import os
import sys
import time
from threading import Thread

'''
oled
audio
motor
mic
camera
neopixel
pir
touch
button
dc
battery
'''

from openpibo.oled import Oled
from openpibo.audio import Audio
from openpibo.motion import Motion
from openpibo.device import Device
from openpibo.vision import Camera

def get_serial():
  with open('/proc/cpuinfo', 'r') as f:
    lines = f.readlines()
  serial_number = lines[-2].split(' ')[1][:-1]
  return f'Serial_number : {serial_number}'

def get_fw():
  data = device_obj.send_raw("#10:!")
  return f'Firmware      : {data.split(":")[1]}'

def get_memory():
  data = os.popen("vcgencmd get_config total_mem").read()
  data = data.strip().split("=")[1]
  return f'Memory        : {int(data)/1024} GB'

def get_board():
  data = os.popen('cat /proc/device-tree/model').read()
  return f'Board         : {data}'

def oled():
  oled_obj.set_font(size=30)
  oled_obj.clear()
  oled_obj.draw_text((0, 0), "Oled")
  oled_obj.draw_text((0, 30), "Testing...")
  oled_obj.show()

def audio():
  audio_obj.play(filename="test.mp3", out='local', volume=-2000)
  time.sleep(3)
  audio_obj.mute(True)
  print(" [ Mute ]")
  time.sleep(1)
  audio_obj.mute(False)
  print(" [ Play ]")
  time.sleep(3)
  audio_obj.stop()

def motor():
  motor_list = ['foot_right', 'leg_right', 'shoulder_right', 'hand_right', 'head_pan', 'head_tilt', 'foot_left', 'leg_left', 'shoulder_left', 'hand_left']
  motion_obj.set_motors([0,0,0,0,0,0,0,0,0,0])
  for i in range(10):
    print(f"({i+1}/10) '{motor_list[i]}' motor test ...")
    motion_obj.set_speed(i, 30)
    motion_obj.set_acceleration(i, 0)
    motion_obj.set_motor(i, 10)
    time.sleep(0.3)
    motion_obj.set_motor(i,-10)
    time.sleep(0.3)
    motion_obj.set_motor(i, 0)
    time.sleep(0.5)

def mic():
  cmd = "arecord -D dmic_sv -c2 -r 16000 -f S32_LE -d 3 -t wav -q -vv -V streo stream.raw;sox stream.raw -c 1 -b 16 stream.wav;rm stream.raw"
  os.system(cmd)
  audio_obj.play(filename="stream.wav", out='local', volume=-500, background=False)
  os.remove("stream.wav")

def camera():
  os.system('raspistill -vf -hf -o test.jpg;rm test.jpg')
  #img = camera_obj.read(128, 64)
  #oled_obj.draw_data(img)
  #oled_obj.show()
  #time.sleep(5)
  #oled_obj.clear()
  #oled_obj.show()

def neopixel():
  device_obj.send_raw("#20:255,0,0!")
  time.sleep(0.3)
  device_obj.send_raw("#20:0,255,0!")
  time.sleep(0.3)
  device_obj.send_raw("#20:0,0,255!")
  time.sleep(0.3)
  device_obj.send_raw("#20:255,255,255!")

def system():
  print(f"PIR/Touch/Button/DC test ...")
  device_obj.send_cmd(Device.code_list['PIR'], "on")
  
  for i in range(20):
    time.sleep(1)
    data = device_obj.send_cmd(Device.code_list['SYSTEM']).split(':')[1].split('-')
    _pir = data[0] if data[0] != '' else "nobody"
    _touch = data[1] if data[1] else "No signal"
    _dc = data[2] if data[2] else "No signal"
    _button = data[3] if data[3] else "No signal"

    print(f'\n [ P I R : {_pir} ]')
    print(f' [ Touch : {_touch} ]')
    print(f' [ D   C : {_dc} ]')
    print(f' [ Button: {_button} ]')

def battery():
  time.sleep(0.5)
  data = device_obj.send_cmd(Device.code_list['BATTERY']).split(":")[1]
  print(f' [ [white]{data}[/white] ]')


if __name__ == "__main__":
  from rich import print
  from rich.console import Console
  from rich.table import Table

  items = {
    'oled':{"_func":oled, "state":"ready"},
    'audio':{"_func":audio, "state":"ready"},
    'motor':{"_func":motor, "state":"ready"},
    'mic':{"_func":mic, "state":"ready"},
    'camera':{"_func":camera, "state":"ready"},
    'neopixel':{"_func":neopixel, "state":"ready"},
    'system':{"_func":system, "state":"ready"},
    'battery':{"_func":battery, "state":"ready"},
  }

  oled_obj = Oled()
  audio_obj = Audio()
  motion_obj = Motion()
  device_obj = Device()
  camera_obj = Camera()

  invalid_cmd = False

  while True:
    os.system('clear')
    console = Console()
    table = Table(show_header=True, header_style="bold cyan")
    console.print("           [bold yellow]<< HARDWARE_TEST >>[bold /yellow]")
    console.print(get_serial())
    console.print(get_fw())
    console.print(get_board())
    console.print(get_memory())
    table.add_column("NAME                 ")
    table.add_column("STATE          ", justify="center")
    for item, value in items.items():
      table.add_row(
          item if item != 'system' else 'system(pir/touch/dc/button)', value['state']
      )

    console.print(table)
    console.print("© Copyright 2022, Circulus Education - THE MAKER\n")
    console.print(f'[yellow]# "quit" to exit[/yellow] / [red]# "halt" to poweroff[/red]')
    if invalid_cmd:
      print(f"[red]No such command: {cmd}[/red]")
    console.print('Input: ', end='')
    cmd = input()

    if cmd == "halt":
      os.system('shutdown -h now &')
      os.system('echo "#11:!" > /dev/ttyS0')

    if cmd == "quit":
      success_cnt = fail_cnt = no_test_cnt = 0
      for item, value in items.items():
        if 'success' in value['state']:
          success_cnt += 1
        elif 'fail' in value['state']:
          fail_cnt += 1
        else:
          no_test_cnt += 1

      print("[green]success[/green]:   ", success_cnt)
      print("[red]fail[/red]   :   ", fail_cnt)
      print("no test:   ", no_test_cnt)
      break
    
    if cmd in items:
      invalid_cmd = False
      items[cmd]['_func']()
      while True:
        result = input('Test success? (y/n): ')
        if result.upper() in ['Y', 'YES']:
          items[cmd]['state'] = '[green]success[/green]'
          break
        elif result.upper() in ['N', 'NO']:
          items[cmd]['state'] = '[red]fail[/red]'
          break
        else:
          print("Please type 'y' or 'n'")
    else:
      invalid_cmd = True
