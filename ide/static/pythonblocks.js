// audio
Blockly.Python['audio_play'] = function(block) {
  Blockly.Python.definitions_['from_audio_import_Audio'] = 'from openpibo.audio import Audio';
  Blockly.Python.definitions_['assign_audio'] = 'audio = Audio()';

  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)
  const volume = Blockly.Python.valueToCode(block, 'volume', Blockly.Python.ORDER_ATOMIC)
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

  const topic = Blockly.Python.valueToCode(block, 'topic', Blockly.Python.ORDER_ATOMIC)
  return [`wikipedia.search(${topic})`, Blockly.Python.ORDER_ATOMIC]; 
}
Blockly.Python['weather_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_Weather'] = 'from openpibo.collect import Weather';
  Blockly.Python.definitions_['assign_weather'] = 'weather = Weather()';

  const topic = Blockly.Python.valueToCode(block, 'topic', Blockly.Python.ORDER_ATOMIC)
  return [`weather.search(${topic})`, Blockly.Python.ORDER_ATOMIC]; 
}
Blockly.Python['news_search'] = function(block) {
  Blockly.Python.definitions_['from_collect_import_News'] = 'from openpibo.collect import News';
  Blockly.Python.definitions_['assign_weather'] = 'news = News()';

  const topic = Blockly.Python.valueToCode(block, 'topic', Blockly.Python.ORDER_ATOMIC)
  return [`news.search(${topic})`, Blockly.Python.ORDER_ATOMIC]; 
}

// device
Blockly.Python['device_send_raw'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';
  return [`device.send_raw(${msg})`, Blockly.Python.ORDER_ATOMIC];
}
Blockly.Python['device_eye_on'] = function(block) {
  Blockly.Python.definitions_['from_device_import_Device'] = 'from openpibo.device import Device';
  Blockly.Python.definitions_['assign_device'] = 'device = Device()';

  const val0 = Blockly.Python.valueToCode(block, 'val0', Blockly.Python.ORDER_ATOMIC)
  const val1 = Blockly.Python.valueToCode(block, 'val1', Blockly.Python.ORDER_ATOMIC)
  const val2 = Blockly.Python.valueToCode(block, 'val2', Blockly.Python.ORDER_ATOMIC)
  const val3 = Blockly.Python.valueToCode(block, 'val3', Blockly.Python.ORDER_ATOMIC)
  const val4 = Blockly.Python.valueToCode(block, 'val4', Blockly.Python.ORDER_ATOMIC)
  const val5 = Blockly.Python.valueToCode(block, 'val5', Blockly.Python.ORDER_ATOMIC)
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

// motion
Blockly.Python['motion_set_motion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC)
  const cycle = Blockly.Python.valueToCode(block, 'cycle', Blockly.Python.ORDER_ATOMIC)
  return `motion.set_motion(${name}, ${cycle})\n`;
}

Blockly.Python['motion_set_mymotion'] = function(block) {
  Blockly.Python.definitions_['from_motion_import_Motion'] = 'from openpibo.motion import Motion';
  Blockly.Python.definitions_['assgin_motion'] = 'motion = Motion()';

  const name = Blockly.Python.valueToCode(block, 'name', Blockly.Python.ORDER_ATOMIC)
  const cycle = Blockly.Python.valueToCode(block, 'cycle', Blockly.Python.ORDER_ATOMIC)
  return `motion.set_mymotion(${name}, ${cycle})\n`;
}

// oled
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
Blockly.Python['oled_set_font'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  //const font = Blockly.Python.valueToCode(block, 'font', Blockly.Python.ORDER_ATOMIC)
  const size = Blockly.Python.valueToCode(block, 'size', Blockly.Python.ORDER_ATOMIC)
  return `oled.set_font(size=${size})\n`;
}
Blockly.Python['oled_draw_text'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC)
  const y = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC)
  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC)
  return `oled.draw_text((${x}, ${y}), ${text})\n`;
}
Blockly.Python['oled_draw_image'] = function(block) {
  Blockly.Python.definitions_['from_oled_import_Oled'] = 'from openpibo.oled import Oled';
  Blockly.Python.definitions_['assign_oled'] = 'oled = Oled()';

  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)
  return `oled.draw_image(${filename})\n`;
}

