const getStatus = (socket) => {
  $("#devtool_bt").on("click", function(){
    if (confirm("IDE로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)")) {
      socket.emit("onoff", "off");
      $(location).attr( "href", "http://" + window.location.hostname + ":50000");
    }
  });
  $("#devtool_bt").hover(
    function () { $(this).animate({ opacity: "0.7" }, 100); $(this).css("cursor", "pointer"); },
    function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
  );

  $("#logo_bt").on("click", () => {
    window.location.replace(`http://${window.location.hostname}:80`);
  });

  socket.emit("onoff");
  socket.on("onoff", function (d) {
    $("input:checkbox[name=onoff_sel]").prop("disabled", false);
    $("input:checkbox[name=onoff_sel]").attr(
      "checked",
      d == "on" ? true : false
    );
    $("#state").html(
      d == "on"?
      "<i class='fa-solid fa-person-running'></i>":
      "<i class='fa-solid fa-person'></i>"
      );
  });

  $("input:checkbox[name=onoff_sel]").change(function () {
    let sel = $("input:checkbox[name=onoff_sel]").is(":checked")? "on" : "off";
    $("input:checkbox[name=onoff_sel]").prop("disabled", true);
    socket.emit("onoff", sel);
  });


  $("#volume").val(
      window.localStorage.getItem("volume")?
      window.localStorage.getItem("volume"):80
  );
  
  $("#volume").on("change", ()=>{
    window.localStorage.setItem("volume", $("#volume").val());
  });

  socket.emit("system");
  setInterval(function () {
    socket.emit("system");
  }, 10000);

  socket.on("system", function (data) {
    $("#s_serial").text(data[0]);
    $("#s_os_version").text(data[1]);
    $("#s_runtime").text(Math.floor(data[2] / 3600) + " Hours");
    $("#s_cpu_temp").text(data[3]);
    $("#s_memory").text(Math.floor((data[5] / data[4] / 4) * 100) + " %");
    $("#s_network").text(data[6] + "/" + data[7].replace("\n", ""));
  });

  setTimeout(function () {
    socket.emit("wifi");
  }, 1000);
  socket.on("wifi", function (data) {
    $("#ssid").val(data["ssid"]);
    $("#password").val(data["psk"]);
  });

  $("#wifi_bt").on("click", function () {
    let comment = "WIFI 정보를 변경하시겠습니까?";
    comment += "\nssid: " + $("#ssid").val();
    comment += "\npassword: " + $("#password").val();
    if (confirm(comment)) {
      socket.emit("wifi", { ssid: $("#ssid").val(), psk: $("#password").val() });
    }
  });

  socket.on("eye_update", function (data) {
    $("#eye").val(data);
  });

  $("#poweroff_bt").on("click", function () {
    if (confirm("정말 종료하시겠습니까?"))
      socket.emit("poweroff");
  });

  $("#restart_bt").on("click", function () {
    if (confirm("재시작하시겠습니까?"))
      socket.emit("restart");
  });

  $("#swupdate_bt").on("click", function () {
    if (confirm("업데이트를 하시겠습니까?(불안정-문제가 발생할 수 있습니다.)"))
      socket.emit("swupdate");
  });
};

const getVisions = (socket) => {
  socket.on("disp_vision", function(data) {
    $(`input[name=v_func_type][value=${data}]`).prop("checked", true);
  });

  socket.on("stream", function (data) {
    $("#v_img").attr(
      "src",
      "data:image/jpeg;charset=utf-8;base64," + data["img"]
    );
    $("#v_result").text(data["data"]);
  });

  $("input[name=v_func_type]").on("change", function(){
    let sel = $("input[name=v_func_type]:checked").val();
    socket.emit("detect", sel);
  });

  $("#v_capture").on("click", function(){
    let capture_a = document.createElement('a');
    capture_a.setAttribute("href", "/download_img");
    capture_a.click();
  });

  $("#v_upload_tm").on("change", (e) => {
    let formData = new FormData();
    formData.append('data', $("#v_upload_tm")[0].files[0]);
    $.ajax({
      url: `/upload_tm`,
      type:'post',
      data: formData,
      contentType: false,
      processData: false    
    })
    .always((xhr, status) => {
      if (status == "success") {
        alert(`파일 전송이 완료되었습니다.`);
      }
      else {
        alert(`파일 전송 에러입니다.\n >> ${xhr.responseJSON['result']}`);
        $("#v_upload_tm").val("");
      }
    });
  });
};

