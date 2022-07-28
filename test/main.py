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
  time.sleep(5)
  oled_obj.clear()
  oled_obj.show()

def audio():
  audio_obj.play(filename="test.mp3", volume=80)
  time.sleep(5)
  audio_obj.mute(True)
  print(" [ Mute ]")
  time.sleep(2)
  audio_obj.mute(False)
  print(" [ Play ]")
  time.sleep(5)
  audio_obj.stop()

def motor():
  motor_list = ['foot_right', 'leg_right', 'shoulder_right', 'hand_right', 'head_pan', 'head_tilt', 'foot_left', 'leg_left', 'shoulder_left', 'hand_left']
  is_success = True
  for i in range(10):
    print(f"({i+1}/10) '{motor_list[i]}' motor test ...")
    motion_obj.set_speed(i, 30)
    motion_obj.set_acceleration(i, 0)
    motion_obj.set_motor(i, 10)
    time.sleep(1)
    motion_obj.set_motor(i,-10)
    time.sleep(1)
    motion_obj.set_motor(i, 0)
    time.sleep(1)
    while True:
      result = input('Works well? (y/n) : ')
      print()
      if result.upper() in ['Y', 'YES']:
        break
      elif result.upper() in ['N', 'NO']:
        is_success = False
        break
      else:
        print("Please type 'y' or 'n'")
  return is_success

def mic():
  cmd = "arecord -D dmic_sv -c2 -r 16000 -f S32_LE -d 5 -t wav -q -vv -V streo stream.raw;sox stream.raw -c 1 -b 16 stream.wav;rm stream.raw"
  os.system(cmd)
  audio_obj.play(filename="stream.wav", volume=80)
  time.sleep(5)
  audio_obj.stop()
  os.remove("stream.wav")

def camera():
  img = camera_obj.read(128, 64)
  oled_obj.draw_data(img)
  oled_obj.show()
  time.sleep(5)
  oled_obj.clear()
  oled_obj.show()

def neopixel():
  device_obj.send_raw("#20:255,0,0!")
  time.sleep(2)
  device_obj.send_raw("#20:0,255,0!")
  time.sleep(2)
  device_obj.send_raw("#20:0,0,255!")
  time.sleep(2)
  device_obj.send_raw("#20:0,0,0!")

def pir():
  for i in range(20):
    device_obj.send_cmd(Device.code_list['PIR'], "on")
    time.sleep(1)
    data = device_obj.send_cmd(Device.code_list['SYSTEM']).split(':')[1].split('-')
    result = data[0] if data[0] != '' else "nobody"
    print(f' [ {result} ]')

def touch():
  for i in range(10):
    time.sleep(1)
    data = device_obj.send_cmd(Device.code_list['SYSTEM']).split(':')[1].split('-')
    result = data[1] if data[1] else "No signal"
    print(f' [ {result} ]')

def button():
  for i in range(10):
    time.sleep(1)
    data = device_obj.send_cmd(Device.code_list['SYSTEM']).split(':')[1].split('-')
    result = data[3] if data[3] else "No signal"
    print(f' [ {result} ]')

def dc():
  time.sleep(1)
  data = device_obj.send_cmd(Device.code_list['DC_CONN']).split(':')[1]
  print(f' [ {data} ]')
  for i in range(10):
    time.sleep(1)
    data = device_obj.send_cmd(Device.code_list['SYSTEM']).split(':')[1].split('-')
    result = data[2] if data[2] else "No signal"
    print(f' [ {result} ]')

def battery():
  time.sleep(1)
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
    'pir':{"_func":pir, "state":"ready"},
    'touch':{"_func":touch, "state":"ready"},
    'button':{"_func":button, "state":"ready"},
    'dc':{"_func":dc, "state":"ready"},
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
          item, value['state']
      )

    console.print(table)
    console.print("© Copyright 2022, Circulus Education - THE MAKER\n")
    console.print(f'[yellow]# "quit" to exit[/yellow]')
    if invalid_cmd:
      print(f"[red]No such command: {cmd}[/red]")
    console.print('Input: ', end='')
    cmd = input()

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
      if cmd in ['mic', 'motor']:
          is_success = items[cmd]['_func']()
      else:
        with console.status("[bold cyan]{} Testing ...".format(cmd.upper())) as status:
          items[cmd]['_func']()
      if cmd == 'motor':
        if is_success:
          items[cmd]['state'] = '[green]success[/green]'
        else:
          items[cmd]['state'] = '[red]fail[/red]'
      while cmd != 'motor':
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
