const color_type={
  "audio":    "#50B0A0",
  "collect":  "#50A5A0",
  "device":   "#50A0A0",
  "motion":   "#5095A0",
  "oled":     "#5090A0",
  "speech":   "#5085A0",
  "vision":   "#5080A0",
  "utils":    "#5075A0",
};

Blockly.defineBlocksWithJsonArray(
  [
    {
      type: 'audio_play',
      message0: '%{BKY_AUDIO_PLAY}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/circle-play-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myaudio/', '/home/pi/myaudio/' ],
              [ '(openpibo-files) audio/animal/', '/home/pi/openpibo-files/audio/animal/'],
              [ '(openpibo-files) audio/effect/', '/home/pi/openpibo-files/audio/effect/'],
              [ '(openpibo-files) audio/music/', '/home/pi/openpibo-files/audio/music/'],
              [ '(openpibo-files) audio/voice/', '/home/pi/openpibo-files/audio/voice/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
          {"type": "input_value", "name": "volume", "check":"Number"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'audio_stop',
      message0: '%{BKY_AUDIO_STOP}',
      args0: [
        {
          "type": "field_image",
          "src": "svg/stop-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
      ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'audio_record',
      message0: '%{BKY_AUDIO_RECORD}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/microphone-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myaudio/', '/home/pi/myaudio/' ],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
          {"type": "input_value", "name": "timeout", "check":"Number"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'wikipedia_search',
      message0: '%{BKY_COLLECT_WIKIPEDIA}',
      args0: 
        [
          {
            "type": "field_image",
            "src": "svg/bolt-solid.svg",
            "width": 15,
            "height": 20
          },
          {
            "type": "field_image",
            "src": "svg/searchengin.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "topic", "check":"String"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '%{BKY_INTERNET_CHECK_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'weather_search',
      message0: '%{BKY_COLLECT_WEATHER}',
      args0: [
        {
          "type": "field_image",
          "src": "svg/bolt-solid.svg",
          "width": 15,
          "height": 20
        },
        {
          "type": "field_image",
          "src": "svg/cloud-sun-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "field_dropdown", "name":"topic",
         "options":[
          [ '%{BKY_COLLECT_NATION}', '전국' ], [ '%{BKY_COLLECT_SEOUL}', '서울' ],
          [ '%{BKY_COLLECT_INCHEON}', '인천' ], [ '%{BKY_COLLECT_GYEONGGI}', '경기' ],
          [ '%{BKY_COLLECT_BUSAN}', '부산' ], [ '%{BKY_COLLECT_ULSAN}', '울산' ],
          [ '%{BKY_COLLECT_GYEONGNAM}', '경남' ], [ '%{BKY_COLLECT_DAEGU}', '대구' ],
          [ '%{BKY_COLLECT_GYEONGBUK}', '경북' ], [ '%{BKY_COLLECT_GWANGJU}', '광주' ],
          [ '%{BKY_COLLECT_JEONNAM}', '전남' ], [ '%{BKY_COLLECT_JEONBUK}', '전북' ],
          [ '%{BKY_COLLECT_DAEJEON}', '대전' ], [ '%{BKY_COLLECT_SEJONG}', '세종' ],
          [ '%{BKY_COLLECT_CHUNGNAM}', '충남' ], [ '%{BKY_COLLECT_CHUNGBUK}', '충북' ],
          [ '%{BKY_COLLECT_GANGWON}', '강원' ], [ '%{BKY_COLLECT_JEJU}', '제주' ]
         ]
       },
       {"type": "field_dropdown", "name":"mode",
       "options":[
        [ '%{BKY_COLLECT_FORECAST}', 'forecast' ], [ '%{BKY_COLLECT_TODAY}', 'today' ],
        [ '%{BKY_COLLECT_TOMORROW}', 'tomorrow' ], [ '%{BKY_COLLECT_AFTER_TOMORROW}', 'after_tomorrow' ]
       ]
      }
      ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '%{BKY_INTERNET_CHECK_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'news_search',
      message0: '%{BKY_COLLECT_NEWS}',
      args0: 
        [
          {
            "type": "field_image",
            "src": "svg/bolt-solid.svg",
            "width": 15,
            "height": 20
          },
          {
            "type": "field_image",
            "src": "svg/newspaper-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"topic",
          "options":[
            [ '%{BKY_COLLECT_NEWSFLASH}', '속보' ],
            [ '%{BKY_COLLECT_POLITICS}', '정치' ],
            [ '%{BKY_COLLECT_ECONOMY}', '경제' ],
            [ '%{BKY_COLLECT_SOCIETY}', '사회' ],
            [ '%{BKY_COLLECT_INTERNATIONAL}', '국제' ],
            [ '%{BKY_COLLECT_CULTURE}', '문화' ],
            [ '%{BKY_COLLECT_ENTERTAINMENT}', '연예' ],
            [ '%{BKY_COLLECT_SPORT}', '스포츠' ],
            [ '%{BKY_COLLECT_NEWSRANK}', '뉴스랭킹' ],
          ]
          },
          {"type": "field_dropdown", "name":"mode",
          "options":[
            [ '%{BKY_COLLECT_TOPIC}', 'title' ],
            [ '%{BKY_COLLECT_CONTENT}', 'description' ],
            [ '%{BKY_COLLECT_LINK}', 'link']
          ]
          }
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '%{BKY_INTERNET_CHECK_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'device_eye_on',
      message0: '%{BKY_DEVICE_EYE_ON}',
      args0: 
        [
          {
            "type": "field_image",
            "src": "svg/eye-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "val0", "check":"Number"},
          {"type": "input_value", "name": "val1", "check":"Number"},
          {"type": "input_value", "name": "val2", "check":"Number"},
          {"type": "input_value", "name": "val3", "check":"Number"},
          {"type": "input_value", "name": "val4", "check":"Number"},
          {"type": "input_value", "name": "val5", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_eye_colour_on',
      message0: '%{BKY_DEVICE_EYE_COLOUR_ON}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/eye-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "left", "check":"Colour"},
          {"type": "input_value", "name": "right", "check":"Colour"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_eye_off',
      message0: '%{BKY_DEVICE_EYE_OFF}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/eye-slash-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_get_dc',
      message0: '%{BKY_DEVICE_GET_DC}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/plug-circle-check-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_get_battery',
      message0: '%{BKY_DEVICE_GET_BATTERY}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/battery-full-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_get_system',
      message0: '%{BKY_DEVICE_GET_SYSTEM}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/microchip-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_get_pir',
      message0: '%{BKY_DEVICE_GET_PIR}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/person-circle-check-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_get_touch',
      message0: '%{BKY_DEVICE_GET_TOUCH}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/hand-point-up-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'device_get_button',
      message0: '%{BKY_DEVICE_GET_BUTTON}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/toggle-on-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '',
      helpUrl: ''
    },    
    // motion
    {
      type: 'motion_get_motion',
      message0: '%{BKY_MOTION_GET_MOTION}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/list-check-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'motion_get_mymotion',
      message0: '%{BKY_MOTION_GET_MYMOTION}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/list-check-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'motion_set_motion',
      message0: '%{BKY_MOTION_SET_MOTION}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/person-walking-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "name", "check":"String"},
          {"type": "input_value", "name": "cycle", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'motion_set_mymotion',
      message0: '%{BKY_MOTION_SET_MYMOTION}',
      args0: 
        [
          {
            "type": "field_image",
            "src": "svg/person-walking-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "name", "check":"String"},
          {"type": "input_value", "name": "cycle", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'motion_init_motion',
      message0: '%{BKY_MOTION_INIT_MOTION}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/person-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'motion_set_motor',
      message0: '%{BKY_MOTION_SET_MOTOR}',
      args0: 
        [
          {
            "type": "field_image",
            "src": "svg/gears-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"no",
           "options":[
            ['%{BKY_MOTION_R_FOOT}','0'],
            ['%{BKY_MOTION_R_LEG}','1'],
            ['%{BKY_MOTION_R_ARM}','2'],
            ['%{BKY_MOTION_R_HAND}','3'],
            ['%{BKY_MOTION_NECK}','4'],
            ['%{BKY_MOTION_HEAD}','5'],
            ['%{BKY_MOTION_L_FOOT}','6'],
            ['%{BKY_MOTION_L_LEG}','7'],
            ['%{BKY_MOTION_L_ARM}','8'],
            ['%{BKY_MOTION_L_HAND}','9'],
            ]
          },
          {"type": "input_value", "name": "pos", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'motion_set_speed',
      message0: '%{BKY_MOTION_SET_SPEED}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/gears-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"no",
           "options":[
            ['%{BKY_MOTION_R_FOOT}','0'],
            ['%{BKY_MOTION_R_LEG}','1'],
            ['%{BKY_MOTION_R_ARM}','2'],
            ['%{BKY_MOTION_R_HAND}','3'],
            ['%{BKY_MOTION_NECK}','4'],
            ['%{BKY_MOTION_HEAD}','5'],
            ['%{BKY_MOTION_L_FOOT}','6'],
            ['%{BKY_MOTION_L_LEG}','7'],
            ['%{BKY_MOTION_L_ARM}','8'],
            ['%{BKY_MOTION_L_HAND}','9'],
            ]
          },
          {"type": "input_value", "name": "val", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'motion_set_acceleration',
      message0: '%{BKY_MOTION_SET_ACCELERATION}',
      args0: 
        [
          {
            "type": "field_image",
            "src": "svg/gears-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"no",
           "options":[
            ['%{BKY_MOTION_R_FOOT}','0'],
            ['%{BKY_MOTION_R_LEG}','1'],
            ['%{BKY_MOTION_R_ARM}','2'],
            ['%{BKY_MOTION_R_HAND}','3'],
            ['%{BKY_MOTION_NECK}','4'],
            ['%{BKY_MOTION_HEAD}','5'],
            ['%{BKY_MOTION_L_FOOT}','6'],
            ['%{BKY_MOTION_L_LEG}','7'],
            ['%{BKY_MOTION_L_ARM}','8'],
            ['%{BKY_MOTION_L_HAND}','9'],
            ]
          },
          {"type": "input_value", "name": "val", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '',
      helpUrl: ''
    },

    // oled
    {
      type: 'oled_set_font',
      message0: '%{BKY_OLED_SET_FONT}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/text-width-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "size", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_draw_text',
      message0: '%{BKY_OLED_DRAW_TEXT}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/font-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "x", "check":"Number"},
          {"type": "input_value", "name": "y", "check":"Number"},
          {"type": "input_value", "name": "text", "check":"String"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_draw_image',
      message0: '%{BKY_OLED_DRAW_IMAGE}',
      args0: 
        [
          {
            "type": "field_image",
            "src": "svg/image-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myimage/', '/home/pi/myimage/'],
              [ '(openpibo-files) icon/etc/', '/home/pi/openpibo-files/icon/etc/'],
              [ '(openpibo-files) icon/expression/', '/home/pi/openpibo-files/icon/expression/'],
              [ '(openpibo-files) icon/game/', '/home/pi/openpibo-files/icon/game/'],
              [ '(openpibo-files) icon/recycle/', '/home/pi/openpibo-files/icon/recycle/'],
              [ '(openpibo-files) icon/weather/', '/home/pi/openpibo-files/icon/weather/'],
              [ '(openpibo-files) image/', '/home/pi/openpibo-files/image/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_draw_rectangle',
      message0: '%{BKY_OLED_DRAW_RECTANGLE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/draw-polygon-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "x1", "check":"Number"},
          {"type": "input_value", "name": "y1", "check":"Number"},
          {"type": "input_value", "name": "x2", "check":"Number"},
          {"type": "input_value", "name": "y2", "check":"Number"},
          {"type": "field_dropdown", "name":"fill",
           "options":[
              ['%{BKY_OLED_FILL}','True'],['%{BKY_OLED_UNFILL}','False']
            ]
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_draw_ellipse',
      message0: '%{BKY_OLED_DRAW_ELLIPSE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/draw-polygon-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "x1", "check":"Number"},
          {"type": "input_value", "name": "y1", "check":"Number"},
          {"type": "input_value", "name": "x2", "check":"Number"},
          {"type": "input_value", "name": "y2", "check":"Number"},
          {"type": "field_dropdown", "name":"fill",
           "options":[
            ['%{BKY_OLED_FILL}','True'],['%{BKY_OLED_UNFILL}','False']
            ]
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_draw_line',
      message0: '%{BKY_OLED_DRAW_LINE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/draw-polygon-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "x1", "check":"Number"},
          {"type": "input_value", "name": "y1", "check":"Number"},
          {"type": "input_value", "name": "x2", "check":"Number"},
          {"type": "input_value", "name": "y2", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_invert',
      message0: '%{BKY_OLED_INVERT}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/circle-half-stroke-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_show',
      message0: '%{BKY_OLED_SHOW}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/display-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'oled_clear',
      message0: '%{BKY_OLED_CLEAR}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/eraser-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'speech_stt',
      message0: '%{BKY_SPEECH_STT}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/bolt-solid.svg",
            "width": 15,
            "height": 20
          },
          {
            "type": "field_image",
            "src": "svg/ear-listen-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "timeout", "check":"Number"},
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: '%{BKY_INTERNET_CHECK_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'speech_tts',
      message0: '%{BKY_SPEECH_TTS}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/bolt-solid.svg",
            "width": 15,
            "height": 20
          },
          {
            "type": "field_image",
            "src": "svg/file-audio-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "text", "check":"String"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myaudio/', '/home/pi/myaudio/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
          {"type": "field_dropdown", "name":"voice",
           "options":[
              ['main','main'],['man','man1'],['woman','woman1'],
              ['boy','boy'],['girl','girl'],['espeak','espeak'], ['gtts', 'gtts']
            ]
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: '%{BKY_INTERNET_CHECK_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'speech_get_dialog',
      message0: '%{BKY_SPEECH_GET_DIALOG}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/comment-dots-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "text", "check":"String"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'speech_load_dialog',
      message0: '%{BKY_SPEECH_LOAD_DIALOG}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/database-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"}
        ],
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
        colour: color_type["speech"],
        tooltip: '',
        helpUrl: ''
    },
    {
      type: 'vision_read',
      message0: '%{BKY_VISION_READ}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/camera-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_imread',
      message0: '%{BKY_VISION_IMREAD}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/file-image-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myimage/', '/home/pi/myimage/'],
              [ '(openpibo-files) icon/etc/', '/home/pi/openpibo-files/icon/etc/'],
              [ '(openpibo-files) icon/expression/', '/home/pi/openpibo-files/icon/expression/'],
              [ '(openpibo-files) icon/game/', '/home/pi/openpibo-files/icon/game/'],
              [ '(openpibo-files) icon/recycle/', '/home/pi/openpibo-files/icon/recycle/'],
              [ '(openpibo-files) icon/weather/', '/home/pi/openpibo-files/icon/weather/'],
              [ '(openpibo-files) image/', '/home/pi/openpibo-files/image/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
        ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_imwrite',
      message0: '%{BKY_VISION_IMWRITE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/file-image-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myimage/', '/home/pi/myimage/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
          {"type": "input_value", "name": "img", "check":"Array"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_imshow_to_ide',
      message0: '%{BKY_VISION_IMSHOW_TO_IDE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/display-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myimage/', '/home/pi/myimage/'],
              [ '(openpibo-files) icon/etc/', '/home/pi/openpibo-files/icon/etc/'],
              [ '(openpibo-files) icon/expression/', '/home/pi/openpibo-files/icon/expression/'],
              [ '(openpibo-files) icon/game/', '/home/pi/openpibo-files/icon/game/'],
              [ '(openpibo-files) icon/recycle/', '/home/pi/openpibo-files/icon/recycle/'],
              [ '(openpibo-files) icon/weather/', '/home/pi/openpibo-files/icon/weather/'],
              [ '(openpibo-files) image/', '/home/pi/openpibo-files/image/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_transfer',
      message0: '%{BKY_VISION_TRANSFER}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/wand-magic-sparkles-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"},
        {"type": "field_dropdown", "name":"type",
          "options":[
            [ '%{BKY_VISION_CARTOON}', 'cartoon' ],
            [ '%{BKY_VISION_CARTOON_N}', 'cartoon_n'],
            [ '%{BKY_VISION_DETAIL}', 'detail' ],
            [ '%{BKY_VISION_SKETCH_G}', 'sketch_g'],
            [ '%{BKY_VISION_SKETCH_C}', 'sketch_c']
          ]
        },
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_object',
      message0: '%{BKY_VISION_OBJECT}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/object-group-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_qr',
      message0: '%{BKY_VISION_QR}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/qrcode-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_pose',
      message0: '%{BKY_VISION_POSE}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/person-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_analyze_pose',
      message0: '%{BKY_VISION_ANALYZE_POSE}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/person-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "val"},
        {"type": "field_dropdown", "name":"type",
          "options":[
            [ '%{BKY_VISION_POSE_MOTION}', 'motion' ],
            [ '%{BKY_VISION_POSE_POSITION}', 'pose'],
            [ '%{BKY_VISION_POSE_PERSON}', 'person' ],
            [ '%{BKY_VISION_POSE_ACC}', 'acc']
          ]
        }
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_classification',
      message0: '%{BKY_VISION_CLASSIFICATION}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/object-group-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_load_tm',
      message0: '%{BKY_VISION_LOAD_TM}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/database-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'models/', '/home/pi/models/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "modelpath", "check":"String"},
          {"type": "input_value", "name": "labelpath", "check":"String"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_predict_tm',
      message0: '%{BKY_VISION_PREDICT_TM}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/object-group-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'vision_call_ai',
      message0: '%{BKY_VISION_CALL_AI}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/bolt-solid.svg",
          "width": 15,
          "height": 20
        },
        {
          "type": "field_image",
          "src": "svg/brain-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "field_dropdown", "name":"type",
          "options":[
            [ '%{BKY_VISION_CAPTION}', 'caption/caption' ],
            [ '%{BKY_VISION_CAPTION_TAG}', 'caption/caption_tag_e' ],
            [ '%{BKY_VISION_CAPTION_PLACE}', 'caption/caption_place_e' ],
            [ '%{BKY_VISION_CAPTION_TIME}', 'caption/caption_time_e' ]
          ]
        },
        {"type": "field_dropdown", "name":"dir",
        "options":[
          [ 'code/', '/home/pi/code/' ],
          [ 'myimage/', '/home/pi/myimage/'],
          [ '/home/pi/', '/home/pi/' ],
          [ 'none', '']
        ]
      },
      {"type": "input_value", "name": "filename", "check":"String"},
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_INTERNET_CHECK_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'utils_sleep',
      message0: '%{BKY_UTILS_SLEEP}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/bed-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "time", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["utils"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'utils_time',
      message0: '%{BKY_UTILS_TIME}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/stopwatch-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: null,
      inputsInline: true,
      colour: color_type["utils"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'utils_current_time',
      message0: '%{BKY_UTILS_CURRENT_TIME}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/clock-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"}
        ],
      output: null,
      inputsInline: true,
      colour: color_type["utils"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'utils_include',
      message0: '%{BKY_UTILS_INCLUDE}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/list-check-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "a"},
        {"type": "input_value", "name": "b"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["utils"],
      tooltip: '',
      helpUrl: ''
    },
    {
      type: 'utils_dict',
      message0: '%{BKY_UTILS_DICT}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/list-check-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "dictionary"},
          {"type": "input_value", "name": "keyname", "check":"String"}
        ],
        output: null,
        inputsInline: true,
        colour: color_type["utils"],
        tooltip: '',
        helpUrl: ''
    },
    {
      type: 'utils_check_path',
      message0: '%{BKY_UTILS_CHECK_PATH}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/square-check-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"type",
          "options":[
            [ '%{BKY_UTILS_FILE}', 'os.path.isfile' ],
            [ '%{BKY_UTILS_DIRECTORY}', 'os.path.isdir']
          ]},
          {"type": "input_value", "name": "path", "check":"String"}
        ],
        output: null,
        inputsInline: true,
        colour: color_type["utils"],
        tooltip: '',
        helpUrl: ''
    },
    {
      type: 'utils_typecast_string',
      message0: '%{BKY_UTILS_TYPECAST_STRING}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/right-left-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "value", "check":"Number"}
        ],
        output: null,
        inputsInline: true,
        colour: color_type["utils"],
        tooltip: '',
        helpUrl: ''
    },
    {
      type: 'utils_typecast_number',
      message0: '%{BKY_UTILS_TYPECAST_NUMBER}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/right-left-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"type",
          "options":[
            [ '%{BKY_UTILS_INT}', 'int'],
            [ '%{BKY_UTILS_FLOAT}', 'float']
          ]},
          {"type": "input_value", "name": "value", "check":"String"}
        ],
        output: null,
        inputsInline: true,
        colour: color_type["utils"],
        tooltip: '',
        helpUrl: ''
    },
  ]
);