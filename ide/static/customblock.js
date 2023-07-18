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
          {"type": "input_value", "name": "filename"}, 
          {
            "type": "field_number",
            "name": "volume",
            "value": 80,
            "min": 0,
            "max": 100,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '오디오 파일을 재생합니다.',
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
      tooltip: '오디오 재생을 정지합니다.',
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
          {"type": "input_value", "name": "filename"},
          {
            "type": "field_number",
            "name": "timeout",
            "value": 5,
            "min": 0,
            "max": 100,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["audio"],
      tooltip: '마이크로 녹음하여 오디오 파일을 생성합니다.',
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
          {"type": "input_value", "name": "topic"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '(인터넷 연결 필수) 위키피디아의 검색한 결과를 가져옵니다.',
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
          [ '전국', '전국' ], [ '서울', '서울' ],
          [ '인천', '인천' ], [ '경기', '경기' ],
          [ '부산', '부산' ], [ '울산', '울산' ],
          [ '경남', '경남' ], [ '대구', '대구' ],
          [ '경북', '경북' ], [ '광주', '광주' ],
          [ '전남', '전남' ], [ '전북', '전북' ],
          [ '대전', '대전' ], [ '세종', '세종' ],
          [ '충남', '충남' ], [ '충북', '충북' ],
          [ '강원', '강원' ], [ '제주', '제주' ]
         ]
       },
       {"type": "field_dropdown", "name":"mode",
       "options":[
        [ '종합', 'forecast' ], [ '오늘', 'today' ],
        [ '내일', 'tomorrow' ], [ '모레', 'after_tomorrow' ]
       ]
      }
      ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '(인터넷 연결 필수) 공공 데이터를 사용하여, 날씨를 가져옵니다.',
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
            [ '속보', '속보' ],
            [ '정치', '정치' ],
            [ '경제', '경제' ],
            [ '사회', '사회' ],
            [ '국제', '국제' ],
            [ '문화', '문화' ],
            [ '연예', '연예' ],
            [ '스포츠', '스포츠' ],
            [ '뉴스랭킹', '뉴스랭킹' ],
          ]
          },
          {"type": "field_dropdown", "name":"mode",
          "options":[
            [ '제목', 'title' ],
            [ '내용', 'description' ],
            [ '링크', 'link']
          ]
          }
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["collect"],
      tooltip: '(인터넷 연결 필수) RSS 를 통해 뉴스를 가져옵니다.',
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
          {
            "type": "field_number",
            "name": "val0",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val1",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val2",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val3",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val4",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "val5",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '로봇의 눈 색상을 설정합니다.',
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
          {"type": "input_value", "name": "left"},
          {"type": "input_value", "name": "right"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["device"],
      tooltip: '색상 블록을 이용하여, 로봇의 눈 색상을 설정합니다.',
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
      tooltip: '로봇의 눈 색상을 초기화합니다.',
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
      tooltip: '전원 연결 정보를 가져옵니다.',
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
      tooltip: '배터리 잔량을 가져옵니다.',
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
      tooltip: '시스템 정보를 가져옵니다.(인체감지,터치센서,버튼)',
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
      tooltip: '인체감지센서 결과를 가져옵니다.',
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
      tooltip: '터치센서 결과를 가져옵니다.',
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
      tooltip: '버튼 인식 결과를 가져옵니다.',
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
      tooltip: '모션 목록을 가져옵니다.',
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
      tooltip: '내가 만든 모션 목록을 가져옵니다.',
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
          {"type": "input_value", "name": "name"}, 
          {
            "type": "field_number",
            "name": "cycle",
            "value": 1,
            "min": 1,
            "max": 10,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '모션을 실행합니다.',
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
          {"type": "input_value", "name": "name"}, 
          {
            "type": "field_number",
            "name": "cycle",
            "value": 1,
            "min": 1,
            "max": 10,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '내가 만든 모션을 실행합니다.',
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
      tooltip: '초기 동작을 실행합니다.',
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
              ['오른발[0]','0'],
              ['오른다리[1]','1'],
              ['오른팔[2]','2'],
              ['오른손[3]','3'],
              ['목[4]','4'],
              ['머리[5]','5'],
              ['왼발[6]','6'],
              ['왼다리[7]','7'],
              ['왼팔[8]','8'],
              ['왼손[9]','9'],
            ]
          },
          {
            "type": "field_number",
            "name": "pos",
            "value": 0,
            "min": -80,
            "max": 80,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '개별 모터를 이동합니다.',
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
              ['오른발[0]','0'],
              ['오른다리[1]','1'],
              ['오른팔[2]','2'],
              ['오른손[3]','3'],
              ['목[4]','4'],
              ['머리[5]','5'],
              ['왼발[6]','6'],
              ['왼다리[7]','7'],
              ['왼팔[8]','8'],
              ['왼손[9]','9'],
            ]
          },
          {
            "type": "field_number",
            "name": "val",
            "value": 40,
            "min": 0,
            "max": 255,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '개별 모터의 속도를 설정합니다.',
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
            ['오른발[0]','0'],
            ['오른다리[1]','1'],
            ['오른팔[2]','2'],
            ['오른손[3]','3'],
            ['목[4]','4'],
            ['머리[5]','5'],
            ['왼발[6]','6'],
            ['왼다리[7]','7'],
            ['왼팔[8]','8'],
            ['왼손[9]','9'],
            ]
          },
          {
            "type": "field_number",
            "name": "val",
            "value": 0,
            "min": 0,
            "max": 255,
            "precision": 1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["motion"],
      tooltip: '개별 모터의 가속도를 설정합니다.',
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
          // {"type": "input_value", "name": "font"}, 
          {
            "type": "field_number",
            "name": "size",
            "value": 10,
            "min": 5,
            "max": 50,
            "precision": 1
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'OLED 의 글씨 크기를 설정합니다.',
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
          {
            "type": "field_number",
            "name": "x",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
          {"type": "input_value", "name": "text"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'OLED 에 글씨를 입력합니다.',
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
          {"type": "input_value", "name": "filename"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'OLED 에 이미지를 입력합니다.',
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
          {
            "type": "field_number",
            "name": "x1",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y1",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "x2",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y2",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
          {"type": "field_dropdown", "name":"fill",
           "options":[
              ['채우기','True'],['채우기 없음','False']
            ]
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'OLED 에 네모를 입력합니다.',
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
          {
            "type": "field_number",
            "name": "x1",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y1",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "x2",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y2",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
          {"type": "field_dropdown", "name":"fill",
           "options":[
              ['채우기','True'],['채우기 없음','False']
            ]
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'OLED 에 타원을 입력합니다.',
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
          {
            "type": "field_number",
            "name": "x1",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y1",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "x2",
            "value": 0,
            "min": 0,
            "max": 128,
            "precision": 1
          },
          {
            "type": "field_number",
            "name": "y2",
            "value": 0,
            "min": 0,
            "max": 64,
            "precision": 1
          },
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["oled"],
      tooltip: 'OLED 에 선을 입력합니다.',
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
      tooltip: 'OLED 화면을 반전합니다.',
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
      tooltip: 'OLED 에 저장된 내용을 표시합니다.',
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
      tooltip: 'OLED 의 내용을 초기화합니다.',
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
          {
            "type": "field_number",
            "name": "timeout",
            "value": 5,
            "min": 1,
            "max": 30,
            "precision": 1
          }
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: '(인터넷 연결 필수) 음성인식을 실행합니다.',
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
          {"type": "input_value", "name": "text"},
          {"type": "field_dropdown", "name":"dir",
            "options":[
              [ 'code/', '/home/pi/code/' ],
              [ 'myaudio/', '/home/pi/myaudio/'],
              [ '/home/pi/', '/home/pi/' ],
              [ 'none', '']
            ]
          },
          {"type": "input_value", "name": "filename"},
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
      tooltip: '(인터넷 연결 필수) 음성합성을 실행합니다.',
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
          {"type": "input_value", "name": "text"}
        ],
      output: 'String',
      inputsInline: true,
      colour: color_type["speech"],
      tooltip: '음성대화를 실행합니다.',
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
          {"type": "input_value", "name": "filename"}
        ],
        nextStatement: true,
        previousStatement: true,
        inputsInline: true,
        colour: color_type["speech"],
        tooltip: '음성대화 데이터를 불러옵니다.',
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
      tooltip: '사진을 촬영하여 이미지 데이터로 만듭니다.',
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
        {"type": "input_value", "name": "filename"},
        ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '사진을 촬영하여 이미지 데이터로 만듭니다.',
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
          {"type": "input_value", "name": "filename"},
          {"type": "input_value", "name": "img"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '이미지 데이터를 사진 파일로 저장합니다.',
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
          {"type": "input_value", "name": "filename"},
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '사진 파일을 이미지 뷰어에 표시합니다.',
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
        {"type": "input_value", "name": "img"},
        {"type": "field_dropdown", "name":"type",
          "options":[
            [ '만화(고속)', 'cartoon' ],
            [ '만화', 'cartoon_n'],
            [ '상세한 이미지', 'detail' ],
            [ '스케치(흑백)', 'sketch_g'],
            [ '스케치(컬러)', 'sketch_c']
          ]
        },
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '이미지를 다양한 형태로 변환합니다.',
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
        {"type": "input_value", "name": "img"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '이미지에서 사물을 인식합니다. (80가지 사물)',
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
        {"type": "input_value", "name": "img"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '이미지에서 QR코드를 인식합니다.',
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
        {"type": "input_value", "name": "img"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '이미지에서 사람 포즈를 계산합니다.',
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
            [ '모션인식', 'motion' ],
            [ '포즈좌표', 'pose'],
            [ '사람좌표', 'person' ],
            [ '정확도', 'acc']
          ]
        }
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '이미지 포즈 데이터를 분석합니다.',
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
        {"type": "input_value", "name": "img"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '이미지를 분류합니다. (1000가지 분류)',
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
          {"type": "input_value", "name": "modelpath"},
          {"type": "input_value", "name": "labelpath"}
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '티쳐블머신 모델을 불러옵니다.',
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
        {"type": "input_value", "name": "img"}
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '티쳐블머신을 이용하여 이미지 분류를 실행합니다.',
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
            [ '이미지캡션', 'caption/caption' ],
            [ '이미지태그', 'caption/caption_tag_e' ],
            [ '장소인식', 'caption/caption_place_e' ],
            [ '시간인식', 'caption/caption_time_e' ]
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
      {"type": "input_value", "name": "filename"},
      ],
      output: null,
      inputsInline: true,
      colour: color_type["vision"],
      tooltip: '(인터넷 연결 필수) 인공지능 이미지 분석을 실행합니다.',
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
          {
            "type": "field_number",
            "name": "time",
            "value": 1,
            "min": 0.1,
            "max": 100,
            "precision": 0.1
          }
        ],
      nextStatement: true,
      previousStatement: true,
      inputsInline: true,
      colour: color_type["utils"],
      tooltip: '설정한 시간만큼 동작을 지연시킵니다.',
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
      tooltip: '시간 데이터를 가져옵니다.',
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
      tooltip: '현재 시간을 가져옵니다.',
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
      tooltip: '특정 항목이 목록에 존재하는지 확인합니다.',
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
          {"type": "input_value", "name": "keyname"}
        ],
        output: null,
        inputsInline: true,
        colour: color_type["utils"],
        tooltip: '딕셔너리의 특정 키에 매핑된 값을 가져옵니다.',
        helpUrl: ''
    },
  ]
);