const getMotions = (socket) => {
  const motor_default = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0];

  for (let i = 0; i < 10; i++) {
    let tval = "#m" + i + "_value";
    let trange = "#m" + i + "_range";

    $(trange).on("input", function (evt) {
      $(tval).val($(trange).val());
    });

    $(trange).on("click touchend", function (evt) {
      socket.emit("set_motor", { idx: i, pos: Number($(trange).val()) });
    });

    $(tval).on("focusout keydown", function (evt) {
      if (evt.type == "focusout" || (evt.type == "keydown" && evt.keyCode == 13)) {
        let pos = Number($(this).val());
        let min = Number($(this).attr("min"));
        let max = Number($(this).attr("max"));

        if (isNaN(pos) || pos < min || pos > max) {
          $(this).val($(trange).val());
          alert(min + " ~ " + max + " 사이를 입력하세요.");
        }
        else {
          socket.emit("set_motor", { idx: i, pos: pos });
        }
      }
    });

    $(tval).on("click", function (evt) {
      let pos = $(tval).val();
      $(trange).val(pos);
      socket.emit("set_motor", { idx: i, pos: Number(pos) });
    });
  }

  $("#m_time_val").on("focusout keydown", function (evt) {
    if (evt.type == "focusout" || (evt.type == "keydown" && evt.keyCode == 13)) {
      let pos = Number($(this).val());
      let min = Number($(this).attr("min"));
      let max = Number($(this).attr("max"));

      if (isNaN(pos) || pos < min || pos > max) {
        $(this).val(0);
        alert(min + " ~ " + max + " 사이를 입력하세요.");
      }
    }
  });

  $("#init_bt").on("click", function () {
    for (let i = 0; i < 10; i++) {
      $("#m" + i + "_value").val(motor_default[i]);
      $("#m" + i + "_range").val(motor_default[i]);
    }
    socket.emit("set_motors", { pos_lst: motor_default });
  });

  // 저장 버튼
  $("#add_frame_bt").on("click", function () {
    socket.emit("add_frame", $("#m_time_val").val()*1000);
  });

  socket.on("disp_motion", function (datas) {
    // 모터 값 로드
    if ("pos" in datas) {
      let data = datas["pos"]
      for (let i = 0; i < 10; i++) {
        let tval = "#m" + i + "_value";
        let trange = "#m" + i + "_range";
        $(tval).val(data[i]);
        $(trange).val(data[i]);
      }
    }

    // json 로드
    if ("record" in datas) {
      let res = [];
      for(name in datas["record"]) {
        res.push(name);
      }

      $("#motor_record").text(res.join(", "));
    }

    // 테이블 로드
    if ("table" in datas) {
      let data = datas["table"];

      for (let i = 0; i < data.length; i++) {
        if (i != 0)
          for (let j = 0;j < 10;j++){
            data[i].d[j] = (data[i].d[j] == 999)? data[i-1].d[j] : data[i].d[j];
          }
      }

      $("#motor_table > tbody").empty();
      for (let i = 0; i < data.length; i++) {
        $("#motor_table > tbody").append(
          $("<tr>")
            .append(
              $("<td>").append(data[i].seq/1000 + " 초"),
              $("<td>").append(data[i].d[0]),
              $("<td>").append(data[i].d[1]),
              $("<td>").append(data[i].d[2]),
              $("<td>").append(data[i].d[3]),
              $("<td>").append(data[i].d[4]),
              $("<td>").append(data[i].d[5]),
              $("<td>").append(data[i].d[6]),
              $("<td>").append(data[i].d[7]),
              $("<td>").append(data[i].d[8]),
              $("<td>").append(data[i].d[9])
            )
            .hover(
              function () {
                $(this).animate({ opacity: "0.5" }, 100);
              },
              function () {
                $(this).animate({ opacity: "1" }, 100);
              }
            )
            .click(function () {
              let pos_lst = []
              let lst = $(this).children();
              lst.each((idx) => {
                if (idx == 0){
                  $("#m_time_val").val(Number(lst.eq(idx).text().split(' 초')[0]));
                  return;
                }
                else {
                  let val = Number(lst.eq(idx).text());
                  $("#m" + (idx-1) + "_value").val(val);
                  $("#m" + (idx-1) + "_range").val(val);
                  pos_lst[idx-1] = val;
                }
              });
              
              socket.emit("set_motors", { pos_lst: pos_lst });
            })
            .dblclick(function () {
              let t = $(this).text().split(" 초")[0];
              if (confirm(t + " 초 항목을 삭제하시겠습니까?")) {
                socket.emit("delete_frame", Number(t)*1000);
                $(this).remove();
              }
            })
          );
      }
    }
  });

  // 테이블 초기화
  $("#init_frame_bt").on("click", function () {
    if (confirm("테이블을 모두 지우시겠습니까?")) {
      socket.emit("init_frame");
      $("#motor_table > tbody").empty();
    }
  });

  // 동작 재생
  $("#play_frame_bt").on("click", function () {
    if ($("#motor_table > tbody").text()) {
      let cycle = $("#play_cycle_val").val();
      socket.emit("play_frame", cycle);
    } else {
      alert("저장된 동작이 없습니다.\n먼저 동작을 저장해주세요.");
    }
  });
  
  $("#play_cycle_val").on("focusout keydown", function (evt) {
    if (evt.type == "focusout" || (evt.type == "keydown" && evt.keyCode == 13)) {
      let val = Number($(this).val());
      let min = Number($(this).attr("min"));
      let max = Number($(this).attr("max"));

      if (!Number.isInteger(val) || val < min || val > max) {
        alert(min + " ~ " + max + " 사이 정수만 입력하세요.");
        $(this).val(1);
      }
    }
  });

  // 동작 정지
  $("#stop_frame_bt").on("click", function(){
    socket.emit("stop_frame");
  });

  // 모션 추가
  $("#add_motion_bt").on("click", function () {
    let motionName = $("#motion_name_val").val();
    if (confirm(motionName + " 모션을 등록하시겠습니까?")) {
      socket.emit("add_motion", motionName);
      $("#motion_name_val").val("");
    }
  });

  // 모션 불러오기
  $("#load_motion_bt").on("click", function () {
    let motionName = $("#motion_name_val").val();
    if (confirm(motionName + " 모션을 불러오시겠습니까?")) {
      socket.emit("load_motion", motionName);
      $("#motion_name_val").val("");
    }
  });

  const sample_motions = 
  ['forward1', 'backward1', 'left', 'right', 'wave1', 'dance1', 'welcome', 'foot1', 'happy2', 'sad2'];
  const sample_motions_name = 
  ['forward', 'backward', 'left', 'right', 'wave', 'dance', 'welcome', 'foot', 'happy', 'sad'];

  for (idx in sample_motions) {
    $(`#motion_${sample_motions_name[idx]}_bt`).on("click", function(){
      let i = sample_motions_name.indexOf($(this).text());
      socket.emit("load_motion", sample_motions[i]);
    });
  }

  // 모션 삭제
  $("#delete_motion_bt").on("click", function () {
    let motionName = $("#motion_name_val").val();
    if (confirm(motionName + " 모션을 삭제하시겠습니까?")) {
      socket.emit("delete_motion", motionName);
      $("#motion_name_val").val("");
    }
  });

  // 모션 삭제
  $("#reset_motion_bt").on("click", function () {
    if (confirm("모든 모션을 삭제하시겠습니까?"))
      socket.emit("reset_motion");
  });
};