// speech
Blockly.Python['speech_tts'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Speech'] = 'from openpibo.speech import Speech';
  Blockly.Python.definitions_['assign_speech'] = 'speech = Speech()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC)
  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC)
  const voice = Blockly.Python.valueToCode(block, 'voice', Blockly.Python.ORDER_ATOMIC)
  return `speech.tts(string=${text}, filename=${filename}, voice=${voice})\n`;
}
Blockly.Python['speech_get_dialog'] = function(block) {
  Blockly.Python.definitions_['from_speech_import_Dialog'] = 'from openpibo.speech import Dialog';
  Blockly.Python.definitions_['assign_dialog'] = 'dialog = Dialog()';

  const text = Blockly.Python.valueToCode(block, 'text', Blockly.Python.ORDER_ATOMIC)
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

  const filename = Blockly.Python.valueToCode(block, 'filename', Blockly.Python.ORDER_ATOMIC);
  const img = Blockly.Python.valueToCode(block, 'img', Blockly.Python.ORDER_ATOMIC);
  return `camera.imwrite(${filename}, ${img})\n`;
}

let make_blockjson = function (name, message0, output0, variable0, color, tip, args0){
  let j = {};
  j["type"] = name;
  j["message0"] = message0;
  if (args0 != false) j["args0"] = args0; 
  if (output0 != false) j["output"] = output0;
  if (variable0 != false) j["previousStatement"] = j["nextStatement"] = variable0;    
  j["inputsInline"] = true;
  j["colour"] = color;
  j["tooltip"] = tip;
  j["helpUrl"] = "";
  return j;
}

const color_type={
  "audio":"#07A0C7",
  "collect": "#0790B7",
  "device": "#0780A7",
  "motion": "#077097",
  "oled": "#076087",
  "speech": "#075077",
  "vision": "#074067"
};

Blockly.defineBlocksWithJsonArray(
  [
    // audio
    make_blockjson("audio_play", "%{BKY_AUDIO_PLAY}", false, true, color_type['audio'], "call audio.play",
      [
        {"type": "input_value", "name": "filename"}, 
        {"type": "input_value", "name": "volume"}
      ],
    ),
    make_blockjson("audio_stop", "%{BKY_AUDIO_STOP}", false, true, color_type['audio'], "call audio.stop", false),

    // collect
    make_blockjson("wikipedia_search", "%{BKY_COLLECT_WIKIPEDIA}", "String", false, color_type['collect'], "call wikipedia.search",
      [{"type": "input_value", "name": "topic"}]
    ),
    make_blockjson("weather_search", "%{BKY_COLLECT_WEATHER}", "String", false, color_type['collect'], "call weather.search",
      [{"type": "input_value", "name": "topic"}]
    ),
    make_blockjson("news_search", "%{BKY_COLLECT_NEWS}", "String", false, color_type['collect'], "call news.search",
      [{"type": "input_value", "name": "topic"}]
    ),

    // device
    make_blockjson("device_send_raw", "%{BKY_DEVICE_SEND_RAW}", "String", false, color_type['device'], "call device.send_raw",
      [{"type": "input_value", "name": "msg"}]
    ),

    make_blockjson("device_eye_on", "%{BKY_DEVICE_EYE_ON}", false, true, color_type['device'], "call device.eye_on", 
      [
        {"type": "input_value", "name": "val0"},
        {"type": "input_value", "name": "val1"},
        {"type": "input_value", "name": "val2"},
        {"type": "input_value", "name": "val3"},
        {"type": "input_value", "name": "val4"},
        {"type": "input_value", "name": "val5"},
      ]
    ),
    make_blockjson("device_eye_off", "%{BKY_DEVICE_EYE_OFF}", false, true, color_type['device'], "call device.eye_off", false),
    make_blockjson("device_get_dc", "%{BKY_DEVICE_GET_DC}", "String", false, color_type['device'], "call device.get_dc", false),
    make_blockjson("device_get_battery", "%{BKY_DEVICE_GET_BATTERY}", "String", false, color_type['device'], "call device.get_battery", false),
    make_blockjson("device_get_system", "%{BKY_DEVICE_GET_SYSTEM}", "String", false, color_type['device'], "call device.get_system", false),

    // motion
    make_blockjson("motion_set_motion", "%{BKY_MOTION_SET_MOTION}", false, true, color_type['motion'], "call motion.set_motion",
      [
        {"type": "input_value", "name": "name"}, 
        {"type": "input_value", "name": "cycle"}
      ],
    ),
    make_blockjson("motion_set_mymotion", "%{BKY_MOTION_SET_MYMOTION}", false, true, color_type['motion'], "call motion.set_mymotion",
      [
        {"type": "input_value", "name": "name"}, 
        {"type": "input_value", "name": "cycle"}
      ],
    ),
    
    // oled
    make_blockjson("oled_show", "%{BKY_OLED_SHOW}", false, true, color_type['oled'], "call oled.show", false),
    make_blockjson("oled_clear", "%{BKY_OLED_CLEAR}", false, true, color_type['oled'], "call oled.clear", false),
    make_blockjson("oled_set_font", "%{BKY_OLED_SET_FONT}", false, true, color_type['motion'], "call oled.set_font",
      [
        // {"type": "input_value", "name": "font"}, 
        {"type": "input_value", "name": "size"}
      ],
    ),
    make_blockjson("oled_draw_text", "%{BKY_OLED_DRAW_TEXT}", false, true, color_type['motion'], "call oled.draw_text",
    [
      {"type": "input_value", "name": "x"},
      {"type": "input_value", "name": "y"}, 
      {"type": "input_value", "name": "text"}
    ],
    ),
    make_blockjson("oled_draw_image", "%{BKY_OLED_DRAW_IMAGE}", false, true, color_type['motion'], "call oled.draw_image",
      [
        {"type": "input_value", "name": "filename"}
      ],
    ),

    // speech
    make_blockjson("speech_tts", "%{BKY_SPEECH_TTS}", false, true, color_type['speech'], "call speech.tts",
      [
        {"type": "input_value", "name": "text"},
        {"type": "input_value", "name": "filename"},
        {"type": "input_value", "name": "voice"}
      ],
    ),
    make_blockjson("speech_get_dialog", "%{BKY_SPEECH_GET_DIALOG}", "String", false, color_type['speech'], "call speech.get_dialog",
      [
        {"type": "input_value", "name": "text"}
      ],
    ),
    
    // vision
    make_blockjson("vision_read", "%{BKY_VISION_READ}", null, false, color_type['vision'], "call camera.read", false),
    make_blockjson("vision_imwrite", "%{BKY_VISION_IMWRITE}", false, true, color_type['vision'], "call camera.imwrite",
      [
        {"type": "input_value", "name": "filename"},
        {"type": "input_value", "name": "img"}
      ],
    ),
  ]
);

