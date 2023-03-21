/* Callback */
// audio
Blockly.Python['audio_play'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';

  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC).trim();
  const volume = block.getFieldValue("volume").trim();
  return `audio.play(${filename}, ${volume})\n`;
}
Blockly.Python['audio_stop'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';
  return 'audio.stop()\n'
}

// collect
Blockly.Python['wikipedia_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Wikipedia'] = 'from openpibo.collect import Wikipedia';
  Blockly.Python.definitions_['assign_wikipedia'] = 'wikipedia = Wikipedia()';

  const topic = Blockly.Python.valueToCode(block, 'topic', Blockly.Python.ORDER_ATOMIC).trim();
  return [`wikipedia.search(${topic})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['weather_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Weather'] = 'from openpibo.collect import Weather';
  Blockly.Python.definitions_['assign_weather'] = 'weather = Weather()';

  const topic = block.getFieldValue("topic").trim();
  return [`weather.search("${topic}")`, Blockly.Python.ORDER_ATOMIC]; 
}
Blockly.Python['news_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_News'] = 'from openpibo.collect import News';
  Blockly.Python.definitions_['assign_news'] = 'news = News()';

  const topic = block.getFieldValue("topic").trim();
  return [`news.search("${topic}")`, Blockly.Python.ORDER_ATOMIC]; 
}

// device
Blockly.Python['device_eye_on'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';

  const val0 = block.getFieldValue("val0").trim();
  const val1 = block.getFieldValue("val1").trim();
  const val2 = block.getFieldValue("val2").trim();
  const val3 = block.getFieldValue("val3").trim();
  const val4 = block.getFieldValue("val4").trim();
  const val5 = block.getFieldValue("val5").trim();

  return `device.eye_on(${val0}, ${val1}, ${val2}, ${val3}, ${val4}, ${val5})\n`
}
Blockly.Python['device_eye_off'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return 'device.eye_off()\n'
}
Blockly.Python['device_get_dc'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_dc()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_battery'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_battery()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_system'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_pir'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1].split('-')[0]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_touch'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1].split('-')[1]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_button'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1].split('-')[3]", Blockly.Python.ORDER_ATOMIC];
}

// motion
Blockly.Python['motion_set_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC).trim();
  const cycle = block.getFieldValue("cycle").trim();
  return `motion.set_motion(${name}, ${cycle})\n`;
}
Blockly.Python['motion_set_mymotion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC).trim();
  const cycle = block.getFieldValue("cycle").trim();
  return `motion.set_mymotion(${name}, ${cycle})\n`;
}
Blockly.Python['motion_set_motor'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no").trim();
  const pos = block.getFieldValue("pos").trim();
  return `motion.set_motor(${no}, ${pos})\n`;
}
Blockly.Python['motion_set_speed'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no").trim();
  const val = block.getFieldValue("val").trim();
  return `motion.set_speed(${no}, ${val})\n`;
}
Blockly.Python['motion_set_acceleration'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no").trim();
  const val = block.getFieldValue("val").trim();
  return `motion.set_acceleration(${no}, ${val})\n`;
}

// oled
Blockly.Python['oled_set_font'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  //const font = Blockly.Python.valueToCode(block, 'font', Blockly.Python.ORDER_ATOMIC)
  const size = block.getFieldValue("size").trim();
  return `oled.set_font(size=${size})\n`;
}
Blockly.Python['oled_draw_text'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x = block.getFieldValue("x").trim();
  const y = block.getFieldValue("y").trim();

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC).trim();
  return `oled.draw_text((${x}, ${y}), ${text})\n`;
}
Blockly.Python['oled_draw_image'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC).trim();
  return `oled.draw_image(${filename})\n`;
}
Blockly.Python['oled_draw_rectangle'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = block.getFieldValue("x1").trim();
  const y1 = block.getFieldValue("y1").trim();
  const x2 = block.getFieldValue("x2").trim();
  const y2 = block.getFieldValue("y2").trim();
  const fill = block.getFieldValue("fill").trim();

  return `oled.draw_rectangle((${x1}, ${y1}, ${x2}, ${y2}), ${fill})\n`;
}
Blockly.Python['oled_draw_ellipse'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = block.getFieldValue("x1").trim();
  const y1 = block.getFieldValue("y1").trim();
  const x2 = block.getFieldValue("x2").trim();
  const y2 = block.getFieldValue("y2").trim();
  const fill = block.getFieldValue("fill").trim();

  return `oled.draw_ellipse((${x1}, ${y1}, ${x2}, ${y2}), ${fill})\n`;
}
Blockly.Python['oled_draw_line'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = block.getFieldValue("x1").trim();
  const y1 = block.getFieldValue("y1").trim();
  const x2 = block.getFieldValue("x2").trim();
  const y2 = block.getFieldValue("y2").trim();

  return `oled.draw_line((${x1}, ${y1}, ${x2}, ${y2}))\n`;
}
Blockly.Python['oled_invert'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';
  return "oled.invert()\n";
}
Blockly.Python['oled_show'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';
  return "oled.show()\n";
}
Blockly.Python['oled_clear'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';
  return "oled.clear()\n";
}

// speech
Blockly.Python['speech_tts'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Speech'] = 'from openpibo.speech import Speech';
  Blockly.Python.definitions_['assign_speech'] = 'speech = Speech()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC).trim();
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC).trim();
  const voice = block.getFieldValue("voice").trim();
  return `speech.tts(string=${text}, filename=${filename}, voice='${voice}')\n`;
}
Blockly.Python['speech_get_dialog'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Dialog'] = 'from openpibo.speech import Dialog';
  Blockly.Python.definitions_['assign_dialog'] = 'dialog = Dialog()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC).trim();
  return [`dialog.get_dialog(${text})`, Blockly.Python.ORDER_ATOMIC];
}

// vision
Blockly.Python['vision_read'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';
  return ["camera.read()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_imwrite'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC).trim();
  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC).trim();
  return `camera.imwrite(${filename}, ${img})\n`;
}
Blockly.Python['vision_cartoonize'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC).trim();
  return [`camera.cartoonize(${img})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_object'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC).trim();
  return [`[ item['name'] for item in detect.detect_object(${img})]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_qr'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC).trim();
  return [`detect.detect_qr(${img})['data']`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_classification'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC).trim();
  return [`[ item['name'] for item in detect.classify_image(${img})]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_load_tm'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_TeachableMachine'] = 'from openpibo.vision import TeachableMachine';
  Blockly.Python.definitions_['assign_tm'] = 'tm = TeachableMachine()';

  const modelpath = Blockly.Python.valueToCode(block, 'modelpath', Blockly.Python.ORDER_ATOMIC).trim();
  const labelpath = Blockly.Python.valueToCode(block, 'labelpath', Blockly.Python.ORDER_ATOMIC).trim();
  return `tm.load(${modelpath}, ${labelpath})\n`;
}
Blockly.Python['vision_predict_tm'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_TeachableMachine'] = 'from openpibo.vision import TeachableMachine';
  Blockly.Python.definitions_['assign_tm'] = 'tm = TeachableMachine()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC).trim();
  return [`tm.predict(${img})[0]`, Blockly.Python.ORDER_ATOMIC];
}

// Utils
Blockly.Python['utils_sleep'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  const t = block.getFieldValue('time').trim();
  return `time.sleep(${t})\n`;
}
Blockly.Python['utils_time'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  return ["time.time()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['utils_current_time'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  return ["time.strftime('%Y-%m-%d %H:%M:%S')", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['utils_include'] = function(block) {
  const a = Blockly.Python.valueToCode(block, 'a', Blockly.Python.ORDER_ATOMIC).trim();
  const b = Blockly.Python.valueToCode(block, 'b', Blockly.Python.ORDER_ATOMIC).trim();

  return [`${a} in ${b}`, Blockly.Python.ORDER_ATOMIC];
}