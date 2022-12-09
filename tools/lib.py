import openpibo
import openpibo_models
from openpibo.vision import Camera,Face,Detect,TeachableMachine
from openpibo.device import Device
from openpibo.audio import Audio
from openpibo.oled import Oled
from openpibo.speech import Speech,Dialog
from openpibo.motion import Motion
import asyncio
import numpy as np

import time, datetime
import base64
import cv2
import os,json,shutil,csv
from PIL import Image,ImageDraw,ImageFont,ImageOps

from queue import Queue
from threading import Thread
import log
logger = log.configure_logger()

def to_base64(im):
  im = cv2.resize(im, (320,240))
  im = cv2.imencode('.jpg', im)[1].tobytes()
  return base64.b64encode(im).decode('utf-8')

class Pibo:
  def __init__(self, emit_func=None):
    self.emit = emit_func
    self.onoff = False

  ## vision
  def vision_start(self):
    self.cam = Camera()
    self.fac = Face()
    self.det = Detect()
    self.tm = TeachableMachine()
    self.pil_fontpath = openpibo_models.filepath("KDL.ttf")
    self.pil_font = ImageFont.truetype(self.pil_fontpath, 20)

    self.vision_type = "camera"
    self.vision_flag = True
    Thread(name='vision_loop', target=self.vision_loop, args=(), daemon=True).start()

  def vision_stop(self):
    self.vision_flag = False
    del self.cam, self.fac, self.det

  def vision_loop(self):
    self.cam.cap.set(cv2.CAP_PROP_FPS, 5)
    while self.vision_flag == True:
      self.frame = self.cam.read()  # read the camera frame

      try:
        if self.vision_type == "qr":
          img, res = self.qr_detect()
        elif self.vision_type == "face":
          img, res = self.face_detect()
        elif self.vision_type == "object":
          img, res = self.object_detect()
        elif self.vision_type == "pose":
          img, res = self.pose_detect()
        elif self.vision_type == "cartoon":
          img, res = self.cartoon()
        elif self.vision_type == "tm":
          img, res = self.tm_classify()
        else:
          img, res = self.frame, ""
      except Exception as ex:
        logger.error(f'[vision_loop] Error: {ex}')
        img, res = self.frame, str(ex)

      self.res_img = img.copy()
      asyncio.run(self.emit('stream', {'img':to_base64(img), 'data':res}, callback=None))

  def cartoon(self):
    im = self.frame.copy()
    return self.cam.cartoonize(im), ''

  def face_detect(self):
    im = self.frame.copy()
    items = self.fac.detect(im)
    res = ''

    if len(items) > 0:
      x,y,w,h = items[0]
      '''
      age_val, age_data = self.fac.get_age(im[y:y+h,x:x+w])
      gender_val, gender_data = self.fac.get_gender(im[y:y+h,x:x+w])
      emotion_val, emotion_data = self.fac.get_emotion(im[y:y+h,x:x+w])

      colors = (200,100,0) if gender_val == 'Male' else (100,200,0)
      self.cam.rectangle(im, (x,y), (x+w, y+h), colors, 1)
      self.cam.putText(im, f'{age_val} {gender_val} {emotion_val}', (x-10, y-10),0.6,colors,2)
      res += '[{} / {} / {}'.format(age_val, gender_val, emotion_val)
      '''
      face = self.fac.get_ageGender(im, items[0])
      colors = (200,100,0) if face['gender'] == 'Male' else (100,200,0)
      self.cam.rectangle(im, (x,y), (x+w, y+h), colors, 1)
      self.cam.putText(im, face['gender']+face['age'], (x-10, y-10),0.6,colors,2)
      res += '[{}/{}-({},{})] '.format(face['gender'], face['age'], x, y)

    return im, res

  def object_detect(self):
    im = self.frame.copy()
    items = self.det.detect_object(im)
    res = ''

    for obj in items:
      x1,y1,x2,y2 = obj['position']
      colors = (100,100,200)
      self.cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
      self.cam.putText(im, obj['name'], (x1-10, y1-10),0.6,colors,2)
      res += '[{}-({},{})] '.format(obj['name'], x1, y1)

    return im, res

  def qr_detect(self):
    im = self.frame.copy()
    item = self.det.detect_qr(im)
    res = ''

    if item['type'] != '':
      x1,y1,x2,y2 = item['position']
      colors = (100,0,200)
      self.cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
      self.cam.putText(im, 'QR', (x1-10, y1-10),0.6,colors,2)
      res += '[{}-{} / ({},{})] '.format(item['data'], item['type'], x1, y1)

    return im, res

  def pose_detect(self):
    im = self.frame.copy()
    item = self.det.detect_pose(im)
    return item['img'], ''

  def tm_classify(self):
    im = self.frame.copy()
    res, raw = self.tm.predict(im)
    quantization = True if sum(raw) > 2 else False
    #colors = (10,10,10)
    #self.cam.putText(im, "{} : {:.1f}%".format(res, raw.max()*100), (50, 50), 0.7, colors, 1)

    r = []
    im = Image.fromarray(cv2.cvtColor(im, cv2.COLOR_BGR2RGB))
    for i in range(len(self.tm.class_names)):
      #self.cam.putText(im, "{}:{:.1f}%".format(self.tm.class_names[i], raw[i]*100), (50, 50+((i+1)*25)), 0.7, colors, 1)
      pred = str(raw[i]) if quantization else f"{raw[i]*100:.1f}%"
      text= f"{self.tm.class_names[i]}:{pred}"
      points = (20, 20+((i+1)*25))
      ImageDraw.Draw(im).text(points, text, font=self.pil_font, fill=(0,0,0))
      r.append(f"{self.tm.class_names[i]}: {pred}")

    im = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    return im, ", ".join(r)

  def imwrite(self, name):
    self.cam.imwrite(name, self.res_img.copy())

  ## device
  def device_start(self):
    self.devque = Queue()
    self.device_flag = True
    self.dev = Device()
    self.ole = Oled()
    self.aud = Audio()
    self.system_value = ['','','','','','']
    self.battery = '0%'
    
    with open('/home/pi/config.json', 'r') as f:
      tmp = json.load(f)
      self.neopixel_value = tmp['eye'].split(',') if 'eye' in tmp else [0,0,0,0,0,0]
    
    Thread(name='device_loop', target=self.device_loop, args=(), daemon=True).start()

    self.send_message(Device.code_list['BATTERY'], 'on')
    self.send_message(Device.code_list['PIR'], 'on')
    self.send_message(Device.code_list['DC_CONN'])
    self.send_message(Device.code_list['NEOPIXEL_EACH'], ','.join([str(_) for _ in self.neopixel_value]))

  def device_stop(self):
    self.device_flag = False
    self.system_value = ['','','','','','']
    self.battery = '0%'
    del self.dev, self.ole

  def send_message(self, code, data=""):
    self.devque.put(f'#{code}:{data}!')

  def decode_pkt(self, pkt):
    logger.info(f'Recv: {pkt}, {pkt.split(":")[1].split("-")}')
    pkt = pkt.split(":")
    code, data = pkt[0], pkt[1]

    if code == '15': # battery
      self.battery = data
      asyncio.run(self.emit('update_battery', self.battery, callback=None))
    else:
      if code == '14': # dc
        self.system_value[2] = data
      elif code == '40': # system
        item = data.split("-")
        if item[2] == '':
          item[2] = self.system_value[2]
        self.system_value = item
      asyncio.run(self.emit('update_device', self.system_value, callback=None))

  def device_loop(self):
    system_check_time = time.time()
    battery_check_time = time.time()

    while self.device_flag == True:
      try:
        res = None
        if time.time() - system_check_time > 1:  # 시스템 메시지 1초 간격 전송
          data = self.dev.send_cmd(Device.code_list['SYSTEM'])
          self.decode_pkt(data)
          system_check_time = time.time()
        elif time.time() - battery_check_time > 10: # 배터리 메시지 10초 간격 전송
          data = self.dev.send_cmd(Device.code_list['BATTERY'])
          self.decode_pkt(data)
          battery_check_time = time.time()
        elif self.devque.qsize() > 0:
          data = self.dev.send_raw(self.devque.get())
          self.decode_pkt(data)
        else:
          pass
      except Exception as ex:
        logger.error(f'[device_loop] Error: {ex}')
        del self.dev
        self.dev = Device()
        time.sleep(3)
      time.sleep(0.15)

  def set_neopixel(self, d):
    self.neopixel_value[d['idx']] = d['value']
    self.send_message(Device.code_list['NEOPIXEL_EACH'], ','.join([str(_) for _ in self.neopixel_value]))

  def set_oled_image(self, filepath):
    img = self.cam.imread(filepath)
    self.ole.draw_data(cv2.resize(img, (128, 64)))
    self.ole.show()

  def set_oled(self, d):
    self.ole.clear()
    self.ole.set_font(size=d['size'])
    x = d['x']
    y = d['y']

    for item in d['text'].split('\\n'):
      _, h = self.ole.font.getsize(item)
      self.ole.draw_text((x, y), item)
      y += h
    self.ole.show()

  def mic(self, d):
    record_time = d['time']
    cmd = f'arecord -D dmic_sv -c2 -r 16000 -f S32_LE -d {record_time} -t wav -q -vv -V streo stream.raw;sox stream.raw -c 1 -b 16 /home/pi/stream.wav;rm stream.raw'
    os.system(cmd)

  def play_audio(self, filename, volume, background):
    self.aud.play(filename=filename, volume=volume, background=background)

  def stop_audio(self):
    self.aud.stop()

  def tts(self, d):
    voice_type = d['voice_type']
    volume = d['volume']

    try:
      if voice_type == "espeak":
        os.system(f'espeak "{d["text"]}" -w /home/pi/speech.mp3')
      else:
        lang = "en" if "e_" in voice_type else "ko"
        self.speech.tts(string=d['text'], filename='/home/pi/speech.mp3', voice=voice_type, lang=lang)
      self.play_audio('/home/pi/speech.mp3', volume, True)
    except Exception as ex:
      logger.error(f'[tts] Error: {ex}')
      pass
    return

  ## chatbot
  def chatbot_start(self):
    self.chat_list = []
    self.dialog = Dialog()
    self.speech = Speech()

  def chatbot_stop(self):
    self.chat_list = []
    del self.dialog, self.speech

  def load_csv(self, d):
    with open(d, 'r', encoding='utf-8') as f:
      items = csv.reader(f)
      res = []
      for item in items:
        if len(item) == 2:
          res.append(item)
      
      if len(res) == 0:
          return False
  
    self.dialog.load(d)
    return True

  def reset_csv(self):
    del self.dialog
    self.dialog = Dialog()

  def question(self, d):
    q = d['question']
    voice_type = d['voice_type']
    volume = d['volume']
    ans = self.dialog.get_dialog(q)
    self.chat_list.append([str(datetime.datetime.now()).split('.')[0], q, ans])
    #self.emit('answer', {'answer':ans, 'chat_list':list(reversed(self.chat_list))})
    if len(self.chat_list) > 10:
      self.chat_list.pop(0)

    if d['voice_en'] == 'off':
      return ans

    try:
      self.tts({'text':ans, 'voice_type':voice_type, 'volume':volume})
    except Exception as ex:
      logger.error(f'[question] Error: {ex}')
      pass
    return ans

  ## motion
  def motion_start(self):
    self.motion_d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
    self.motion_p = [] # current pos list value
    self.motion_j = {} # current json value
    self.mot = Motion()
    self.mot.set_motors(self.motion_d, movetime=1000)

    try:
      with open('/home/pi/mymotion.json', 'rb') as f:
        self.motion_j = json.load(f)
        #await self.emit('disp_code', self.motion_j)
    except Exception as ex:
      logger.error(f'[motion_start] Error: {ex}')
      pass

  def motion_stop(self):
    self.motion_d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
    self.motion_p = [] # current pos list value
    self.motion_j = {} # current json value
    self.mot.set_motors(self.motion_d, movetime=1000)
    del self.mot

  def make_raw(self):
    if len(self.motion_p) == 0:
      return {}
    return {'init_def':1, 'init':self.motion_p[0]['d'], 'pos':self.motion_p[1:]} if self.motion_p[0]['seq'] == 0 else {'init_def':0, 'pos':self.motion_p[:]}

  def get_motor_info(self):
    return self.motion_d, self.motion_p, self.motion_j

  def set_motor(self, idx, pos):
    self.motion_d[idx] = pos
    self.mot.set_speed(idx, 50)
    self.mot.set_acceleration(idx, 0)
    self.mot.set_motor(idx, pos)

  def set_motors(self, pos_lst, movetime=1000):
    self.motion_d = pos_lst
    self.mot.set_motors(pos_lst, movetime)

  def add_frame(self, seq):
    seq = int(seq)
    _check = False
    for idx, pos in enumerate(self.motion_p):
      if pos['seq'] == seq:
        self.motion_p[idx] = {'d': self.motion_d[:], 'seq': int(seq)}
        _check = True
        break

    if _check == False:
      self.motion_p.append({'d': self.motion_d[:], 'seq': int(seq)})
      self.motion_p.sort(key=lambda x: x['seq'])
    return self.motion_p

  def delete_frame(self, seq):
    for idx, pos in enumerate(self.motion_p):
      if pos['seq'] == seq:
        del self.motion_p[idx]
        break
    return self.motion_p

  def init_frame(self):
    self.motion_p = []
    return self.motion_p

  def play_frame(self, cycle):
    raw = self.make_raw()
    Thread(name='play_frame', target=self.mot.set_motion_raw, args=(raw, int(cycle)), daemon=True).start()

  def stop_frame(self):
    self.mot.stop()

  def add_motion(self, name):
    self.motion_j[name] = self.make_raw()
    with open('/home/pi/mymotion.json', 'w') as f:
      json.dump(self.motion_j, f)
    shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
    return self.motion_j

  def load_motion(self, name):
    if name in self.motion_j:
      a = self.motion_j[name]
    elif name in self.mot.get_motion():
      a = self.mot.get_motion(name)
    else:
      return self.motion_p

    self.motion_p = []
    if 'init_def' in a and 'init' in a:
      self.motion_p.append({'d':a['init'], 'seq':0})
    if 'pos' in a:
      for item in a['pos']:
        self.motion_p.append(item)

    return self.motion_p

  def delete_motion(self, name):
    if name in self.motion_j:
      del self.motion_j[name]
    with open('/home/pi/mymotion.json', 'w') as f:
      json.dump(self.motion_j, f)
    shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
    return self.motion_j

  def reset_motion(self):
    self.motion_j = {}
    with open('/home/pi/mymotion.json', 'w') as f:
      json.dump(self.motion_j, f)
    shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
    return self.motion_j
