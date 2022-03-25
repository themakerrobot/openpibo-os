import openpibo
from openpibo.vision import Camera
from openpibo.vision import Face
from openpibo.vision import Detect
from openpibo.device import Device
from openpibo.audio import Audio
from openpibo.oled import Oled
from openpibo.speech import Speech
from openpibo.speech import Dialog
from openpibo.motion import Motion

import time, datetime
import base64
import cv2
import os, json, shutil
from queue import Queue
from threading import Thread, Lock

def to_base64(im):
  im = cv2.imencode('.jpg', im)[1].tobytes()
  return base64.b64encode(im).decode('utf-8')

class Pibo:
    def __init__(self, emit_func=None):
        self.emit_func = emit_func
        self.onoff = False
        self.kakao_account = None
    
    def emit(self, key, data, callback=None):
        if self.emit_func == None:
            print("No emit_func")
        else:
            self.emit_func(key, data)

    def config(self, d):
        openpibo.config = d
        if 'speech' in dir(self):
            self.speech.kakao_account = d['KAKAO_ACCOUNT']
        else:
            self.kakao_account = d['KAKAO_ACCOUNT']
        
    ## vision
    def vision_start(self):
        self.cam = Camera()
        self.fac = Face()
        self.det = Detect()
        self.vision_flag = True
        Thread(name="vision_loop", target=self.vision_loop, args=(), daemon=True).start()

    def vision_stop(self):
        self.vision_flag = False
        del self.cam, self.fac, self.det

    def vision_loop(self):
        while True:
            if self.vision_flag == False:
                break
            self.frame = self.cam.read()  # read the camera frame
            self.emit('stream', to_base64(cv2.resize(self.frame, (320,240))), callback=None)

    def cartoon(self):
        im = self.frame.copy()
        self.emit('cartoon', to_base64(self.cam.cartoonize(im)), callback=None)

    def object_detect(self):
        im = self.frame.copy()
        faces = self.fac.detect(im)
        objs = self.det.detect_object(im)
        qr = self.det.detect_qr(im)

        res_face = ""
        res_qr = ""
        res_object = ""

        if len(faces) > 0:
            x,y,w,h = faces[0]
            face = self.fac.get_ageGender(im, faces[0])
            colors = (200,100,0) if face["gender"] == "Male" else (100,200,0)
            self.cam.rectangle(im, (x,y), (x+w, y+h), colors, 1)
            self.cam.putText(im, face["gender"]+face["age"], (x-10, y-10),0.6,colors,2)
            res_face += "[{}/{}-({},{})] ".format(face["gender"], face["age"], x, y)

        if qr["type"] != "":
            x1,y1,x2,y2 = qr["position"]
            colors = (100,0,200)
            self.cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
            self.cam.putText(im, "QR", (x1-10, y1-10),0.6,colors,2)
            res_qr += "[{}-({},{})] ".format(qr["data"], x1, y1)

        for obj in objs:
            x1,y1,x2,y2 = obj["position"]
            colors = (100,100,200)
            self.cam.rectangle(im, (x1,y1), (x2, y2),colors,1)
            self.cam.putText(im, obj["name"], (x1-10, y1-10),0.6,colors,2)
            res_object += "[{}-({},{})] ".format(obj["name"], x1, y1)

        self.emit('detect', {"img":to_base64(im), "data":{"face":res_face, "qr":res_qr, "object":res_object}}, callback=None)

    ## device
    def device_start(self):
        self.system_value = ['','','','','','']
        self.neopixel_value = [0,0,0,0,0,0]
        self.devque = Queue()
        self.device_flag = True
        self.dev = Device()
        self.ole = Oled()
        self.aud = Audio()
        Thread(name="device_loop", target=self.device_loop, args=(), daemon=True).start()

        self.send_message(Device.code_list['BATTERY'], "on")
        self.send_message(Device.code_list['PIR'], "on")
        self.send_message(Device.code_list['DC_CONN'])
        self.send_message(Device.code_list['NEOPIXEL_EACH'], ",".join([str(_) for _ in self.neopixel_value]))

    def device_stop(self):
        self.device_flag = False
        del self.dev, self.ole

    def send_message(self, code, data=""):
        self.devque.put("#{}:{}!".format(code, data))

    def decode_pkt(self, pkt):
        print("Recv:", pkt, pkt.split(":")[1].split("-"))
        pkt = pkt.split(":")
        code, data = pkt[0], pkt[1]

        if code == "15": # battery
            self.emit('update_battery', data, callback=None)

        if code == "14": # dc
            self.system_value[2] = data
            self.emit('update_device', self.system_value, callback=None)

        if code == "40": # system
            data = data.split("-")

            if data[2] == '':
                data[2] = self.system_value[2]

            self.system_value = data
            self.emit('update_device', self.system_value, callback=None)

    def device_loop(self):
        system_check_time = time.time()
        battery_check_time = time.time()

        while True:
            if self.device_flag == False:
                break

            if self.devque.qsize() > 0:
                data = self.dev.send_raw(self.devque.get())
                self.decode_pkt(data)

            if time.time() - system_check_time > 1:  # 시스템 메시지 1초 간격 전송
                data = self.dev.send_cmd(Device.code_list['SYSTEM'])
                self.decode_pkt(data)
                system_check_time = time.time()

            if time.time() - battery_check_time > 10: # 배터리 메시지 10초 간격 전송
                data = self.dev.send_cmd(Device.code_list['BATTERY'])
                self.decode_pkt(data)
                battery_check_time = time.time()

                time.sleep(0.01)

    def set_neopixel(self, d):
        self.neopixel_value[d['idx']] = d['value']
        self.send_message(Device.code_list['NEOPIXEL_EACH'], ",".join([str(_) for _ in self.neopixel_value]))

    def set_oled(self, d):
        self.ole.clear()
        self.ole.set_font(size=d['size'])
        self.ole.draw_text((d['x'], d['y']), d['text'])
        self.ole.show()

    def mic(self, d=5):
      cmd = "arecord -D dmic_sv -c2 -r 16000 -f S32_LE -d {} -t wav -q -vv -V streo stream.raw;sox stream.raw -c 1 -b 16 stream.wav;rm stream.raw".format(d)
      os.system(cmd)
      self.aud.play(filename="stream.wav", out='local', volume=-1000, background=False)
      os.remove("stream.wav")

    ## chatbot
    def chatbot_start(self):
        self.chat_list = []
        self.dialog = Dialog()
        self.speech = Speech()
        if self.kakao_account != None:
            self.speech.kakao_account = self.kakao_account

    def chatbot_stop(self):
        self.chat_list = []
        self.kakao_account = None
        del self.dialog, self.speech

    def question(self, q):
        ans = self.dialog.get_dialog(q)
        self.chat_list.append([str(datetime.datetime.now()).split('.')[0], q, ans])
        self.emit('answer', {"answer":ans, "chat_list":list(reversed(self.chat_list))})
        self.speech.tts("<speak><voice name='MAN_DIALOG_BRIGHT'>"+ans +"<break time='500ms'/></voice></speak>", "test.mp3")
        self.aud.play(filename="test.mp3", out='local', volume=-1000, background=False)
        if len(self.chat_list) == 5:
            self.chat_list.pop(0)

    ## motion
    def motion_start(self):
        self.__d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
        self.__p = [] # current pos list value
        self.__j = {} # current json value
        self.mot = Motion()
        self.mot.set_speeds([50,50,50,50,50, 50,50,50,50,50])
        self.mot.set_accelerations([0,0,0,0,0,0,0,0,0,0])
        self.mot.set_motors(self.__d)

        try:
            with open("/home/pi/mymotion.json", "rb") as f:
                self.__j = json.load(f)
                self.emit('disp_code', self.__j)
        except Exception as ex:
            print("Error:", ex)
            pass

    def motion_stop(self):
        self.__d = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0] # current d value
        self.__p = [] # current pos list value
        self.__j = {} # current json value
        del self.mot

    def make_raw(self):
        return {'init_def':1, 'init':self.__p[0]['d'], 'pos':self.__p[1:]} if self.__p[0]['seq'] == 0 else {'init_def':0, 'pos':self.__p}

    def motor_init(self):
        self.emit('init_motion', self.__d)
        self.emit('disp_record', self.__p)

    def set_pos(self, idx, pos):
        self.__d[idx] = pos
        self.mot.set_speed(idx, 50)
        self.mot.set_acceleration(idx, 0)
        self.mot.set_motor(idx, pos)

    def add_frame(self, seq):
        seq = int(seq)
        _check = False
        for idx, pos in enumerate(self.__p):
            if pos['seq'] == seq:
                self.__p[idx] = {"d": self.__d[:], "seq": int(seq)}
                _check = True
                break

        if _check == False:
            self.__p.append({"d": self.__d[:], "seq": int(seq)})
            self.__p.sort(key=lambda x: x['seq'])

        self.emit('disp_record', self.__p)

    def remove_frame(self, seq):
        for idx, pos in enumerate(self.__p):
            if pos['seq'] == seq:
                del self.__p[idx]
                break

    def init_frame(self):
        self.__p = []

    def play_frame(self, cycle):
        raw = self.make_raw()
        self.mot.set_motion_raw(raw, int(cycle))

    def add_motion(self, name):
        self.__j[name] = self.make_raw()
        self.emit('disp_code', self.__j)

    def load_motion(self, name):
        if name in self.__j:
            self.__p = []
            a = self.__j[name]

            if 'init_def' in a and 'init' in a:
                self.__p.append({'d':a['init'], 'seq':0})
            if 'pos' in a:
                for item in a['pos']:
                    self.__p.append(item)
        self.emit('disp_record', self.__p)

    def del_motion(self, name):
        if name in self.__j:
            del self.__j[name]
        self.emit('disp_code', self.__j)

    def save(self):
        with open("/home/pi/mymotion.json", "w") as f:
            json.dump(self.__j, f)
        shutil.chown('/home/pi/mymotion.json', 'pi', 'pi')
        self.emit('disp_code', self.__j)

    def display(self):
        self.emit('disp_code', self.__j)

    def reset(self):
        self.__j = {}
        os.remove('/home/pi/mymotion.json')
        self.emit('disp_code', self.__j)

    def start(self):
        self.vision_start()
        self.device_start()
        self.chatbot_start()
        self.motion_start()
        self.onoff = True

    def stop(self):
        self.vision_stop()
        self.device_stop()
        self.chatbot_stop()
        self.motion_stop()
        self.onoff = False
