import serial,time
from threading import Timer,Lock

class DeviceControl:
  def __init__(self):
    self.system_data = {}
    self.ser = serial.Serial(port="/dev/ttyS0", baudrate=9600)
    self.lock = Lock()
    self.battery_loop()
    self.system_loop()

  def send_raw(self, raw):
    self.lock.acquire()

    data = ""
    try:
      self.ser.write(raw.encode('utf-8'))

      data = ""
      while True:
        ch = self.ser.read().decode()
        if ch == '#' or ch == '\r' or ch == '\n':
          continue
        if ch == '!':
          break
        data += ch

      time.sleep(0.01)
    except Exception as ex:
      del self.ser
      self.ser = serial.Serial(port="/dev/ttyS0", baudrate=9600)

    self.lock.release()
    return data

  def battery_loop(self):
    self.system_data['battery'] = self.send_raw("#15:!")
    bt = Timer(10, self.battery_loop)
    bt.daemon=True
    bt.start()

  def system_loop(self):
    self.system_data['system'] = self.send_raw("#40:!")
    st = Timer(1, self.system_loop)
    st.daemon=True
    st.start()
