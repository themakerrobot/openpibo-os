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

// initial
$(document).ready(function(){
  $('.motor').each(function(){
    let id = $(this).attr("id")
    $(this).append(
      '(' + motorsIdx[id] + ')' + id + '<br>',
      $('<input type="range" class="motor-range form-range">')
        .attr("min", -motorsRange[id]).attr("max", motorsRange[id]),
      $('<input type="number" class="motor-value form-control">')
        .attr("min", -motorsRange[id]).attr("max", motorsRange[id])
    )
  })
  socket.emit("motor_init")
  socket.on('init_motion', function(currentD){
    $('.motor').each(function(){
      let motorVal = currentD[motorsIdx[$(this).attr("id")]]
      $(this).children(".motor-value").val(motorVal)
      $(this).children(".motor-range").val(motorVal)
    })
  })
})

// 모터 제어
$(function(){
  let motor = $('.motor'),
      range = $('.motor-range'),
      value = $('.motor-value')

  motor.each(function(){
    value.each(function(){
      $(this).val($(this).prev(range).val())
    })
    range.on('input', function(){
      $(this).next(value).val(this.value)
    })
    
    range.each(function(){
      $(this).val($(this).next(value).val())
    })
    value.on('input', function(){
      $(this).prev(range).val(this.value)
    })
    
    $(this).on('input', function(){
      let motorName = $(this).attr('id')
      let motorVal = $(this).children(".motor-range").val()
      socket.emit('set_pos', motorsIdx[motorName], Number(motorVal))
    })
  })

  // 타임라인 동기화
  let timeLine = $('#timeline'),
      timeVal = $('#time_val')

  timeLine.on("input", function(){
    timeVal.val($(this).val())
  })
  timeVal.on("input", function(){
    timeLine.val($(this).val())
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
          let seq = Number($(this).text().split(' ms')[0])
          socket.emit('remove_frame', seq)
          $(this).remove()
        })
      );
    }
  })

  // 동작 재생
  $("#play_frame_bt").click(function () {
    if ($('#record_table > tbody').text()) {
      let cycle = $("#play_cycle_val").val()
      socket.emit("play_frame", cycle);
    } else {
      alert("저장된 동작이 없습니다.\n먼저 동작을 저장해주세요.")
    }
  });

  // 테이블 초기화
  $("#init_frame_bt").click(function () {
    socket.emit("init_frame")
    $("#record_table > tbody").empty();
  });
  
  // 코드 생성
  $("#export_bt").click(function () {
    let motionName = $("#export_val").val()
    socket.emit("export", motionName);
  });
  socket.on("disp_code", function(code){
    $("#code").text(code)
  })
})