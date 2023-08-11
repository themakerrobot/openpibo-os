/* Callback */

String.prototype._trim = function() {
  return this.replace(/^'(\s*)(.*?)(\s*)'$/, "'$2'");
}

// audio
Blockly.Python['audio_play'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  const volume = Blockly.Python.valueToCode(block, 'volume', Blockly.Python.ORDER_ATOMIC)._trim();
  // const volume = block.getFieldValue("volume");
  return `audio.play('${dir}'+${filename}.strip(), ${volume})\n`;
}
Blockly.Python['audio_stop'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';

  return 'audio.stop()\n'
}
Blockly.Python['audio_record'] = function(block) {
  Blockly.Python.definitions_['import_os'] = 'import os';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  //const timeout = block.getFieldValue("timeout");
  const timeout = Blockly.Python.valueToCode(block, 'timeout', Blockly.Python.ORDER_ATOMIC)._trim();
  return `os.system("arecord -D dmic_sv -c2 -r 16000 -f S32_LE -d ${timeout} -t wav -q stream.raw;sox stream.raw -c 1 -b 16 " + '${dir}'+${filename}.strip() + ";rm stream.raw")\n`;
}

// collect
Blockly.Python['wikipedia_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Wikipedia'] = 'from openpibo.collect import Wikipedia';
  Blockly.Python.definitions_['assign_wikipedia'] = 'wikipedia = Wikipedia()';

  const topic = Blockly.Python.valueToCode(block, 'topic', Blockly.Python.ORDER_ATOMIC)._trim();
  return [`wikipedia.search_for_block(${topic}.strip())`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['weather_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Weather'] = 'from openpibo.collect import Weather';
  Blockly.Python.definitions_['assign_weather'] = 'weather = Weather()';

  const topic = block.getFieldValue("topic");
  const mode = block.getFieldValue("mode");
  return [`weather.search_for_block('${topic}', '${mode}')`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['news_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_News'] = 'from openpibo.collect import News';
  Blockly.Python.definitions_['assign_news'] = 'news = News()';

  const topic = block.getFieldValue("topic");
  const mode = block.getFieldValue("mode");
  return [`news.search_for_block('${topic}', '${mode}')`, Blockly.Python.ORDER_ATOMIC];
}

// device
Blockly.Python['device_eye_on'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  
  const val0 = Blockly.Python.valueToCode(block, 'val0', Blockly.Python.ORDER_ATOMIC)._trim();
  const val1 = Blockly.Python.valueToCode(block, 'val1', Blockly.Python.ORDER_ATOMIC)._trim();
  const val2 = Blockly.Python.valueToCode(block, 'val2', Blockly.Python.ORDER_ATOMIC)._trim();
  const val3 = Blockly.Python.valueToCode(block, 'val3', Blockly.Python.ORDER_ATOMIC)._trim();
  const val4 = Blockly.Python.valueToCode(block, 'val4', Blockly.Python.ORDER_ATOMIC)._trim();
  const val5 = Blockly.Python.valueToCode(block, 'val5', Blockly.Python.ORDER_ATOMIC)._trim();

  return `device.eye_on(${val0}, ${val1}, ${val2}, ${val3}, ${val4}, ${val5})\n`
}
Blockly.Python['device_eye_colour_on'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';

  const l = Blockly.Python.valueToCode(block, 'left', Blockly.Python.ORDER_ATOMIC)._trim();
  const r = Blockly.Python.valueToCode(block, 'right', Blockly.Python.ORDER_ATOMIC)._trim();

  return `device.eye_on(*([int(${l}[${l}.index('#'):${l}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)]+[int(${r}[${r}.index('#'):${r}.index('#')+7][___iii:___iii+2], 16) for ___iii in (1, 3, 5)]))\n`
}
Blockly.Python['device_eye_off'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return 'device.eye_off()\n'
}
Blockly.Python['device_get_dc'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_dc().split(':')[1]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_battery'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_battery().split(':')[1]", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_get_system'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return ["device.get_system().split(':')[1]", Blockly.Python.ORDER_ATOMIC];
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
Blockly.Python['motion_get_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  return ["motion.get_motion()", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['motion_get_mymotion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  return ["motion.get_motion(path='/home/pi/mymotion.json')", Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['motion_set_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC)._trim();
  const cycle = Blockly.Python.valueToCode(block, 'cycle', Blockly.Python.ORDER_ATOMIC)._trim();
  return `motion.set_motion(${name}.strip(), ${cycle})\n`;
}
Blockly.Python['motion_set_mymotion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC)._trim();
  const cycle = Blockly.Python.valueToCode(block, 'cycle', Blockly.Python.ORDER_ATOMIC)._trim();
  return `motion.set_mymotion(${name}.strip(), ${cycle})\n`;
}
Blockly.Python['motion_init_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  return `motion.set_motors([0,0,-80,0,0,0,0,0,80,0], 500)\n`;
}
Blockly.Python['motion_set_motor'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no");
  const pos = Blockly.Python.valueToCode(block, 'pos', Blockly.Python.ORDER_ATOMIC)._trim();
  return `motion.set_motor(${no}, ${pos})\n`;
}
Blockly.Python['motion_set_speed'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no");
  const val = Blockly.Python.valueToCode(block, 'val', Blockly.Python.ORDER_ATOMIC)._trim();
  return `motion.set_speed(${no}, ${val})\n`;
}
Blockly.Python['motion_set_acceleration'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const no = block.getFieldValue("no");
  const val = Blockly.Python.valueToCode(block, 'val', Blockly.Python.ORDER_ATOMIC)._trim();
  return `motion.set_acceleration(${no}, ${val})\n`;
}

// oled
Blockly.Python['oled_set_font'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const size = Blockly.Python.valueToCode(block, 'size', Blockly.Python.ORDER_ATOMIC)._trim();
  return `oled.set_font(size=${size})\n`;
}
Blockly.Python['oled_draw_text'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC)._trim();
  const y = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC)._trim();

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC)._trim();
  return `oled.draw_text((${x}, ${y}), ${text}.strip())\n`;
}
Blockly.Python['oled_draw_image'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  return `oled.draw_image('${dir}'+${filename}.strip())\n`;
}
Blockly.Python['oled_draw_rectangle'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC)._trim();
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC)._trim();
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC)._trim();
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC)._trim();
  const fill = block.getFieldValue("fill");

  return `oled.draw_rectangle((${x1}, ${y1}, ${x2}, ${y2}), ${fill})\n`;
}
Blockly.Python['oled_draw_ellipse'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC)._trim();
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC)._trim();
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC)._trim();
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC)._trim();
  const fill = block.getFieldValue("fill");

  return `oled.draw_ellipse((${x1}, ${y1}, ${x2}, ${y2}), ${fill})\n`;
}
Blockly.Python['oled_draw_line'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x1 = Blockly.Python.valueToCode(block, 'x1', Blockly.Python.ORDER_ATOMIC)._trim();
  const y1 = Blockly.Python.valueToCode(block, 'y1', Blockly.Python.ORDER_ATOMIC)._trim();
  const x2 = Blockly.Python.valueToCode(block, 'x2', Blockly.Python.ORDER_ATOMIC)._trim();
  const y2 = Blockly.Python.valueToCode(block, 'y2', Blockly.Python.ORDER_ATOMIC)._trim();
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
Blockly.Python['speech_stt'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Speech'] = 'from openpibo.speech import Speech';
  Blockly.Python.definitions_['assign_speech'] = 'speech = Speech()';

  const timeout = block.getFieldValue("timeout");
  return [`speech.stt(timeout=${timeout}, verbose=False)`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['speech_tts'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Speech'] = 'from openpibo.speech import Speech';
  Blockly.Python.definitions_['assign_speech'] = 'speech = Speech()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC)._trim();
  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  const voice = block.getFieldValue("voice");
  return `speech.tts(string=${text}.strip(), filename='${dir}'+${filename}.strip(), voice='${voice}')\n`;
}
Blockly.Python['speech_get_dialog'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Dialog'] = 'from openpibo.speech import Dialog';
  Blockly.Python.definitions_['assign_dialog'] = 'dialog = Dialog()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC)._trim();
  return [`dialog.get_dialog(${text}.strip())`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['speech_load_dialog'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Dialog'] = 'from openpibo.speech import Dialog';
  Blockly.Python.definitions_['assign_dialog'] = 'dialog = Dialog()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  return `dialog.load('${dir}'+${filename}.strip())\n`;
}

// vision
Blockly.Python['vision_read'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';
  return ["camera.read()", Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['vision_imread'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  return [`camera.imread('${dir}'+${filename}.strip())\n`, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python['vision_imwrite'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return `camera.imwrite('${dir}'+${filename}.strip(), ${img})\n`;
}
Blockly.Python['vision_imshow_to_ide'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();
  return `camera.imshow_to_ide('${dir}'+${filename}.strip())\n`;
}
Blockly.Python['vision_transfer'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Camera'] = 'from openpibo.vision import Camera';
  Blockly.Python.definitions_['assign_camera'] = 'camera = Camera()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  const type = block.getFieldValue("type");
  let res = '';

  switch (type) {
    case 'cartoon':
      res = `camera.cartoonize(${img})`;
      break;
    case 'cartoon_n':
      res = `camera.stylization(${img})`;
      break;
    case 'detail':
      res = `camera.detailEnhance(${img})`;
      break;
    case 'sketch_g':
      res = `camera.pencilSketch(${img})[0]`;
      break;
    case 'sketch_c':
      res = `camera.pencilSketch(${img})[1]`;
      break;
  }
  return [res, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_object'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`[ item['name'] for item in detect.detect_object(${img})]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_qr'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`detect.detect_qr(${img})['data']`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_pose'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`detect.detect_pose(${img})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_analyze_pose'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const val = Blockly.Python.valueToCode(block, 'val', Blockly.Python.ORDER_ATOMIC);
  const type = block.getFieldValue("type");
  let res = '';

  switch (type) {
    case 'motion':
      res = `detect.analyze_pose(${val})`;
      break;
    case 'pose':
      res = `[[_i.coordinate.x, _i.coordinate.y] for _i in ${val}['data'][0][0]]`
      break;
    case 'person':
      res = `[_j for _i in ${val}['data'][0][1] for _j in _i]`
      break;
    case 'acc':
      res = `round(${val}['data'][0][2]*100, 1)`
      break;
  }
  return [res, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_classification'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_Detect'] = 'from openpibo.vision import Detect';
  Blockly.Python.definitions_['assign_detect'] = 'detect = Detect()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`[ item['name'] for item in detect.classify_image(${img})]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_load_tm'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_TeachableMachine'] = 'from openpibo.vision import TeachableMachine';
  Blockly.Python.definitions_['assign_tm'] = 'tm = TeachableMachine()';

  const dir = block.getFieldValue("dir");
  const modelpath = Blockly.Python.valueToCode(block, 'modelpath', Blockly.Python.ORDER_ATOMIC)._trim();
  const labelpath = Blockly.Python.valueToCode(block, 'labelpath', Blockly.Python.ORDER_ATOMIC)._trim();
  return `tm.load('${dir}'+${modelpath}.strip(), '${dir}'+${labelpath}.strip())\n`;
}
Blockly.Python['vision_predict_tm'] = function(block) {
  Blockly.Python.definitions_['from_vision_import_TeachableMachine'] = 'from openpibo.vision import TeachableMachine';
  Blockly.Python.definitions_['assign_tm'] = 'tm = TeachableMachine()';

  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return [`tm.predict(${img})[0]`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['vision_call_ai'] = function(block) {
  Blockly.Python.definitions_['import_openpibo.vision as vis'] = 'import openpibo.vision as vis';

  const type = block.getFieldValue("type");
  const dir = block.getFieldValue("dir");
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)._trim();

  return [`vis.vision_api('${type}', '${dir}'+${filename}.strip())['data']`, Blockly.Python.ORDER_ATOMIC];
}

// Utils
Blockly.Python['utils_sleep'] = function(block) {
  Blockly.Python.definitions_['import_time'] = 'import time';

  const t = block.getFieldValue('time');
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
  const a = Blockly.Python.valueToCode(block, 'a', Blockly.Python.ORDER_ATOMIC);
  const b = Blockly.Python.valueToCode(block, 'b', Blockly.Python.ORDER_ATOMIC);

  return [`${a} in ${b}`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['utils_dict'] = function(block) {
  const dictionary = Blockly.Python.valueToCode(block, 'dictionary', Blockly.Python.ORDER_ATOMIC);
  const keyname = Blockly.Python.valueToCode(block, 'keyname', Blockly.Python.ORDER_ATOMIC)._trim();

  return [`${dictionary}[${keyname}.strip()]`, Blockly.Python.ORDER_ATOMIC];
}