from openpibo.motion import Motion
from openpibo.device import Device
from openpibo.oled import Oled
from openpibo.audio import Audio

from datetime import datetime
from threading import Thread
import time

class Simulate:
    def __init__(self):
        self.motion = Motion()
        self.device = Device()
        self.oled = Oled()
        self.audio = Audio()
        self.motion_thread = None
    
    def set_motion(self, _m):
        self.motion.set_motion(_m['name'], _m['cycle'])

    def simulate(self, data):
        if 'audio' in data:
            _a = data['audio']
            self.audio.stop()
            self.audio.play(_a['audiof'], volume=_a['volume'])
        
        if 'motion' in data:
            _m = data['motion']
            self.motion.stop()
            if self.motion_thread != None:
                self.motion_thread.join()
            self.motion_thread = Thread(name="motion", target=self.set_motion, args=(_m,), daemon=True)
            self.motion_thread.start()

        if 'eye' in data:
            _e = data['eye']
            self.device.eye_on(*_e)
        
        if 'oled' in data:
            _o = data['oled']
            self.oled.clear(show=False)
            if 'imagef' in _o:
                self.oled.draw_image(_o['imagef'])
            else:
                self.oled.set_font(size=_o['size'])
                self.oled.draw_text((_o['x'], _o['y']), _o['text'])
            self.oled.show()

if __name__ == "__main__":
    sim = Simulate()

    sim.simulate(
        {
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':{'imagef':'/home/pi/openpibo-files/icon/bot.png'},
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        }
    )
    time.sleep(3)
    
    sim.simulate(
        {
            'motion':{'name':'hand1', 'cycle':1},
            'eye':[0,0,0,0,0,255],
            'oled':{'x':0, 'y':10, 'size':20, 'text':'가나다라'}
        }
    )
    time.sleep(1)

    sim.simulate(
        {
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':{'x':0, 'y':20, 'size':25, 'text':'파이보'},
            'audio':{'audiof':"/home/pi/openpibo-files/audio/closing.mp3", 'volume':50}
        }
    )
    time.sleep(3)

'''
key: sim_play_item
value: {
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        }
return: None

key: sim_stop_item
value: ['motion', 'eye', 'oled', 'audio', 'tts']
return: None

key: sim_update_audio, sim_update_oled
value: filepath(절대경로)
return: ['aaa.mp3', 'bbb.mp3', 'ccc.wav', 'ggg.']
        file list (mp3 / wav 파일 구분은 js에서 실행)

key: sim_update_motion
value: {'type':('default'|'mymotion')}
return: motion list

key: sim_play_items
value: [
        {
            'time':1,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        },
        {
            'time':2.5,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        },
        {
            'time':3,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        }
    ]
return: None

key: sim_stop_items
value: None
return: None

key: sim_add_items
value: {
    'name': "mysim",
    'data':{
        [
        {
            'time':1,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        },
        {
            'time':2.5,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        },
        {
            'time':3,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        }
        ]
    }
}
return: None

key: sim_remove_items
value: name
return: None

key: sim_load_items
value: name
return: 
        [
        {
            'time':1,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        },
        {
            'time':2.5,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        },
        {
            'time':3,
            'motion':{'name':'foot1', 'cycle':10},
            'eye':[255,0,0,0,0,255],
            'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'} | {'x':0, 'y':20, 'size':25, 'text':'파이보'}),
            'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50}
            'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
        }
    ]