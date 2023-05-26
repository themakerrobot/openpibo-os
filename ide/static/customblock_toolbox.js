const audio_box = [
  {
    "kind": "block",
    "type": "audio_play",
    "inputs":{
      "filename":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "파일이름"
          }
        }
      },
    }
  },
  {
    "kind": "block",
    "type": "audio_stop",
  },
  {
    "kind": "block",
    "type": "audio_record",
    "inputs":{
      "filename":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "파일이름"
          }
        }
      },
    }
  }
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
            "TEXT": "로봇"
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "weather_search",
  },
  {
    "kind": "block",
    "type": "news_search",
  },
];
const device_box = [
  {
    "kind": "block",
    "type": "device_eye_on",
  },
  {
    "kind": "block",
    "type": "device_eye_colour_on",
    "inputs":{
      "left":{
        "shadow": {
          "type": "variables_get",
        }
      },
      "right":{
        "shadow": {
          "type": "variables_get",
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
  {
    "kind": "block",
    "type": "device_get_pir",
  },
  {
    "kind": "block",
    "type": "device_get_touch",
  },
  {
    "kind": "block",
    "type": "device_get_button",
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
            "TEXT": "나의 모션"
          }
        }
      },
    }
  },
  {
    "kind": "block",
    "type": "motion_set_motor",
  },
  {
    "kind": "block",
    "type": "motion_set_speed",
  },
  {
    "kind": "block",
    "type": "motion_set_acceleration",
  },
];
const oled_box = [
  {
    "kind": "block",
    "type": "oled_set_font",
  },
  {
    "kind": "block",
    "type": "oled_draw_text",
    "inputs":{
      "text":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "안녕하세요."
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
            "TEXT": "이미지 파일이름"
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "oled_draw_rectangle",
  },
  {
    "kind": "block",
    "type": "oled_draw_ellipse",
  },
  {
    "kind": "block",
    "type": "oled_draw_line",
  },
  {
    "kind": "block",
    "type": "oled_invert",
  },
  {
    "kind": "block",
    "type": "oled_show",
  },
  {
    "kind": "block",
    "type": "oled_clear",
  },
];
const speech_box = [
  {
    "kind": "block",
    "type": "speech_stt",
  },
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
            "TEXT": "파일이름"
          }
        }
      },
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
            "TEXT": "안녕하세요."
          }
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "speech_load_dialog",
    "inputs":{
      "filename":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "파일이름"
          }
        }
      }
    }
  }
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
            "TEXT": "이미지 파일이름"
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
  {
    "kind": "block",
    "type": "vision_cartoonize",
    "inputs":{
      "img":{
        "shadow": {
          "type": "variables_get",
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "vision_object",
    "inputs":{
      "img":{
        "shadow": {
          "type": "variables_get",
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "vision_qr",
    "inputs":{
      "img":{
        "shadow": {
          "type": "variables_get",
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "vision_classification",
    "inputs":{
      "img":{
        "shadow": {
          "type": "variables_get",
        }
      }
    }
  },
  {
    "kind": "block",
    "type": "vision_load_tm",
    "inputs":{
      "modelpath":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "모델 파일이름"
          }
        }
      },
      "labelpath":{
        "shadow": {
          "type": "text",
          "fields": {
            "TEXT": "라벨 파일이름"
          }
        }
      },
    }
  },
  {
    "kind": "block",
    "type": "vision_predict_tm",
    "inputs":{
      "img":{
        "shadow": {
          "type": "variables_get",
        }
      }
    }
  },
];
const utils_box = [
  {
    "kind": "block",
    "type": "utils_sleep",
  },
  {
    "kind": "block",
    "type": "utils_time",
  },
  {
    "kind": "block",
    "type": "utils_current_time",
  },
  {
    "kind": "block",
    "type": "utils_include",
  },
];

const toolbox= {
  "kind": "categoryToolbox",
  "contents": [
    { // Logic
      "kind": "category",
      "name": "논리",
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
      "name": "반복",
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
      "name": "수학",
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
      "name": "문자",
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
          "type": "text_count",
          "inputs": {
            "SUB": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "a"
                }
              }
            },
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
          "type": "text_replace",
          "inputs": {
            "FROM": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "m"
                }
              }
            },
            "TO": {
              "shadow": {
                "type": "text",
                "fields": {
                  "TEXT": "w"
                }
              }
            },
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
          "type": "text_reverse",
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
        },
      ],
      "categorystyle": "text_category"
    },
    { // Lists
      "kind": "category",
      "name": "목록",
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
        },
        {
          "kind": "block",
          "type": "lists_reverse"
        },
      ],
      "categorystyle": "list_category"
    },
    { // Colour
      "kind": "category",
      "name": "색상",
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
      "name": "변수",
      "contents": [],
      "custom": "VARIABLE",
      "categorystyle": "variable_category",
    },
    { // Functions
      "kind": "category",
      "name": "함수",
      "contents": [],
      "custom": "PROCEDURE",
      "categorystyle": "procedure_category",
    },
    {
      "kind": "sep",
    },
    { // Audio
      "kind": "category",
      "name": "소리",
      "contents": audio_box,
      "colour": color_type["audio"],
    },
    { // Collect
      "kind": "category",
      "name": "수집",
      "contents": collect_box,
      "colour": color_type["collect"]
    },
    { // Device
      "kind": "category",
      "name": "장치",
      "contents": device_box,
      "colour": color_type["device"]
    },
    { // Motion
      "kind": "category",
      "name": "동작",
      "contents": motion_box,
      "colour": color_type["motion"]
    },
    { // Oled
      "kind": "category",
      "name": "화면",
      "contents": oled_box,
      "colour": color_type["oled"]
    },
    { // Speech
      "kind": "category",
      "name": "음성",
      "contents": speech_box,
      "colour": color_type["speech"]
    },
    { // Vision
      "kind": "category",
      "name": "시각",
      "contents": vision_box,
      "colour": color_type["vision"]
    },
    { // Utils
      "kind": "category",
      "name": "도구",
      "contents": utils_box,
      "colour": color_type["utils"]
    },
  ]
}