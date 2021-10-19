const socket = io()
const motorsIdx = {
  'Right Foot': 0,
  'Right Leg' : 1,
  'Right Arm' : 2,
  'Right Hand': 3,
  'Head Pan'  : 4,
  'Head Tilt' : 5,
  'Left Foot' : 6,
  'Left Leg'  : 7,
  'Left Arm'  : 8,
  'Left Hand' : 9,
}
const motorsRange = {
  'Right Foot': 25,
  'Right Leg' : 35,
  'Right Arm' : 80,
  'Right Hand': 30,
  'Head Pan'  : 50,
  'Head Tilt' : 25,
  'Left Foot' : 25,
  'Left Leg'  : 35,
  'Left Arm'  : 80,
  'Left Hand' : 30,
}
const motorInit = {
  'Right Foot': 0,
  'Right Leg' : 0,
  'Right Arm' : -80,
  'Right Hand': 0,
  'Head Pan'  : 0,
  'Head Tilt' : 0,
  'Left Foot' : 0,
  'Left Leg'  : 0,
  'Left Arm'  : 80,
  'Left Hand' : 0,
}

// initial
$(document).ready(function(){
  $('.motor').each(function(){
    let id = $(this).attr("id")
    $(this).append(
      //'(' + motorsIdx[id] + ')' + id + '<br>',
      id + '[' + motorsIdx[id] + ']<br>',
      $('<input type="range" class="motor-range form-range">')
        .attr("min", -motorsRange[id]).attr("max", motorsRange[id]),
      $('<input type="number" class="motor-value form-control">')
        .attr("min", -motorsRange[id]).attr("max", motorsRange[id])
    )
  })
  socket.emit("motor_init")
  socket.on('init_motion', function(data){
    $('.motor').each(function(){
      let motorVal = data[motorsIdx[$(this).attr("id")]]
      $(this).children(".motor-value").val(motorVal)
      $(this).children(".motor-range").val(motorVal)
    })
  })
})

// 모터 제어
$(function(){
  $('.motor').each(function(){
    let motor = $(this)
    motor.children(".motor-value").on("input", function(){
      motor.children('.motor-range').val($(this).val())
    });

    motor.children(".motor-range").on("input", function(){
      motor.children(".motor-value").val($(this).val())
    });

    motor.on('input', function(){
      let motorName = motor.attr('id')
      let motorVal = motor.children(".motor-range").val()
      socket.emit('set_pos', motorsIdx[motorName], Number(motorVal))
    })
  })

  $('#init_bt').click(function(){
    $('.motor').each(function(){
      let motorName = $(this).attr('id')
      let motorVal = motorInit[motorName]
      $(this).children('.motor-range').val(motorVal)
      $(this).children(".motor-value").val(motorVal)
      socket.emit('set_pos', motorsIdx[motorName], Number(motorVal))
    });
  });

  // 타임라인 동기화
  $('#timeline').on("input", function(){
    $('#time_val').val($(this).val())
  })
  $('#time_val').on("input", function(){
    $('#timeline').val($(this).val())
  })

  // 저장 버튼
  $('#add_frame_bt').click(function(){
    let seq = $('#time_val').val()
    socket.emit('add_frame', seq);
  });

  // 테이블 작성
  socket.on('disp_record', function(data){
    $('#record_table > tbody').empty();
    for(let i=0; i < data.length;i++){
      $('#record_table > tbody').append(
        $('<tr>').append(
          $('<td>').append(data[i].seq +' ms'),
          $('<td>').append(data[i].d[0]),
          $('<td>').append(data[i].d[1]),
          $('<td>').append(data[i].d[2]),
          $('<td>').append(data[i].d[3]),
          $('<td>').append(data[i].d[4]),
          $('<td>').append(data[i].d[5]),
          $('<td>').append(data[i].d[6]),
          $('<td>').append(data[i].d[7]),
          $('<td>').append(data[i].d[8]),
          $('<td>').append(data[i].d[9]),
        ).hover(function(){ // 포즈 하나 삭제 옵션
          $(this).attr("style", "background-color:pink")
        }, function(){
          $(this).attr("style", "")
        }).click(function(){
          if(confirm("삭제하시겠습니까?")){
            socket.emit('remove_frame', Number($(this).text().split(' ms')[0]))
            $(this).remove()
          }
        })
      );
    }
  })
  
  // 테이블 초기화
  $("#init_frame_bt").click(function () {
    socket.emit("init_frame")
    $("#record_table > tbody").empty();
  });

  // 동작 재생
  $("#play_frame_bt").click(function () {
    if ($('#record_table > tbody').text()) {
      let cycle = $("#play_cycle_val").val()
      socket.emit("play_frame", cycle);
    } else {
      alert("저장된 동작이 없습니다.\n먼저 동작을 저장해주세요.")
    }
  });

  // 모션 추가
  $("#add_motion_bt").click(function () {
    let motionName = $("#motion_name_val").val()
    socket.emit("add_motion", motionName);
  });

  // 모션 불러오기 
  $("#load_motion_bt").click(function () {
    let motionName = $("#motion_name_val").val()
    socket.emit("load_motion", motionName);
  });

  // 모션 삭제
  $("#del_motion_bt").click(function () {
    let motionName = $("#motion_name_val").val()
    socket.emit("del_motion", motionName);
  });

  // 코드 생성
  $("#save_bt").click(function () {
    socket.emit("save");
  });

  $("#display_bt").click(function () {
    socket.emit("display");
  });
  
  $("#reset_bt").click(function () {
    socket.emit("reset");
  });
  
  socket.on("disp_code", function(code){
    $("#code").text(JSON.stringify(code))
  })
})
