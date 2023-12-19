const color_type={
  "audio":    "#6DA36D",
  "collect":  "#6D6DA3",
  "device":   "#B3926D",
  "motion":   "#B36D42",
  "oled":     "#7D92B3",
  "speech":   "#7DB3C2",
  "vision":   "#938C6D",
  "utils":    "#938CBC"

  // "audio":    "#50B0A0",
  // "collect":  "#50A5A0",
  // "device":   "#50A0A0",
  // "motion":   "#5095A0",
  // "oled":     "#5090A0",
  // "speech":   "#5085A0",
  // "vision":   "#5080A0",
  // "utils":    "#5075A0",
};

Blockly.defineBlocksWithJsonArray(
  [
    {
      type: 'audio_play_dynamic',
      message0: '%{BKY_AUDIO_PLAY_DYNAMIC}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myaudio', '/home/pi/myaudio/' ],
              [ 'openpibo-files/audio/animal/', '/home/pi/openpibo-files/audio/animal/'],
              [ 'openpibo-files/audio/effect/', '/home/pi/openpibo-files/audio/effect/'],
              [ 'openpibo-files/audio/music/', '/home/pi/openpibo-files/audio/music/'],
              [ 'openpibo-files/audio/voice/', '/home/pi/openpibo-files/audio/voice/'],
              [ 'openpibo-files/audio/piano/', '/home/pi/openpibo-files/audio/piano/']
            ]
          },
          {
            "type": "field_dropdown",
            "name": "filename",
            "options": [['%{BKY_FILE_SELECT}', '']]
          },
          {"type": "input_value", "name": "volume", "check":"Number"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '%{BKY_AUDIO_PLAY_DYNAMIC_TOOLTIP}',
      helpUrl: ''
    },
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myaudio', '/home/pi/myaudio/' ],
              [ 'openpibo-files/audio/animal/', '/home/pi/openpibo-files/audio/animal/'],
              [ 'openpibo-files/audio/effect/', '/home/pi/openpibo-files/audio/effect/'],
              [ 'openpibo-files/audio/music/', '/home/pi/openpibo-files/audio/music/'],
              [ 'openpibo-files/audio/voice/', '/home/pi/openpibo-files/audio/voice/'],
              [ 'openpibo-files/audio/piano/', '/home/pi/openpibo-files/audio/piano/']
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
          {"type": "input_value", "name": "volume", "check":"Number"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '%{BKY_AUDIO_PLAY_TOOLTIP}',
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
      tooltip: '%{BKY_AUDIO_STOP_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myaudio', '/home/pi/myaudio/' ],
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
          {"type": "input_value", "name": "timeout", "check":"Number"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '%{BKY_AUDIO_RECORD_TOOLTIP}',
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
      tooltip: '%{BKY_COLLECT_WIKIPEDIA_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'weather_forecast',
      message0: '%{BKY_COLLECT_WEATHER_FORECAST}',
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
          // [ '%{BKY_COLLECT_NATION}', '전국' ],
          [ '%{BKY_COLLECT_SEOUL}', '서울' ],
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
      ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '%{BKY_COLLECT_WEATHER_FORECAST_TOOLTIP}',
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
          // [ '%{BKY_COLLECT_NATION}', '전국' ], 
          [ '%{BKY_COLLECT_SEOUL}', '서울' ],
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
          [ '%{BKY_COLLECT_TODAY}', 'today' ],
          [ '%{BKY_COLLECT_TOMORROW}', 'tomorrow' ],
          [ '%{BKY_COLLECT_AFTER_TOMORROW}', 'after_tomorrow' ]
         ]
        },
        {"type": "field_dropdown", "name":"type",
         "options":[
          [ '%{BKY_COLLECT_COMMENT}', '0' ],
          [ '%{BKY_COLLECT_LOWTEMP}', '1' ],
          [ '%{BKY_COLLECT_HIGHTEMP}', '2' ]
         ]
        }
      ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '%{BKY_COLLECT_WEATHER_TOOLTIP}',
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
      tooltip: '%{BKY_COLLECT_NEWS_TOOLTIP}',
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
          {"type": "input_value", "name": "left", "check":"Colour"},
          {"type": "input_value", "name": "right", "check":"Colour"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '%{BKY_DEVICE_EYE_ON_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'device_eye_fade',
      message0: '%{BKY_DEVICE_EYE_FADE}',
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
          {"type": "input_value", "name": "right", "check":"Colour"},
          {"type": "input_value", "name": "time", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '%{BKY_DEVICE_EYE_FADE_TOOLTIP}',
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
      tooltip: '%{BKY_DEVICE_EYE_OFF_TOOLTIP}',
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
      tooltip: '%{BKY_DEVICE_GET_DC_TOOLTIP}',
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
      tooltip: '%{BKY_DEVICE_GET_BATTERY_TOOLTIP}',
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
      tooltip: '%{BKY_DEVICE_GET_SYSTEM_TOOLTIP}',
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
      tooltip: '%{BKY_DEVICE_GET_PIR_TOOLTIP}',
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
      tooltip: '%{BKY_DEVICE_GET_TOUCH_TOOLTIP}',
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
      tooltip: '%{BKY_DEVICE_GET_BUTTON_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_GET_MOTION_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_GET_MYMOTION_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'motion_set_motion_dropdown',
      message0: '%{BKY_MOTION_SET_MOTION_DROPDOWN}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/person-walking-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "field_dropdown", "name":"name",
            "options":[
              [ '%{BKY_MOTION_SELECT}', ''],
              ['stop', 'stop'], ['stop_body', 'stop_body'], ['sleep', 'sleep'], ['lookup', 'lookup'], ['left', 'left'],
              ['left_half', 'left_half'], ['right', 'right'], ['right_half', 'right_half'], ['forward1', 'forward1'],
              ['forward2', 'forward2'], ['backward1', 'backward1'], ['backward2', 'backward2'], ['step1', 'step1'],
              ['step2', 'step2'], ['hifive', 'hifive'], ['cheer1', 'cheer1'], ['cheer2', 'cheer2'], ['cheer3', 'cheer3'],
              ['wave1', 'wave1'], ['wave2', 'wave2'], ['wave3', 'wave3'], ['wave4', 'wave4'], ['wave5', 'wave5'],
              ['wave6', 'wave6'], ['think1', 'think1'], ['think2', 'think2'], ['think3', 'think3'], ['think4', 'think4'],
              ['wake_up1', 'wake_up1'], ['wake_up2', 'wake_up2'], ['wake_up3', 'wake_up3'], ['hey1', 'hey1'],
              ['hey2', 'hey2'], ['yes_h', 'yes_h'], ['no_h', 'no_h'], ['breath1', 'breath1'], ['breath2', 'breath2'],
              ['breath3', 'breath3'], ['breath_long', 'breath_long'], ['head_h', 'head_h'], ['spin_h', 'spin_h'],
              ['clapping1', 'clapping1'], ['clapping2', 'clapping2'], ['handshaking', 'handshaking'], ['bow', 'bow'],
              ['greeting', 'greeting'], ['hand1', 'hand1'], ['hand2', 'hand2'], ['hand3', 'hand3'], ['hand4', 'hand4'],
              ['foot1', 'foot1'], ['foot2', 'foot2'], ['foot3', 'foot3'], ['speak1', 'speak1'], ['speak2', 'speak2'],
              ['speak_n1', 'speak_n1'], ['speak_n2', 'speak_n2'], ['speak_q', 'speak_q'], ['speak_r1', 'speak_r1'],
              ['speak_r2', 'speak_r2'], ['speak_l1', 'speak_l1'], ['speak_l2', 'speak_l2'], ['welcome', 'welcome'],
              ['happy1', 'happy1'], ['happy2', 'happy2'], ['happy3', 'happy3'], ['excite1', 'excite1'], ['excite2', 'excite2'],
              ['boring1', 'boring1'], ['boring2', 'boring2'], ['sad1', 'sad1'], ['sad2', 'sad2'], ['sad3', 'sad3'],
              ['handup_r', 'handup_r'], ['handup_l', 'handup_l'], ['look_r', 'look_r'], ['look_l', 'look_l'],
              ['dance1', 'dance1'], ['dance2', 'dance2'], ['dance3', 'dance3'], ['dance4', 'dance4'], ['dance5', 'dance5']
            ]
          },
          {"type": "input_value", "name": "cycle", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '%{BKY_MOTION_SET_MOTION_DROPDOWN_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_SET_MOTION_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_SET_MYMOTION_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_INIT_MOTION_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_SET_MOTOR_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_SET_SPEED_TOOLTIP}',
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
      tooltip: '%{BKY_MOTION_SET_ACCELERATION_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_SET_FONT_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_DRAW_TEXT_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'oled_draw_image_dynamic',
      message0: '%{BKY_OLED_DRAW_IMAGE_DYNAMIC}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myimage', '/home/pi/myimage/' ],
              [ 'openpibo-files/image/animal', '/home/pi/openpibo-files/image/animal/' ],
              [ 'openpibo-files/image/expression',  '/home/pi/openpibo-files/image/expression/' ],
              [ 'openpibo-files/image/family',  '/home/pi/openpibo-files/image/family/' ],
              [ 'openpibo-files/image/food',  '/home/pi/openpibo-files/image/food/' ],
              [ 'openpibo-files/image/furniture',  '/home/pi/openpibo-files/image/furniture/' ],
              [ 'openpibo-files/image/game',  '/home/pi/openpibo-files/image/game/' ],
              [ 'openpibo-files/image/goods',  '/home/pi/openpibo-files/image/goods/' ],
              [ 'openpibo-files/image/kitchen',  '/home/pi/openpibo-files/image/kitchen/' ],
              [ 'openpibo-files/image/machine',  '/home/pi/openpibo-files/image/machine/' ],
              [ 'openpibo-files/image/recycle',  '/home/pi/openpibo-files/image/recycle/' ],
              [ 'openpibo-files/image/sport',  '/home/pi/openpibo-files/image/sport/' ],
              [ 'openpibo-files/image/transport',  '/home/pi/openpibo-files/image/transport/' ],
              [ 'openpibo-files/image/weather',  '/home/pi/openpibo-files/image/weather/' ],
              [ 'openpibo-files/image/etc',  '/home/pi/openpibo-files/image/etc/' ],
              [ 'openpibo-files/image/sample',  '/home/pi/openpibo-files/image/sample/' ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "filename",
            "options": [['%{BKY_FILE_SELECT}', '']]
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '%{BKY_OLED_DRAW_IMAGE_DYNAMIC_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myimage', '/home/pi/myimage/' ],
              [ 'openpibo-files/image/animal', '/home/pi/openpibo-files/image/animal/' ],
              [ 'openpibo-files/image/expression',  '/home/pi/openpibo-files/image/expression/' ],
              [ 'openpibo-files/image/family',  '/home/pi/openpibo-files/image/family/' ],
              [ 'openpibo-files/image/food',  '/home/pi/openpibo-files/image/food/' ],
              [ 'openpibo-files/image/furniture',  '/home/pi/openpibo-files/image/furniture/' ],
              [ 'openpibo-files/image/game',  '/home/pi/openpibo-files/image/game/' ],
              [ 'openpibo-files/image/goods',  '/home/pi/openpibo-files/image/goods/' ],
              [ 'openpibo-files/image/kitchen',  '/home/pi/openpibo-files/image/kitchen/' ],
              [ 'openpibo-files/image/machine',  '/home/pi/openpibo-files/image/machine/' ],
              [ 'openpibo-files/image/recycle',  '/home/pi/openpibo-files/image/recycle/' ],
              [ 'openpibo-files/image/sport',  '/home/pi/openpibo-files/image/sport/' ],
              [ 'openpibo-files/image/transport',  '/home/pi/openpibo-files/image/transport/' ],
              [ 'openpibo-files/image/weather',  '/home/pi/openpibo-files/image/weather/' ],
              [ 'openpibo-files/image/etc',  '/home/pi/openpibo-files/image/etc/' ],
              [ 'openpibo-files/image/sample',  '/home/pi/openpibo-files/image/sample/' ]
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: '%{BKY_OLED_DRAW_IMAGE_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_DRAW_RECTANGLE_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_DRAW_ELLIPSE_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_DRAW_LINE_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_INVERT_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_SHOW_TOOLTIP}',
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
      tooltip: '%{BKY_OLED_CLEAR_TOOLTIP}',
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
      tooltip: '%{BKY_SPEECH_STT_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myaudio', '/home/pi/myaudio/' ],
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
      tooltip: '%{BKY_SPEECH_TTS_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'speech_translate',
      message0: '%{BKY_SPEECH_TRANSLATE}',
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
            "src": "svg/font-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "text", "check":"String"},
          {"type": "field_dropdown", "name":"lang",
            "options":[
              ['%{BKY_LANG_KO}','ko'],
              ['%{BKY_LANG_EN}','en']
            ]
         },
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: '%{BKY_SPEECH_TRANSLATE_TOOLTIP}',
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
      tooltip: '%{BKY_SPEECH_GET_DIALOG_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"}
        ],
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
        colour: color_type["speech"],
        tooltip: '%{BKY_SPEECH_LOAD_DIALOG_TOOLTIP}',
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
      tooltip: '%{BKY_VISION_READ_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_imread_dynamic',
      message0: '%{BKY_VISION_IMREAD_DYNAMIC}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myimage', '/home/pi/myimage/' ],
              [ 'openpibo-files/image/animal', '/home/pi/openpibo-files/image/animal/' ],
              [ 'openpibo-files/image/expression',  '/home/pi/openpibo-files/image/expression/' ],
              [ 'openpibo-files/image/family',  '/home/pi/openpibo-files/image/family/' ],
              [ 'openpibo-files/image/food',  '/home/pi/openpibo-files/image/food/' ],
              [ 'openpibo-files/image/furniture',  '/home/pi/openpibo-files/image/furniture/' ],
              [ 'openpibo-files/image/game',  '/home/pi/openpibo-files/image/game/' ],
              [ 'openpibo-files/image/goods',  '/home/pi/openpibo-files/image/goods/' ],
              [ 'openpibo-files/image/kitchen',  '/home/pi/openpibo-files/image/kitchen/' ],
              [ 'openpibo-files/image/machine',  '/home/pi/openpibo-files/image/machine/' ],
              [ 'openpibo-files/image/recycle',  '/home/pi/openpibo-files/image/recycle/' ],
              [ 'openpibo-files/image/sport',  '/home/pi/openpibo-files/image/sport/' ],
              [ 'openpibo-files/image/transport',  '/home/pi/openpibo-files/image/transport/' ],
              [ 'openpibo-files/image/weather',  '/home/pi/openpibo-files/image/weather/' ],
              [ 'openpibo-files/image/etc',  '/home/pi/openpibo-files/image/etc/' ],
              [ 'openpibo-files/image/sample',  '/home/pi/openpibo-files/image/sample/' ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "filename",
            "options": [['%{BKY_FILE_SELECT}', '']]
          },
        ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_IMREAD_DYNAMIC_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myimage', '/home/pi/myimage/' ],
              [ 'openpibo-files/image/animal', '/home/pi/openpibo-files/image/animal/' ],
              [ 'openpibo-files/image/expression',  '/home/pi/openpibo-files/image/expression/' ],
              [ 'openpibo-files/image/family',  '/home/pi/openpibo-files/image/family/' ],
              [ 'openpibo-files/image/food',  '/home/pi/openpibo-files/image/food/' ],
              [ 'openpibo-files/image/furniture',  '/home/pi/openpibo-files/image/furniture/' ],
              [ 'openpibo-files/image/game',  '/home/pi/openpibo-files/image/game/' ],
              [ 'openpibo-files/image/goods',  '/home/pi/openpibo-files/image/goods/' ],
              [ 'openpibo-files/image/kitchen',  '/home/pi/openpibo-files/image/kitchen/' ],
              [ 'openpibo-files/image/machine',  '/home/pi/openpibo-files/image/machine/' ],
              [ 'openpibo-files/image/recycle',  '/home/pi/openpibo-files/image/recycle/' ],
              [ 'openpibo-files/image/sport',  '/home/pi/openpibo-files/image/sport/' ],
              [ 'openpibo-files/image/transport',  '/home/pi/openpibo-files/image/transport/' ],
              [ 'openpibo-files/image/weather',  '/home/pi/openpibo-files/image/weather/' ],
              [ 'openpibo-files/image/etc',  '/home/pi/openpibo-files/image/etc/' ],
              [ 'openpibo-files/image/sample',  '/home/pi/openpibo-files/image/sample/' ]
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
        ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_IMREAD_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myimage', '/home/pi/myimage/' ]
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
          {"type": "input_value", "name": "img", "check":"Array"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_IMWRITE_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'myimage', '/home/pi/myimage/' ],
              [ 'openpibo-files/image/animal', '/home/pi/openpibo-files/image/animal/' ],
              [ 'openpibo-files/image/expression',  '/home/pi/openpibo-files/image/expression/' ],
              [ 'openpibo-files/image/family',  '/home/pi/openpibo-files/image/family/' ],
              [ 'openpibo-files/image/food',  '/home/pi/openpibo-files/image/food/' ],
              [ 'openpibo-files/image/furniture',  '/home/pi/openpibo-files/image/furniture/' ],
              [ 'openpibo-files/image/game',  '/home/pi/openpibo-files/image/game/' ],
              [ 'openpibo-files/image/goods',  '/home/pi/openpibo-files/image/goods/' ],
              [ 'openpibo-files/image/kitchen',  '/home/pi/openpibo-files/image/kitchen/' ],
              [ 'openpibo-files/image/machine',  '/home/pi/openpibo-files/image/machine/' ],
              [ 'openpibo-files/image/recycle',  '/home/pi/openpibo-files/image/recycle/' ],
              [ 'openpibo-files/image/sport',  '/home/pi/openpibo-files/image/sport/' ],
              [ 'openpibo-files/image/transport',  '/home/pi/openpibo-files/image/transport/' ],
              [ 'openpibo-files/image/weather',  '/home/pi/openpibo-files/image/weather/' ],
              [ 'openpibo-files/image/etc',  '/home/pi/openpibo-files/image/etc/' ],
              [ 'openpibo-files/image/sample',  '/home/pi/openpibo-files/image/sample/' ]
            ]
          },
          {"type": "input_value", "name": "filename", "check":"String"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_IMSHOW_TO_IDE_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_imshow_to_ide_img',
      message0: '%{BKY_VISION_IMSHOW_TO_IDE_IMG}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/display-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "img", "check":"Array"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_IMSHOW_TO_IDE_IMG_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_rectangle',
      message0: '%{BKY_VISION_RECTANGLE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/draw-polygon-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "img", "check":"Array"},
          {"type": "input_value", "name": "x1", "check":"Number"},
          {"type": "input_value", "name": "y1", "check":"Number"},
          {"type": "input_value", "name": "x2", "check":"Number"},
          {"type": "input_value", "name": "y2", "check":"Number"},
          {"type": "input_value", "name": "color", "check":"Colour"},
          {"type": "input_value", "name": "tickness", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_RECTANGLE_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_circle',
      message0: '%{BKY_VISION_CIRCLE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/draw-polygon-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "img", "check":"Array"},
          {"type": "input_value", "name": "x", "check":"Number"},
          {"type": "input_value", "name": "y", "check":"Number"},
          {"type": "input_value", "name": "r", "check":"Number"},
          {"type": "input_value", "name": "color", "check":"Colour"},
          {"type": "input_value", "name": "tickness", "check":"Number"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_CIRCLE_TOOLTIP}',
      helpUrl: ''
    },

    {
      type: 'vision_text',
      message0: '%{BKY_VISION_TEXT}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/font-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
          {"type": "input_value", "name": "img", "check":"Array"},
          {"type": "input_value", "name": "text", "check":"String"},
          {"type": "input_value", "name": "x", "check":"Number"},
          {"type": "input_value", "name": "y", "check":"Number"},
          {"type": "input_value", "name": "size", "check":"Number"},
          {"type": "input_value", "name": "color", "check":"Colour"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_TEXT_TOOLTIP}',
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
            [ '%{BKY_VISION_CARTOON}', 'cartoon'],
            [ '%{BKY_VISION_DETAIL}', 'detail' ],
            [ '%{BKY_VISION_SKETCH_G}', 'sketch_g'],
            [ '%{BKY_VISION_SKETCH_C}', 'sketch_c']
          ]
        },
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_TRANSFER_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_face',
      message0: '%{BKY_VISION_FACE}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/face-smile-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_FACE_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_face_age',
      message0: '%{BKY_VISION_FACE_AGE}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/face-smile-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"},
        {"type": "input_value", "name": "v", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_FACE_AGE_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_face_gender',
      message0: '%{BKY_VISION_FACE_GENDER}',
      "args0": [
        {
          "type": "field_image",
          "src": "svg/face-smile-solid.svg",
          "width": 27,
          "height": 27
        },
        {"type":"input_dummy"},
        {"type": "input_value", "name": "img", "check":"Array"},
        {"type": "input_value", "name": "v", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_FACE_GENDER_TOOLTIP}',
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
      tooltip: '%{BKY_VISION_OBJECT_TOOLTIP}',
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
      tooltip: '%{BKY_VISION_QR_TOOLTIP}',
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
      tooltip: '%{BKY_VISION_POSE_TOOLTIP}',
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
      tooltip: '%{BKY_VISION_ANALYZE_POSE_TOOLTIP}',
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
      tooltip: '%{BKY_VISION_CLASSIFICATION_TOOLTIP}',
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
              [ '%{BKY_FOLDER_SELECT}', ''],
              [ 'code', '/home/pi/code/' ],
              [ 'mymodel', '/home/pi/mymodel/' ],
            ]
          },
          {"type": "input_value", "name": "modelpath", "check":"String"},
          {"type": "input_value", "name": "labelpath", "check":"String"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_LOAD_TM_TOOLTIP}',
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
      tooltip: '%{BKY_VISION_PREDICT_TM_TOOLTIP}',
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
            [ '%{BKY_VISION_CAPTION_TIME}', 'caption/caption_time_e' ],
            [ '%{BKY_VISION_CAPTION_WEATHER}', 'caption/caption_weather_e' ]
          ]
        },
        {"type": "field_dropdown", "name":"dir",
          "options":[
            [ '%{BKY_FOLDER_SELECT}', ''],
            [ 'code', '/home/pi/code/' ],
            [ 'myimage', '/home/pi/myimage/' ],
          ]
        },
        {"type": "input_value", "name": "filename", "check":"String"},
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_CALL_AI_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'vision_call_ai_img',
      message0: '%{BKY_VISION_CALL_AI_IMG}',
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
            [ '%{BKY_VISION_CAPTION_TIME}', 'caption/caption_time_e' ],
            [ '%{BKY_VISION_CAPTION_WEATHER}', 'caption/caption_weather_e' ]
          ]
        },
        {"type": "input_value", "name": "img", "check":"Array"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '%{BKY_VISION_CALL_AI_IMG_TOOLTIP}',
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
      tooltip: '%{BKY_UTILS_SLEEP_TOOLTIP}',
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
      tooltip: '%{BKY_UTILS_TIME_TOOLTIP}',
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
      tooltip: '%{BKY_UTILS_CURRENT_TIME_TOOLTIP}',
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
      tooltip: '%{BKY_UTILS_INCLUDE_TOOLTIP}',
      helpUrl: ''
    },
    {
      type: 'utils_dict_get',
      message0: '%{BKY_UTILS_DICT_GET}',
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
        tooltip: '%{BKY_UTILS_DICT_GET_TOOLTIP}',
        helpUrl: ''
    },
    {
      type: 'utils_dict_set',
      message0: '%{BKY_UTILS_DICT_SET}',
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
          {"type": "input_value", "name": "keyname", "check":"String"},
          {"type": "input_value", "name": "value"}
        ],
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
        colour: color_type["utils"],
        tooltip: '%{BKY_UTILS_DICT_SET_TOOLTIP}',
        helpUrl: ''
    },
    {
      type: 'utils_dict_create',
      message0: '%{BKY_UTILS_DICT_CREATE}',
      args0:
        [
          {
            "type": "field_image",
            "src": "svg/database-solid.svg",
            "width": 27,
            "height": 27
          },
          {"type":"input_dummy"},
        ],
        output: null,
        inputsInline: true,
        colour: color_type["utils"],
        tooltip: '%{BKY_UTILS_DICT_CREATE_TOOLTIP}',
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
        tooltip: '%{BKY_UTILS_CHECK_PATH_TOOLTIP}',
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
        tooltip: '%{BKY_UTILS_TYPECAST_STRING_TOOLTIP}',
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
        tooltip: '%{BKY_UTILS_TYPECAST_NUMBER_TOOLTIP}',
        helpUrl: ''
    },
  ]
);

function updateSecondDropdown(folderValue, fileValue) {
  let dropdown = this.getField("filename");

  if(dropdown) {
    getFilesForFolder(folderValue).then(fileOptions => {
      fileOptions.unshift(Blockly.Msg["FILE_SELECT"]);
      dropdown.menuGenerator_ = fileOptions.map(file => [file, file]);
      dropdown.setValue(fileValue?fileValue:fileOptions[0]);
    }).catch(error => {
      dropdown.menuGenerator_ = [Blockly.Msg["FILE_SELECT"]].map(file => [file, file]);
      dropdown.setValue(Blockly.Msg["FILE_SELECT"]);
    });
  }
  else {
    console.log('no dropdown');
  }
}

function getFilesForFolder(folderValue) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `http://${location.hostname}:50000/dir?folderName=${folderValue}`,
      method: 'GET',
      success: function(data) {
        resolve(data); // AJAX 요청 성공 시, 데이터를 resolve로 반환
      },
      error: function(xhr, status, error) {
        reject(error); // AJAX 요청 실패 시, 에러를 reject로 반환
      }
    });
  });
}