const audio_box = [
  {
    "kind": "block",
    "type": "audio_play",
    "inputs":{
      "filename":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "filepath"
          }
        }
      },
      "volume":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 80
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "audio_stop",
  },
];

const collect_box = [
  {
    "kind": "block",
    "type": "wikipedia_search",
    "inputs":{
      "topic":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "사과"
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "weather_search",
    "inputs":{
      "topic":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "전국"
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "news_search",
    "inputs":{
      "topic":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "속보"
          }
        }
      }
    }
  },
];

const device_box = [
  {
    "kind": "block",
    "type": "device_send_raw",
    "inputs":{
      "msg":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "#10:!"
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "device_eye_on",
    "inputs":{
      "val0":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 0
          }
        }
      },
      "val1":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 0
          }
        }
      },
      "val2":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 0
          }
        }
      },
      "val3":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 0
          }
        }
      },
      "val4":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 0
          }
        }
      },
      "val5":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 0
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "device_eye_off",
  },
  {
    "kind": "block",
    "type": "device_get_dc",
  },
  {
    "kind": "block",
    "type": "device_get_battery",
  },
  {
    "kind": "block",
    "type": "device_get_system",
  },
];

const motion_box = [
  {
    "kind": "block",
    "type": "motion_set_motion",
    "inputs":{
      "name":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "wave1"
          }
        }
      },
      "cycle":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 1
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "motion_set_mymotion",
    "inputs":{
      "name":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": ""
          }
        }
      },
      "cycle":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 1
          }
        }
      }
    }
  },
];

const oled_box = [
  {
    "kind": "block",
    "type": "oled_show",
  },
  {
    "kind": "block",
    "type": "oled_clear",
  },
  {
    "kind": "block",
    "type": "oled_set_font",
    "inputs":{
      // "font":{
      //   "shadow": {
      //     "type": "text",
      //     "fields": {
      //       "TEXT": ""
      //     }
      //   }
      // },
      "size":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 10
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "oled_draw_text",
    "inputs":{
      "x":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 1
          }
        }
      },
      "y":{
        "shadow": {
          "type": "math_number",
          "fields": {
            "NUM": 1
          }
        }
      },
      "text":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": ""
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "oled_draw_image",
    "inputs":{
      "filename":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": ""
          }
        }
      }
    }
  },
];