const getSpeech = (socket) => {
  const max_tts_length = 30;
  $("#s_tts_bt").on("click", function(){
    if($("input[name=s_voice_en]:checked").val() == "off") {
      alert("음성을 활성화해주세요.");
      return;
    }

    let string = $("#s_tts_val").val().trim();
    if( string == "" ) {
      alert("문장을 입력하세요.");
      return;
    }
    if(string.length > max_tts_length) {
      alert(`문장이 너무 깁니다. (${max_tts_length}자 이내로 작성해주세요.)`);
      return;
    }
    socket.emit("tts", {
      text: string,
      voice_type: $("select[name=s_voice_type]").val(),
      volume: Number($("#volume").val()),
    });
  });

  $("#s_tts_val").on('keypress', function (evt) {
    if (evt.keyCode == 13) {
      if($("input[name=s_voice_en]:checked").val() == "off") {
        alert("음성을 활성화해주세요.");
        return;
      }
      let string = $("#s_tts_val").val().trim();
      if( string == "" ) {
        alert("문장을 입력하세요.");
        return;
      }
      if(string.length > max_tts_length) {
        alert(`문장이 너무 깁니다. (${max_tts_length}자 이내로 작성해주세요.)`);
        return;
      }
      socket.emit("tts", {
        text: string,
        voice_type: $("select[name=s_voice_type]").val(),
        volume: Number($("#volume").val()),
      });
    }
  });

  $("#s_upload_csv").on("change", (e) => {
    let formData = new FormData();
    formData.append('data', $("#s_upload_csv")[0].files[0]);
    $.ajax({
      url: `/upload_csv`,
      type:'post',
      data: formData,
      contentType: false,
      processData: false    
    })
    .always((xhr, status) => {
      if (status == "success") {
        alert(`파일 전송이 완료되었습니다.`);
      }
      else {
        alert(`파일 전송 에러입니다.\n >> ${xhr.responseJSON['result']}`);
        $("#s_upload_csv").val("");
      }
    });
  });

  $("#s_reset_csv_bt").on("click", function(){
    socket.emit("reset_csv");
    $("#s_upload_csv").val("");
  });

  $("#s_question_val").on("keyup", function () {
    $(this).val( 
      $(this).val().replace(/[^ㄱ-ㅣ가-힣 | 0-9 |?|.|,|'|"|!]/g, "")
    );
  });

  $("#s_question_val").on('keypress', function (evt) {
    if (evt.keyCode == 13) {
      // enter
      q = $("#s_question_val").val().trim();
      if( q == "" ) {
        alert("문장을 입력하세요.");
        return;
      }

      $("#s_question_val").prop("disabled", true);

      setTimeout(function () {
        $("#s_question_val").val(".");
      }, 200);
      setTimeout(function () {
        $("#s_question_val").val("..");
      }, 400);
      setTimeout(function () {
        $("#s_question_val").val("...");
      }, 600);

      setTimeout(function () {
        socket.emit("question", {
          question: q,
          voice_en: $("input[name=s_voice_en]:checked").val(),
          voice_type: $("select[name=s_voice_type]").val(),
          volume: Number($("#volume").val()),
        });
        $("#s_question_val").prop("disabled", false);
        $("#s_question_val").val(q);
      }, 800);
    }
  });

  $("#s_chat_bt").on("click", function(){
    q = $("#s_question_val").val().trim();

    if(q == "" ) {
      alert("문장을 입력하세요.");
      return;
    }

    $("#s_question_val").prop("disabled", true);
    setTimeout(function () {
      $("#s_question_val").val(".");
    }, 200);
    setTimeout(function () {
      $("#s_question_val").val("..");
    }, 400);
    setTimeout(function () {
      $("#s_question_val").val("...");
    }, 600);

    setTimeout(function () {
      socket.emit("question", {
        question: q,
        voice_en: $("input[name=s_voice_en]:checked").val(),
        voice_type: $("select[name=s_voice_type]").val(),
        volume: Number($("#volume").val()),
      });
      $("#s_question_val").prop("disabled", false);
      $("#s_question_val").val(q);
    }, 800);
  });

  socket.on("disp_speech", function (data) {
    if ("answer" in data) {
      $("#s_answer_val").val(data["answer"]);
    }

    if ("chat_list" in data) {
      $("#s_record_tb > tbody").empty();
      rec = data["chat_list"];

      for (idx in rec) {
        if (rec[idx].length == 0) continue;

        $("#s_record_tb").append(
          $("<tr>").append(
            $("<td>").append(rec[idx][0]),
            $("<td>").append(rec[idx][1]),
            $("<td>").append(rec[idx][2])
          )
        );
      } 
    }
  });
};

let checkOled = (x, y, size) => {
  let tx = "#d_ox_val";
  let ty = "#d_oy_val";
  let tsize = "#d_osize_val";

  if (isNaN(x)    || x < Number($(tx).attr("min")) || x > Number($(tx).attr("max")))
    return false;
  if (isNaN(y)    || y < Number($(ty).attr("min")) || y > Number($(ty).attr("max")))
    return false;
  if (isNaN(size) || size < Number($(tsize).attr("min")) || size > Number($(tsize).attr("max")))
    return false;
  return true;
}

const getDevices = (socket) => {
  socket.on("update_neopixel", function (data) {
    for (let i = 0; i < 6; i++) $("#d_n" + i + "_val").val(data[i]);
  });

  socket.on("update_battery", function (data) {
    let bat = Number(data.split('%')[0]);
    $("#d_battery_val").html("<i class='fa fa-battery-" + Math.floor(bat/25)+ "' aria-hidden='true'></i> " + data);
  });

  socket.on("update_device", function (data) {
    $("#d_pir_val").text(data[0].toLowerCase());
    $("#d_touch_val").text(data[1].toLowerCase());
    $("#d_dc_val").html(
      data[2].toUpperCase() == "ON" ? "<i class='fa fa-plug' aria-hidden='true'></i>" : ""
    );
    $("#d_button_val").text(data[3].toLowerCase());
  });

  for (let i = 0; i < 6; i++) {
    let tneopixel = "#d_n" + i + "_val";

    $(tneopixel).on("focusout keydown", function (evt) {
      if (evt.type == "focusout" || (evt.type == "keydown" && evt.keyCode == 13)) {
        let val = Number($(this).val());
        let min = Number($(this).attr("min"));
        let max = Number($(this).attr("max"));

        if (isNaN(val) || val < min || val > max) {
          alert(min + " ~ " + max + " 사이를 입력하세요.");
        }
        else {
          socket.emit("set_neopixel", { idx: i, value: val });
        }
      }
    });

    $(tneopixel).on("click", function (evt) {
      socket.emit("set_neopixel", { idx: i, value: $(this).val() });
    });
  }

  $("#eye_save_bt").on("click", function (evt) {
    let eyeval = "";

    for (let i = 0; i < 6; i++) {
      let tneopixel = "#d_n" + i + "_val";
      let val = Number($(tneopixel).val());
      let min = Number($(tneopixel).attr("min"));
      let max = Number($(tneopixel).attr("max"));

      if (isNaN(val) || val < min || val > max) {
        alert(min + " ~ " + max + " 사이를 입력하세요.");
        return;
      }
      eyeval = (i == 5)? eyeval+val : eyeval+val+",";
    }

    if (confirm("눈 색상을 저장하시겠습니까?")) {
      socket.emit("eye_update", eyeval);
    }
  });

  $("#d_otext_val").on('keydown', function (evt) {
    if (evt.type == "keydown" && evt.keyCode == 13) {
      // enter
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (checkOled(x, y, size))
        socket.emit("set_oled", {x: x, y: y, size: size, text: text});
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#d_ox_val").on("click keydown", function (evt) {
    if (evt.type == "click" ||
      (evt.type == "keydown" && evt.keyCode == 13)) {
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (text == '') return;

      if (checkOled(x, y, size))
        socket.emit("set_oled", {x: x, y: y, size: size, text: text});
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#d_oy_val").on("click keydown", function (evt) {
    if (evt.type == "click" ||
      (evt.type == "keydown" && evt.keyCode == 13)) {
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (text == '') return;

      if (checkOled(x, y, size))
        socket.emit("set_oled", {x: x, y: y, size: size, text: text});
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#d_osize_val").on("click keydown", function (evt) {
    if (evt.type == "click" ||
      (evt.type == "keydown" && evt.keyCode == 13)) {
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (text == '') return;

      if (checkOled(x, y, size))
        socket.emit("set_oled", {x: x, y: y, size: size, text: text});
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#oled_bt").on("click", function(evt){
    let text = $("#d_otext_val").val().trim();
    let x = Number($("#d_ox_val").val());
    let y = Number($("#d_oy_val").val());
    let size = Number($("#d_osize_val").val());

    if (text == '') return;

    if (checkOled(x, y, size))
      socket.emit("set_oled", {x: x, y: y, size: size, text: text});
    else
      alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
  });

  $("#upload_oled").on("change", (e) => {
    let formData = new FormData();
    formData.append('data', $("#upload_oled")[0].files[0]);
    $.ajax({
      url: `/upload_oled`,
      type:'post',
      data: formData,
      contentType: false,
      processData: false    
    })
    .always((xhr, status) => {
      if (status == "success") {
        alert(`파일 전송이 완료되었습니다.`);
      }
      else {
        alert(`파일 전송 에러입니다.\n >> ${xhr.responseJSON['result']}`);
        $("#upload_oled").val("");
      }
    });
  });

  $("#clear_oled_bt").on("click", function(){
    socket.emit("clear_oled");
  });

  socket.on("oled_path", (data) => {

    $("#oledfiles").empty();
    $("#oledfiles").append("<option value='-'>선택</option>");
    for (let i =0; i < data.length; i++){
      let filename = data[i];
      let extension = filename.split(".")[1].toLowerCase();

      if (["png","jpg"].includes(extension))
        $('#oledfiles').append(`<option value="${filename}">${filename.split(".jpg")[0]}</option>`);
    }
  });
  
  $("#oledpath").on("change", ()=> {
    let p = $("#oledpath").val();
    if (p != '-') {
      socket.emit("oled_path", p);
    }
  });

  $("#oledfiles").on("change", ()=> {
    let filename = $("#oledfiles").val();

    if (filename != '-') {
      socket.emit("set_oled_image", `${$("#oledpath").val()}/${filename}`);
    }
  });

  socket.on("mic", function (d) {
    $('#mic_status').text(d);
  });

  $("#mic_bt").on("click", function () {
    let tmictime = "#mic_time_val";
    let val = Number($(tmictime).val());
    let min = Number($(tmictime).attr("min"));
    let max = Number($(tmictime).attr("max"));

    if (isNaN(val) || val < min || val > max) {
      alert("입력 값이 잘못되었습니다.\n녹음시간: 1 ~ 30초");
      return;
    }

    $('#mic_status').text("녹음 중");
    socket.emit("mic", {
      time: val,
      volume: Number($("#volume").val()),
    });
  });

  $("#mic_replay_bt").on("click", function(){
    socket.emit("mic_replay", {volume:Number($("#volume").val())});
  });

  socket.on("audio_path", (data) => {
    $("#audiofiles").empty();
    $("#audiofiles").append("<option value='-'>선택</option>");
    for (let i =0; i < data.length; i++){
      let filename = data[i];
      let extension = filename.split(".")[1];

      if (["mp3", "wav"].includes(extension))
        $('#audiofiles').append(`<option value="${filename}">${filename.split(".")[0]}</option>`);
    }
  });

  $("#audiopath").on("change", ()=> {
    let p = $("#audiopath").val();

    if (p != '-') {
      socket.emit("audio_path", p);
    }
  });

  $("#play_audio_bt").on("click", function(){
    let filename = $("#audiofiles").val();

    if (filename == "-") {
      alert("음악을 선택하세요.");
      return;
    }
    socket.emit("play_audio", {
      filename:`${$("#audiopath").val()}/${filename}`,
      volume:Number($("#volume").val()),
    });
  });

  $("#stop_audio_bt").on("click", function(){
    socket.emit("stop_audio");
  });
};

const getSimulations = (socket) => {
  socket.on('sim_result', (d) => {
    console.log(d);
  });

  socket.on('sim_update_audio', (d) => {
    console.log(d);
  });

  socket.on('sim_update_oled', (d) => {
    console.log(d);
  });

  socket.on('sim_update_motion', (d) => {
    console.log(d);
  });

  socket.on('sim_load_items', (d) => {
    console.log('sim_load_items:', d);
  });

  socket.emit('sim_update_audio', "/home/pi/openpibo-files/audio/music");
  socket.emit('sim_update_oled', "/home/pi/openpibo-files/icon");
  socket.emit('sim_update_motion', 'default');
  socket.emit('sim_update_motion', 'mymotion');
  socket.emit('sim_add_items',
              {
                name:'test1',
                data:
                  [
                    {
                        'time':1,
                        'motion':{'name':'foot1', 'cycle':10},
                        'eye':[255,0,0,0,0,255],
                        'oled':(/*{'imagef':'/home/pi/openpibo-files/icon/bot.png'} | */{'x':0, 'y':20, 'size':25, 'text':'파이보'}),
                        'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50},
                        'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
                    },
                    {
                        'time':2.5,
                        'motion':{'name':'foot1', 'cycle':10},
                        'eye':[255,0,0,0,0,255],
                        'oled':(/*{'imagef':'/home/pi/openpibo-files/icon/bot.png'} | */{'x':0, 'y':20, 'size':25, 'text':'파이보'}),
                        'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50},
                        'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
                    },
                    {
                        'time':3,
                        'motion':{'name':'foot1', 'cycle':10},
                        'eye':[255,0,0,0,0,255],
                        'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'}/* | {'x':0, 'y':20, 'size':25, 'text':'파이보'}*/),
                        'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50},
                        'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
                    }
                    ]
              }
    );

  socket.emit('sim_add_items', 
              {
                name:'test2',
                data:
                  [
                    {
                        'time':10,
                        'motion':{'name':'foot1', 'cycle':10},
                        'eye':[255,0,0,0,0,255],
                        'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'}/* | {'x':0, 'y':20, 'size':25, 'text':'파이보'}*/),
                        'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50},
                        'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
                    },
                    {
                        'time':25,
                        'motion':{'name':'foot1', 'cycle':10},
                        'eye':[255,0,0,0,0,255],
                        'oled':({'imagef':'/home/pi/openpibo-files/icon/bot.png'}/* | {'x':0, 'y':20, 'size':25, 'text':'파이보'}*/),
                        'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50},
                        'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
                    },
                    {
                        'time':30,
                        'motion':{'name':'foot1', 'cycle':10},
                        'eye':[255,0,0,0,0,255],
                        'oled':(/*{'imagef':'/home/pi/openpibo-files/icon/bot.png'} | */{'x':0, 'y':20, 'size':25, 'text':'파이보'}),
                        'audio':{'audiof':"/home/pi/openpibo-files/audio/test.mp3", 'volume':50},
                        'tts':{'voice_type':'main', 'text':'안녕하세요', 'volume':50}
                    }
                    ]
              }
    );
  socket.emit('sim_load_items'); // 이름만
  //socket.emit('sim_remove_items', 'test1');
  socket.emit('sim_remove_items'); // 전체 삭제
  socket.emit('sim_load_items'); // 이름만
  socket.emit('sim_load_items', 'test2');
}

$(function () {
  const socket = io('ws://' + window.location.hostname+':80',{path:'/ws/socket.io'});

  getStatus(socket);
  getVisions(socket);
  getMotions(socket);
  getSpeech(socket);
  getDevices(socket);
  //getSimulations(socket);

  const handleMenu = (name) => {
    if (name === "home") {
      socket.emit("eye_update");
      socket.emit("wifi");
    } else if (name === "speech") {
      $("#s_question_val").val("");
      $("#s_answer_val").val("");
      socket.emit("disp_speech");
    } else if (name === "device") {
      $("#d_otext_val").val("");
    } else if (name === "vision") {
      socket.emit("disp_vision");
    } else if (name === "motion") {
      socket.emit("disp_motion");
    }

    $("h4#content_header").text(name.toUpperCase());
    $("nav").find("button").removeClass("menu-selected");
    $(`button[name=${name}]`).addClass("menu-selected");
    $("article").not(`#article_${name}`).hide("slide");
    $(`#article_${name}`).show("slide");
  };

  handleMenu("home");
  const menus = $("nav").find("button");
  menus.each((idx) => {
    const element = menus.get(idx);
    const name = element.getAttribute("name");
    element.addEventListener("click", () => handleMenu(name));
  });
});