const speech_box = [
  {
    "kind": "block",
    "type": "speech_tts",
    "inputs":{
      "text":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "안녕하세요."
          }
        }
      },
      "filename":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "/home/pi/tts.mp3"
          }
        }
      },
      "voice":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "main"
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "speech_get_dialog",
    "inputs":{
      "text":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": ""
          }
        }
      }
    }
  },
];

const vision_box = [
  {
    "kind": "block",
    "type": "vision_read",
  },
  {
    "kind": "block",
    "type": "vision_imwrite",
    "inputs":{
      "filename":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "이미지파일"
          }
        }
      },
      "img":{
        "shadow":{
          "type":"variables_get",

        }
      }
    }
  },
];

const toolbox= {
  "kind": "categoryToolbox",
  "contents": [
    { // logic
      "kind": "category",
      "name": "Logic",
      "contents": [
        {
          "kind": "block",
          "type": "controls_if"
        },
        {
          "kind": "block",
          "type": "logic_compare"
        },
        {
          "kind": "block",
          "type": "logic_operation"
        },
        {
          "kind": "block",
          "type": "logic_negate"
        },
        {
          "kind": "block",
          "type": "logic_boolean"
        },
        {
          "kind": "block",
          "type": "logic_null"
        },
        {
          "kind": "block",
          "type": "logic_ternary"
        }
      ],
      "categorystyle": "logic_category"
    },
    { // Loops
      "kind": "category",
      "name": "Loops",
      "contents": [
        {
          "kind": "block",
          "type": "controls_repeat_ext",
          "inputs": {
            "TIMES": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "10"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "controls_whileUntil"
        },
        {
          "kind": "block",
          "type": "controls_for",
          "inputs": {
            "FROM": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            },
            "TO": {
              "shadow": {
                "type": "math_number",
                "fields": {
                "NUM": "10"
                }
              }
            },
            "BY": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "controls_forEach"
        },
        {
          "kind": "block",
          "type": "controls_flow_statements"
        }
      ],
      "categorystyle": "loop_category"
    },
    { // Math
      "kind": "category",
      "name": "Math",
      "contents": [
        {
          "kind": "block",
          "type": "math_number",
          "fields": {
            "NUM": "123"
          }
        },
        {
          "kind": "block",
          "type": "math_arithmetic",
          "inputs": {
            "A": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            },
            "B": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_single",
          "inputs": {
            "NUM": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "9"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_trig",
          "inputs": {
            "NUM": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "45"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_constant"
        },
        {
          "kind": "block",
          "type": "math_number_property",
          "inputs": {
            "NUMBER_TO_CHECK": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "0"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_round",
          "inputs": {
            "NUM": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "3.1"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_on_list"
        },
        {
          "kind": "block",
          "type": "math_modulo",
          "inputs": {
            "DIVIDEND": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "64"
                }
              }
            },
            "DIVISOR": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "10"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_constrain",
          "inputs": {
            "VALUE": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "50"
                }
              }
            },
            "LOW": {
              "shadow": {
              "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            },
            "HIGH": {
              "shadow": {
              "type": "math_number",
                "fields": {
                "NUM": "100"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_random_int",
          "inputs": {
            "FROM": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            },
            "TO": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "100"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_random_float"
        },
        {
          "kind": "block",
          "type": "math_atan2",
          "inputs": {
            "X": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            },
            "Y": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "1"
                }
              }
            }
          }
        }      
      ],
      "categorystyle": "math_category"
    },
    { // Text
      "kind": "category",
      "name": "Text",
      "contents": [
        {
          "kind": "block",
          "type": "text"
        },
        {
          "kind": "block",
          "type": "text_join"
        },
        {
          "kind": "block",
          "type": "text_append",
          "inputs": {
            "TEXT": {
              "shadow": {
                "type": "text"
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_length",
          "inputs": {
            "VALUE": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "abc"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_isEmpty",
          "inputs": {
            "VALUE": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": null
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_indexOf",
          "inputs": {
            "VALUE": {
              "block": {
                "type": "variables_get",
                "fields": {
                  "VAR": "{textVariable}"
                }
              }
            },
            "FIND": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "abc"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_charAt",
          "inputs": {
            "VALUE": {
              "block": {
                "type": "variables_get",
                "fields": {
                  "VAR": "{textVariable}"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_getSubstring",
          "inputs": {
            "STRING": {
              "block": {
                "type": "variables_get",
                "fields": {
                  "VAR": "{textVariable}"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_changeCase",
          "inputs": {
            "TEXT": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "abc"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_trim",
          "inputs": {
            "TEXT": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "abc"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_print",
          "inputs": {
            "TEXT": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "abc"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "text_prompt_ext",
          "inputs": {
            "TEXT": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "abc"
                }
              }
            }
          }
        }
      ],
      "categorystyle": "text_category"
    },
    { // Lists
      "kind": "category",
      "name": "Lists",
      "contents": [
        {
          "kind": "block",
          "type": "lists_create_with",
          "extraState": {
            "itemCount": "0"
          }
        },
        {
          "kind": "block",
          "type": "lists_create_with"
        },
        {
          "kind": "block",
          "type": "lists_repeat",
          "inputs": {
            "NUM": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "5"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "lists_length"
        },
        {
          "kind": "block",
          "type": "lists_isEmpty"
        },
        {
          "kind": "block",
          "type": "lists_indexOf",
          "inputs": {
            "VALUE": {
              "block": {
                "type": "variables_get",
                "fields": {
                  "VAR": "{listVariable}"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "lists_getIndex",
          "inputs": {
            "VALUE": {
              "block": {
                "type": "variables_get",
                "fields": {
                  "VAR": "{listVariable}"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "lists_setIndex",
          "inputs": {
            "LIST": {
              "block": {
                "type": "variables_get",
                "fields": {
                  "VAR": "{listVariable}"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "lists_getSublist",
          "inputs": {
            "LIST": {
              "block": {
                "type": "variables_get",
                "fields": {
                  "VAR": "{listVariable}"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "lists_split",
          "inputs": {
            "DELIM": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": ","
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "lists_sort"
        }
      ],
      "categorystyle": "list_category"
    },
    { // Colour
      "kind": "category",
      "name": "Colour",
      "contents": [
        {
          "kind": "block",
          "type": "colour_picker"
        },
        {
          "kind": "block",
          "type": "colour_random"
        },
        {
          "kind": "block",
          "type": "colour_rgb",
          "inputs": {
            "RED": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "100"
                }
              }
            },
            "GREEN": {
              "shadow": {
                "type": "math_number",
                  "fields": {
                "NUM": "50"
                }
              }
            },
            "BLUE": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "0"
                }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "colour_blend",
          "inputs": {
            "COLOUR1": {
              "shadow": {
                "type": "colour_picker",
                "fields": {
                  "COLOUR": "#ff0000"
                }
              }
            },
            "COLOUR2": {
              "shadow": {
                "type": "colour_picker",
                "fields": {
                  "COLOUR": "#3333ff"
                }
              }
            },
            "RATIO": {
              "shadow": {
                "type": "math_number",
                "fields": {
                  "NUM": "0.5"
                }
              }
            }
          }
        }
      ],
      "categorystyle": "colour_category"
    },
    {
      "kind": "sep"
    },
    { // Variables
      "kind": "category",
      "name": "Variables",
      "contents": [],
      "custom": "VARIABLE",
      "categorystyle": "variable_category"
    },
    { // Functions
      "kind": "category",
      "name": "Functions",
      "contents": [],
      "custom": "PROCEDURE",
      "categorystyle": "procedure_category"
    },
    {
      "kind": "sep",
    },
    { // audio
      "kind": "category",
      "name": "Audio",
      "contents": audio_box,
      "colour": "#07A0C7"
    },
    { // collect
      "kind": "category",
      "name": "Collect",
      "contents": collect_box,
      "colour": "#0790B7"
    },
    { // device
      "kind": "category",
      "name": "Device",
      "contents": device_box,
      "colour": "#0780A7"
    },
    { // motion
      "kind": "category",
      "name": "Motion",
      "contents": motion_box,
      "colour": "#077097"
    },
    { // oled
      "kind": "category",
      "name": "Oled",
      "contents": oled_box,
      "colour": "#076087"
    },
    { // speech
      "kind": "category",
      "name": "Speech",
      "contents": speech_box,
      "colour": "#075077"
    },
    { // vision
      "kind": "category",
      "name": "Vision",
      "contents": vision_box,
      "colour": "#074067"
    },
  ]
}