const getStatus = (socket) => {
  $("#devtool_bt").on("click", function () {
    if (confirm("IDE로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)")) {
      socket.emit("onoff", "off");
      $(location).attr("href", "http://" + window.location.hostname + ":50000");
    }
  });
  $("#devtool_bt").hover(
    function () {
      $(this).animate({ opacity: "0.7" }, 100);
      $(this).css("cursor", "pointer");
    },
    function () {
      $(this).animate({ opacity: "1" }, 100);
      $(this).css("cursor", "default");
    }
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
      d == "on"
        ? "<i class='fa-solid fa-person-running'></i>"
        : "<i class='fa-solid fa-person'></i>"
    );
  });

  $("input:checkbox[name=onoff_sel]").change(function () {
    let sel = $("input:checkbox[name=onoff_sel]").is(":checked") ? "on" : "off";
    $("input:checkbox[name=onoff_sel]").prop("disabled", true);
    socket.emit("onoff", sel);
  });

  $("#volume").val(
    window.localStorage.getItem("volume")
      ? window.localStorage.getItem("volume")
      : 80
  );

  $("#volume").on("change", () => {
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
      socket.emit("wifi", {
        ssid: $("#ssid").val(),
        psk: $("#password").val(),
      });
    }
  });

  socket.on("eye_update", function (data) {
    $("#eye").val(data);
  });

  $("#poweroff_bt").on("click", function () {
    if (confirm("정말 종료하시겠습니까?")) socket.emit("poweroff");
  });

  $("#restart_bt").on("click", function () {
    if (confirm("재시작하시겠습니까?")) socket.emit("restart");
  });

  $("#swupdate_bt").on("click", function () {
    if (confirm("업데이트를 하시겠습니까?(불안정-문제가 발생할 수 있습니다.)"))
      socket.emit("swupdate");
  });
};

const getVisions = (socket) => {
  socket.on("disp_vision", function (data) {
    $(`input[name=v_func_type][value=${data}]`).prop("checked", true);
  });

  socket.on("stream", function (data) {
    $("#v_img").attr(
      "src",
      "data:image/jpeg;charset=utf-8;base64," + data["img"]
    );
    $("#v_result").text(data["data"]);
  });

  $("input[name=v_func_type]").on("change", function () {
    let sel = $("input[name=v_func_type]:checked").val();
    socket.emit("detect", sel);
  });

  $("#v_capture").on("click", function () {
    let capture_a = document.createElement("a");
    capture_a.setAttribute("href", "/download_img");
    capture_a.click();
  });

  $("#v_upload_tm").on("change", (e) => {
    let formData = new FormData();
    formData.append("data", $("#v_upload_tm")[0].files[0]);
    $.ajax({
      url: `/upload_tm`,
      type: "post",
      data: formData,
      contentType: false,
      processData: false,
    }).always((xhr, status) => {
      if (status == "success") {
        alert(`파일 전송이 완료되었습니다.`);
      } else {
        alert(`파일 전송 에러입니다.\n >> ${xhr.responseJSON["result"]}`);
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
      if (
        evt.type == "focusout" ||
        (evt.type == "keydown" && evt.keyCode == 13)
      ) {
        let pos = Number($(this).val());
        let min = Number($(this).attr("min"));
        let max = Number($(this).attr("max"));

        if (isNaN(pos) || pos < min || pos > max) {
          $(this).val($(trange).val());
          alert(min + " ~ " + max + " 사이를 입력하세요.");
        } else {
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
    if (
      evt.type == "focusout" ||
      (evt.type == "keydown" && evt.keyCode == 13)
    ) {
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
    socket.emit("add_frame", $("#m_time_val").val() * 1000);
  });

  socket.on("disp_motion", function (datas) {
    // 모터 값 로드
    if ("pos" in datas) {
      let data = datas["pos"];
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
      for (name in datas["record"]) {
        res.push(name);
      }

      $("#motor_record").text(res.join(", "));
    }

    // 테이블 로드
    if ("table" in datas) {
      let data = datas["table"];

      for (let i = 0; i < data.length; i++) {
        if (i != 0)
          for (let j = 0; j < 10; j++) {
            data[i].d[j] =
              data[i].d[j] == 999 ? data[i - 1].d[j] : data[i].d[j];
          }
      }

      $("#motor_table > tbody").empty();
      for (let i = 0; i < data.length; i++) {
        $("#motor_table > tbody").append(
          $("<tr>")
            .append(
              $("<td>").append(data[i].seq / 1000 + " 초"),
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
              let pos_lst = [];
              let lst = $(this).children();
              lst.each((idx) => {
                if (idx == 0) {
                  $("#m_time_val").val(
                    Number(lst.eq(idx).text().split(" 초")[0])
                  );
                  return;
                } else {
                  let val = Number(lst.eq(idx).text());
                  $("#m" + (idx - 1) + "_value").val(val);
                  $("#m" + (idx - 1) + "_range").val(val);
                  pos_lst[idx - 1] = val;
                }
              });

              socket.emit("set_motors", { pos_lst: pos_lst });
            })
            .dblclick(function () {
              let t = $(this).text().split(" 초")[0];
              if (confirm(t + " 초 항목을 삭제하시겠습니까?")) {
                socket.emit("delete_frame", Number(t) * 1000);
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
    if (
      evt.type == "focusout" ||
      (evt.type == "keydown" && evt.keyCode == 13)
    ) {
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
  $("#stop_frame_bt").on("click", function () {
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

  const sample_motions = [
    "forward1",
    "backward1",
    "left",
    "right",
    "wave1",
    "dance1",
    "welcome",
    "foot1",
    "happy2",
    "sad2",
  ];
  const sample_motions_name = [
    "forward",
    "backward",
    "left",
    "right",
    "wave",
    "dance",
    "welcome",
    "foot",
    "happy",
    "sad",
  ];

  for (idx in sample_motions) {
    $(`#motion_${sample_motions_name[idx]}_bt`).on("click", function () {
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
    if (confirm("모든 모션을 삭제하시겠습니까?")) socket.emit("reset_motion");
  });
};

const getSpeech = (socket) => {
  const max_tts_length = 30;
  $("#s_tts_bt").on("click", function () {
    if ($("input[name=s_voice_en]:checked").val() == "off") {
      alert("음성을 활성화해주세요.");
      return;
    }

    let string = $("#s_tts_val").val().trim();
    if (string == "") {
      alert("문장을 입력하세요.");
      return;
    }
    if (string.length > max_tts_length) {
      alert(`문장이 너무 깁니다. (${max_tts_length}자 이내로 작성해주세요.)`);
      return;
    }
    socket.emit("tts", {
      text: string,
      voice_type: $("select[name=s_voice_type]").val(),
      volume: Number($("#volume").val()),
    });
  });

  $("#s_tts_val").on("keypress", function (evt) {
    if (evt.keyCode == 13) {
      if ($("input[name=s_voice_en]:checked").val() == "off") {
        alert("음성을 활성화해주세요.");
        return;
      }
      let string = $("#s_tts_val").val().trim();
      if (string == "") {
        alert("문장을 입력하세요.");
        return;
      }
      if (string.length > max_tts_length) {
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
    formData.append("data", $("#s_upload_csv")[0].files[0]);
    $.ajax({
      url: `/upload_csv`,
      type: "post",
      data: formData,
      contentType: false,
      processData: false,
    }).always((xhr, status) => {
      if (status == "success") {
        alert(`파일 전송이 완료되었습니다.`);
      } else {
        alert(`파일 전송 에러입니다.\n >> ${xhr.responseJSON["result"]}`);
        $("#s_upload_csv").val("");
      }
    });
  });

  $("#s_reset_csv_bt").on("click", function () {
    socket.emit("reset_csv");
    $("#s_upload_csv").val("");
  });

  $("#s_question_val").on("keyup", function () {
    $(this).val(
      $(this)
        .val()
        .replace(/[^ㄱ-ㅣ가-힣 | 0-9 |?|.|,|'|"|!]/g, "")
    );
  });

  $("#s_question_val").on("keypress", function (evt) {
    if (evt.keyCode == 13) {
      // enter
      q = $("#s_question_val").val().trim();
      if (q == "") {
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

  $("#s_chat_bt").on("click", function () {
    q = $("#s_question_val").val().trim();

    if (q == "") {
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

  if (
    isNaN(x) ||
    x < Number($(tx).attr("min")) ||
    x > Number($(tx).attr("max"))
  )
    return false;
  if (
    isNaN(y) ||
    y < Number($(ty).attr("min")) ||
    y > Number($(ty).attr("max"))
  )
    return false;
  if (
    isNaN(size) ||
    size < Number($(tsize).attr("min")) ||
    size > Number($(tsize).attr("max"))
  )
    return false;
  return true;
};

const getDevices = (socket) => {
  socket.on("update_neopixel", function (data) {
    for (let i = 0; i < 6; i++) $("#d_n" + i + "_val").val(data[i]);
  });

  socket.on("update_battery", function (data) {
    let bat = Number(data.split("%")[0]);
    $("#d_battery_val").html(
      "<i class='fa fa-battery-" +
        Math.floor(bat / 25) +
        "' aria-hidden='true'></i> " +
        data
    );
  });

  socket.on("update_device", function (data) {
    $("#d_pir_val").text(data[0].toLowerCase());
    $("#d_touch_val").text(data[1].toLowerCase());
    $("#d_dc_val").html(
      data[2].toUpperCase() == "ON"
        ? "<i class='fa fa-plug' aria-hidden='true'></i>"
        : ""
    );
    $("#d_button_val").text(data[3].toLowerCase());
  });

  for (let i = 0; i < 6; i++) {
    let tneopixel = "#d_n" + i + "_val";

    $(tneopixel).on("focusout keydown", function (evt) {
      if (
        evt.type == "focusout" ||
        (evt.type == "keydown" && evt.keyCode == 13)
      ) {
        let val = Number($(this).val());
        let min = Number($(this).attr("min"));
        let max = Number($(this).attr("max"));

        if (isNaN(val) || val < min || val > max) {
          alert(min + " ~ " + max + " 사이를 입력하세요.");
        } else {
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
      eyeval = i == 5 ? eyeval + val : eyeval + val + ",";
    }

    if (confirm("눈 색상을 저장하시겠습니까?")) {
      socket.emit("eye_update", eyeval);
    }
  });

  $("#d_otext_val").on("keydown", function (evt) {
    if (evt.type == "keydown" && evt.keyCode == 13) {
      // enter
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (checkOled(x, y, size))
        socket.emit("set_oled", { x: x, y: y, size: size, text: text });
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#d_ox_val").on("click keydown", function (evt) {
    if (evt.type == "click" || (evt.type == "keydown" && evt.keyCode == 13)) {
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (text == "") return;

      if (checkOled(x, y, size))
        socket.emit("set_oled", { x: x, y: y, size: size, text: text });
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#d_oy_val").on("click keydown", function (evt) {
    if (evt.type == "click" || (evt.type == "keydown" && evt.keyCode == 13)) {
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (text == "") return;

      if (checkOled(x, y, size))
        socket.emit("set_oled", { x: x, y: y, size: size, text: text });
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#d_osize_val").on("click keydown", function (evt) {
    if (evt.type == "click" || (evt.type == "keydown" && evt.keyCode == 13)) {
      let text = $("#d_otext_val").val().trim();
      let x = Number($("#d_ox_val").val());
      let y = Number($("#d_oy_val").val());
      let size = Number($("#d_osize_val").val());

      if (text == "") return;

      if (checkOled(x, y, size))
        socket.emit("set_oled", { x: x, y: y, size: size, text: text });
      else
        alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
    }
  });

  $("#oled_bt").on("click", function (evt) {
    let text = $("#d_otext_val").val().trim();
    let x = Number($("#d_ox_val").val());
    let y = Number($("#d_oy_val").val());
    let size = Number($("#d_osize_val").val());

    if (text == "") return;

    if (checkOled(x, y, size))
      socket.emit("set_oled", { x: x, y: y, size: size, text: text });
    else
      alert("입력 값이 잘못되었습니다.\nX: 0 ~ 128\nY: 0 ~ 64\nSize: 1 ~ 50");
  });

  $("#upload_oled").on("change", (e) => {
    let formData = new FormData();
    formData.append("data", $("#upload_oled")[0].files[0]);
    $.ajax({
      url: `/upload_oled`,
      type: "post",
      data: formData,
      contentType: false,
      processData: false,
    }).always((xhr, status) => {
      if (status == "success") {
        alert(`파일 전송이 완료되었습니다.`);
      } else {
        alert(`파일 전송 에러입니다.\n >> ${xhr.responseJSON["result"]}`);
        $("#upload_oled").val("");
      }
    });
  });

  $("#clear_oled_bt").on("click", function () {
    socket.emit("clear_oled");
  });

  socket.on("oled_path", (data) => {
    $("#oledfiles").empty();
    $("#oledfiles").append("<option value='-'>선택</option>");
    for (let i = 0; i < data.length; i++) {
      let filename = data[i];
      let extension = filename.split(".")[1].toLowerCase();

      if (["png", "jpg"].includes(extension))
        $("#oledfiles").append(
          `<option value="${filename}">${filename.split(".jpg")[0]}</option>`
        );
    }
  });

  $("#oledpath").on("change", () => {
    let p = $("#oledpath").val();
    if (p != "-") {
      socket.emit("oled_path", p);
    }
  });

  $("#oledfiles").on("change", () => {
    let filename = $("#oledfiles").val();

    if (filename != "-") {
      socket.emit("set_oled_image", `${$("#oledpath").val()}/${filename}`);
    }
  });

  socket.on("mic", function (d) {
    $("#mic_status").text(d);
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

    $("#mic_status").text("녹음 중");
    socket.emit("mic", {
      time: val,
      volume: Number($("#volume").val()),
    });
  });

  $("#mic_replay_bt").on("click", function () {
    socket.emit("mic_replay", { volume: Number($("#volume").val()) });
  });

  socket.on("audio_path", (data) => {
    $("#audiofiles").empty();
    $("#audiofiles").append("<option value='-'>선택</option>");
    for (let i = 0; i < data.length; i++) {
      let filename = data[i];
      let extension = filename.split(".")[1];

      if (["mp3", "wav"].includes(extension))
        $("#audiofiles").append(
          `<option value="${filename}">${filename.split(".")[0]}</option>`
        );
    }
  });

  $("#audiopath").on("change", () => {
    let p = $("#audiopath").val();

    if (p != "-") {
      socket.emit("audio_path", p);
    }
  });

  $("#play_audio_bt").on("click", function () {
    let filename = $("#audiofiles").val();

    if (filename == "-") {
      alert("음악을 선택하세요.");
      return;
    }
    socket.emit("play_audio", {
      filename: `${$("#audiopath").val()}/${filename}`,
      volume: Number($("#volume").val()),
    });
  });

  $("#stop_audio_bt").on("click", function () {
    socket.emit("stop_audio");
  });
};

const getSimulations = (socket) => {
  /* 함수 호출: 부분에 socket 이용한 코드 삽입 */
  let selectFile = null;
  let selectFileContents = [];
  $("#sequence_title").hide();
  $("#config_contents").hide();
  $("#timeline_play_bt").hide();
  $("#timeline_card").hide();
  $("#timeline_bottom_wrap").hide();
  $("section.timeline").css("align-self", "baseline");
  $("#sequence_contents").show("slide");

  /* socket.on("sim_result", (d) => {console.log(d)});
  socket.on("sim_update_audio", (d) => {console.log(d)});
  socket.on("sim_update_oled", (d) => {console.log(d)});
  socket.on("sim_update_motion", (d) => {console.log(d)});
  socket.on("sim_load_items", (d) => {console.log("sim_load_items:", d)});
  socket.emit("sim_update_audio", "/home/pi/openpibo-files/audio/music");
  socket.emit("sim_update_oled", "/home/pi/openpibo-files/icon");
  socket.emit("sim_update_motion", "default");
  socket.emit("sim_update_motion", "mymotion");
  socket.emit("sim_add_items", {
    name: "test1",
    data: [
      {
        time: 1,
        motion: { name: "foot1", cycle: 10 },
        eye: [255, 0, 0, 0, 0, 255],
        oled: {
          x: 0,
          y: 20,
          size: 25,
          text: "파이보",
        },
        audio: { audiof: "/home/pi/openpibo-files/audio/test.mp3", volume: 50 },
        tts: { voice_type: "main", text: "안녕하세요", volume: 50 },
      },
      {
        time: 2.5,
        motion: { name: "foot1", cycle: 10 },
        eye: [255, 0, 0, 0, 0, 255],
        oled: {'imagef':'/home/pi/openpibo-files/icon/bot.png'},
        audio: { audiof: "/home/pi/openpibo-files/audio/test.mp3", volume: 50 },
        tts: { voice_type: "main", text: "안녕하세요", volume: 50 },
      },
      {
        time: 3,
        motion: { name: "foot1", cycle: 10 },
        eye: [255, 0, 0, 0, 0, 255],
        oled: {
          imagef: "/home/pi/openpibo-files/icon/bot.png",
        },
        audio: { audiof: "/home/pi/openpibo-files/audio/test.mp3", volume: 50 },
        tts: { voice_type: "main", text: "안녕하세요", volume: 50 },
      },
    ],
  });
  socket.emit("sim_add_items", {
    name: "test2",
    data: [
      {
        time: 10,
        motion: { name: "foot1", cycle: 10 },
        eye: [255, 0, 0, 0, 0, 255],
        oled: {
          imagef: "/home/pi/openpibo-files/icon/bot.png",
        },
        audio: { audiof: "/home/pi/openpibo-files/audio/test.mp3", volume: 50 },
        tts: { voice_type: "main", text: "안녕하세요", volume: 50 },
      },
      {
        time: 25,
        motion: { name: "foot1", cycle: 10 },
        eye: [255, 0, 0, 0, 0, 255],
        oled: {
          imagef: "/home/pi/openpibo-files/icon/bot.png",
        },
        audio: { audiof: "/home/pi/openpibo-files/audio/test.mp3", volume: 50 },
        tts: { voice_type: "main", text: "안녕하세요", volume: 50 },
      },
      {
        time: 30,
        motion: { name: "foot1", cycle: 10 },
        eye: [255, 0, 0, 0, 0, 255],
        oled: {
          x: 0,
          y: 20,
          size: 25,
          text: "파이보",
        },
        audio: { audiof: "/home/pi/openpibo-files/audio/test.mp3", volume: 50 },
        tts: { voice_type: "main", text: "안녕하세요", volume: 50 },
      },
    ],
  });
  socket.emit("sim_load_items"); // 이름만
  socket.emit("sim_remove_items"); // 전체 삭제
  socket.emit("sim_load_items"); // 이름만
  socket.emit("sim_load_items", "test2"); */

  const simSocket = (name, params, cb) => {
    // play 되는 socket 함수들 cb으로 실행완료 후 동작 넘기도록?
    const tempSocket = {
      sim_play_item: (data) => {
        console.log("CONFIGURATION PLAY", data);
      },
      sim_stop_item: (data) => {
        console.log("CONFIGURATION STOP", data);
      },
      sim_update_audio: (type, cb) => {
        console.log("REQUEST AUDIO FILE LIST", type, cb);
        if (type !== "myaudio") {
          return cb([
            `${type}test.mp3`,
            `${type}aaa.mp3`,
            `${type}bbb.mp3`,
            `${type}ccc.wav`,
            `${type}ddd.wav`,
          ]);
        } else {
          return cb([
            `/home/pi/${type}/test.mp3`,
            `/home/pi/${type}/aaa.mp3`,
            `/home/pi/${type}/bbb.mp3`,
            `/home/pi/${type}/ccc.wav`,
            `/home/pi/${type}/ddd.wav`,
          ]);
        }
      },
      sim_update_oled: (type, cb) => {
        console.log("REQUEST OLED FILE LIST", cb);
        if (cb) {
          return cb([
            "smile.jpg",
            "angry.jpg",
            "sad.jpg",
            "angry.jpg",
            "bot.png",
          ]);
        }
      },
      sim_update_motion: (type, cb) => {
        console.log("REQUEST MOTION FILE LIST", type, cb);
        if (type === "default") {
          return cb(["dance", "hi", "bye", "sleep", "foot1"]);
        } else if (type === "mymotion") {
          return cb(["kakao", "figma", "teams", "postman"]);
        }
      },
      sim_play_items: (data) => {
        console.log("PLAY TIMELINE ITEMS", data);
      },
      sim_stop_items: () => {
        console.log("STOP TIMELINE ITEMS");
      },
      sim_add_items: ({ name, data }) => {
        console.log("SAVE SEQUENCE", name, data);
        const simList = JSON.parse(localStorage.getItem("sim_list")) || [];
        const newSimList = simList.filter((item) => item.name !== name);
        newSimList.unshift({ name, data });
        localStorage.setItem("sim_list", JSON.stringify(newSimList));
      },
      sim_remove_items: (name) => {
        console.log("DELETE SEQUENCE", name);
        const simList = JSON.parse(localStorage.getItem("sim_list"));
        if (simList) {
          if (name) {
            localStorage.setItem(
              "sim_list",
              JSON.stringify(simList.filter((item) => item.name !== name))
            );
          } else {
            localStorage.setItem("sim_list", "[]");
          }
        }
      },
      sim_load_items: (name, cb) => {
        console.log("LOAD SEQUENCE", name);
        const simList = JSON.parse(localStorage.getItem("sim_list"));
        if (!name) {
          return cb(simList ? simList.map((item) => item.name) : []);
        }
        const item = simList.filter((item) => item.name === name);
        if (item.length) {
          return cb(item[0]);
        }
        alert(`${name} 파일을 불러올 수 없습니다.`);
      },
    };
    const result = cb ? tempSocket[name](params, cb) : tempSocket[name](params);
    return result;
  };

  // 시퀀스 파일 영역(section.new-and-list) 초기화
  const onFileList = () => {
    $("#sequence_list").empty();
    simSocket("sim_load_items", null, (fileList) => {
      if (fileList.length) {
        // 시퀀스 파일 목록이 있으면 목록을 그려줌
        $("#no_sequence_warn").addClass("hide");
        $("#sequence_list").removeClass("hide");
        const listItem = fileList.map((name, i) => {
          let btnGroup = $("<div></div>");
          btnGroup.addClass("horizontal");
          btnGroup.css("gap", "0.5em");
          btnGroup.css("flex-grow", 0);
          let openBtn = $(`<button name="open_file_${i}">불러오기</button>`);
          let removeBtn = $(`<button name="remove_file_${i}">지우기</button>`);
          removeBtn.addClass("btn-red");
          openBtn.on("click", (e) => {
            openSequence(name);
          });
          removeBtn.on("click", (e) => {
            const index = e.target.name.split("_")[2];
            simSocket("sim_remove_items", fileList[index]);
            if (fileList[index] === selectFile) {
              openSequence(null);
            }
            onFileList();
          });
          btnGroup.append(openBtn);
          btnGroup.append(removeBtn);
          let li = $(`<li name="file_${i}"></li>`);
          li.addClass("horizontal space-between");
          li.append(`<p>${name}</p>`);
          li.append(btnGroup);
          return li;
        });
        $("#sequence_list").append(...listItem);
      } else {
        $("#sequence_list").addClass("hide");
        $("#no_sequence_warn").removeClass("hide");
      }
    });
  };
  // 시퀀스 파일 관리 접기/펼치기
  const foldSimulatorFile = (v) => {
    if (v) {
      $("#sequence_title_fold_bt").hide();
      $("#sequence_title_unfold_bt").show();
      $("#sequence_contents").hide();
      $("#config_contents").show("blind");
      $("#timeline_play_bt").show();
      $("#timeline_card").show();
      $("#timeline_bottom_wrap").show();
      $("section.timeline").css("align-self", "unset");
      $("#sequence_title").show("fade");
    } else {
      if (!selectFile) {
        $("#sequence_title").hide();
      }
      $("#config_contents").hide();
      $("#timeline_play_bt").hide();
      $("#timeline_card").hide();
      $("#timeline_bottom_wrap").hide();
      $("section.timeline").css("align-self", "baseline");
      $("#sequence_contents").show("shake");
      $("#sequence_title_fold_bt").show();
      $("#sequence_title_unfold_bt").hide();
    }
  };
  // 시퀀스 불러오기
  const openSequence = (v) => {
    if (v) {
      $("#sequence_warn").hide();
    } else {
      $("#sequence_warn").show();
    }
    $("h3[name=sequence_title]").text(v);
    $("#sequence_name_val").val("");
    simSocket("sim_load_items", v, ({ name, data }) => {
      selectFile = name;
      selectFileContents = data;
      foldSimulatorFile(name);
      setConfigSection(
        selectFileContents.length ? selectFileContents[0] : null
      );
      setTimelineSection(selectFileContents);
    });
  };

  $("#sequence_name_val").on("keyup", (e) => {
    $(e.target).val(e.target.value.replace(/[^\da-zA-Z]/g, ""));
  });

  // 새 시퀀스 만들기 이벤트
  $("#add_sequence_bt").on("click", function () {
    // 입력받은 제목 값 상단 타이틀에 써주기
    const title = $("#sequence_name_val").val();
    const fileList = Array.from($("#sequence_list li p")).map((el) =>
      $(el).text()
    );
    if (title) {
      if (fileList.indexOf(title) < 0) {
        simSocket("sim_add_items", { name: title, data: [] });
        onFileList();
        openSequence(title);
      } else {
        alert("이미 존재하는 시퀀스입니다.");
      }
    } else {
      alert("제목이 입력되지 않았습니다.");
    }
  });
  // 저장된 시퀀스 모두 지우기 이벤트
  $("#remove_all_sequence_bt").on("click", function (e) {
    if ($("#sequence_list").children().length) {
      // socket에서 지우는 함수 호출
      // 저장된 시퀀스 목록의 내용 지우기
      openSequence(null);
      simSocket("sim_remove_items");
      onFileList();
    }
  });
  // sequence_title_unfold_bt 펼치기 이벤트
  $("#sequence_title_unfold_bt").on("click", function () {
    foldSimulatorFile(false);
  });
  // sequence_title_fold_bt 접기 이벤트
  $("#sequence_title_fold_bt").on("click", function (e) {
    foldSimulatorFile(true);
  });
  // 제목 입력시 이벤트
  // 시퀀스 저장 이벤트
  $("#sequence_save_bt").on("click", () => {
    // selectFile(파일명), selectFileContents(내용)
    simSocket("sim_add_items", { name: selectFile, data: selectFileContents });
  });

  // 타임라인 아이템 클릭 이벤트
  const handleTimelineItemClick = (row, bCheck) => {
    const time = Number(row.text());
    const checkbox = row.find("div.cell input[type=checkbox]");
    row.siblings().removeClass("selected");
    if (!bCheck) {
      row
        .siblings()
        .find("div.cell input[type=checkbox]")
        .prop("checked", false);
    }
    row.addClass("selected");
    checkbox.prop("checked", true);
    const content = selectFileContents.filter((item) => item.time === time);
    setConfigSection(content[0]);
  };

  // 시퀀스 타임라인 아이템 추가
  const addTimelineItem = (item) => {
    const len = Math.floor(item.time);
    const timelineBody = $("#timeline_body");
    const idxItem = timelineBody.children().eq(len);
    new Array(len + 1).fill(null).map((v, i) => {
      const time = item.time.toString().replace(".", "_");
      let r = timelineBody.children(`div[name=timeline_row_${time}]`);
      if (timelineBody.has(`div[name=timeline_row_${time}]`).length) {
        // if (item.time === i) {
        r.removeClass("hide");
        // }
      } else {
        r = $(
          `<div name="timeline_row_${time}" class="timeline row ${
            item.time !== i ? "hide" : ""
          }"></div>`
        );
        r.off("click").on("click", (e) => {
          handleTimelineItemClick(
            $(e.currentTarget),
            $(e.target).prop("type") === "checkbox"
          );
        });
        console.log(Number(idxItem.text()), item.time);
        if (Number(idxItem.text()) > item.time) {
          idxItem.before(r);
        } else {
          timelineBody.append(r);
        }
      }
    });

    // // 같은 시간에 덮어쓸 수 있도록 일단 해당하는 row를 삭제한다.
    // $(`div[name="timeline_row_${item.time}"]`).remove();
    selectFileContents = selectFileContents.filter(
      ({ time }) => time !== item.time
    );
    const tr = timelineBody.children(
      `div[name=timeline_row_${item.time.toString().replace(".", "_")}]`
    );
    tr.children().remove();
    const contents = {};
    const items = Object.entries({
      eye: null,
      motion: null,
      audio: null,
      oled: null,
      tts: null,
      ...item,
    });
    let bValid = false;
    const fItems = items.reduce((acc, [k, v]) => {
      if (k === "time") {
        contents[k] = v;
        return { ...acc, [k]: v };
      } else if (
        (k === "eye" && v && v.content) ||
        (k === "motion" && v && v.content) ||
        (k === "audio" && v && v.content) ||
        (k === "oled" && v && v.content) ||
        (k === "tts" && v && v.content)
      ) {
        bValid = true;
        contents[k] = v;
        return { ...acc, [k]: true };
      }
      return { ...acc, [k]: false };
    }, {});
    if (bValid) {
      const cells = new Array(Object.keys(fItems).length);
      cells[0] = $(`<div class="timeline cell">${fItems.time}</div>`);
      cells[1] = fItems.eye
        ? $(`<div class="timeline cell use"></div>`)
        : $(`<div class="timeline cell"></div>`);
      cells[2] = fItems.motion
        ? $(`<div class="timeline cell use"></div>`)
        : $(`<div class="timeline cell"></div>`);
      cells[3] = fItems.audio
        ? $(`<div class="timeline cell use"></div>`)
        : $(`<div class="timeline cell"></div>`);
      cells[4] = fItems.oled
        ? $(`<div class="timeline cell use"></div>`)
        : $(`<div class="timeline cell"></div>`);
      cells[5] = fItems.tts
        ? $(`<div class="timeline cell use"></div>`)
        : $(`<div class="timeline cell"></div>`);

      const checkbox = $(`<input type="checkbox" /></div>`);
      checkbox.off("change").on("change", (e) => {
        const checkRow = $(e.target).parents(".timeline.row");
        const checked = $(e.target).is(":checked");
        console.log(checkRow, checked);
        const checkedRows = $(
          "#timeline_body .timeline.row:not(.hide) input[type=checkbox]:checked"
        );
        if (checkedRows.length === selectFileContents.length) {
          const allCheckbox = $("#timeline_all_check");
          allCheckbox.prop("checked", true);
        }
      });
      tr.append($(`<div class="timeline cell">`).append(checkbox));
      tr.append(...cells);
      selectFileContents.push(contents);
      selectFileContents.sort((a, b) => a.time - b.time);
    } else {
      alert("설정을 완료하세요.");
    }
  };
  // 시퀀스 타임라인 영역(section.timeline) 초기화
  const setTimelineSection = (list = []) => {
    const playBtn = $("#timeline_play_bt");
    playBtn.off("click").on("click", (e) => {
      console.log("timeline play", playBtn.children());
      const icon = playBtn.children("i");
      if (icon.hasClass("fa-play")) {
        playBtn.text(" 정지");
        playBtn.prepend(icon.removeClass("fa-play").addClass("fa-stop"));
        simSocket("sim_play_items", selectFileContents);
      } else {
        playBtn.text(" 실행");
        playBtn.prepend(icon.removeClass("fa-stop").addClass("fa-play"));
        simSocket("sim_stop_items");
      }
    });
    const allCheckbox = $("#timeline_all_check");
    allCheckbox.off("change").on("change", (e) => {
      const value = $(e.target).is(":checked");
      const rows = $("#timeline_body input[type=checkbox]");
      rows.prop("checked", value);
    });
    const delBtn = $("#timeline_del_bt");
    delBtn.off("click").on("click", () => {
    const selPlayBtn = $("#timeline_sel_play_bt");
    selPlayBtn.off("click").on("click", () => {
      const checkedRows = $(
        "#timeline_body .timeline.row:not(.hide) input[type=checkbox]:checked"
      ).parents(".timeline.row");
      if (!checkedRows.length) {
        alert("실행할 타임라인을 선택하세요.");
      } else {
        const icon = selPlayBtn.children("i");
        if (icon.hasClass("fa-play")) {
          selPlayBtn.text(" 선택 실행 정지");
          selPlayBtn.prepend(icon.removeClass("fa-play").addClass("fa-stop"));
          const selTimes = Array.from(checkedRows).map((el) =>
            Number($(el).text())
          );
          const selFileContents = selectFileContents.filter(
            (content) => selTimes.indexOf(content.time) > -1
          );
          simSocket("sim_play_items", selFileContents);
        } else {
          selPlayBtn.text(" 선택 실행");
          selPlayBtn.prepend(icon.removeClass("fa-stop").addClass("fa-play"));
          simSocket("sim_stop_items");
        }
      }
    });
    $("#timeline_body").children().remove();
    if (list.length) {
      list.forEach(addTimelineItem);
      handleTimelineItemClick($(`div[name=timeline_row_${list[0].time}]`));
    } else {
      selectFileContents = [];
    }
  };

  // 시퀀스 설정 영역(section.config) 초기화
  const setConfigSection = (obj) => {
    let time = 0;
    const initialData = {
      eye: { type: "default", content: [] },
      motion: { type: "default", content: "", cycle: 1 },
      audio: {
        type: "/home/pi/openpibo-files/audio/music/",
        content: "",
        volume: 30,
      },
      oled: { type: "text", content: null, x: 0, y: 0, size: 10 },
      tts: { type: "main", content: "", volume: 60 },
    };

    const configData = {
      data: {
        ...initialData,
        time: 0,
      },
      get value() {
        return this.data;
      },
      set value(v) {
        this.data = { ...this.data, ...v };
      },
      set val(param) {
        const { key, value: v, bInit } = param;
        if (bInit) {
          this.data[key] = { ...initialData[key], ...v };
        } else {
          this.data[key] = { ...this.data[key], ...v };
        }
      },
    };

    const radioButtonClickHandler = (e) => {
      const target = $(e.target);
      const [key] = target.parents("div.config.card").attr("id").split("_");
      Array.from(target.siblings("input[type=radio]")).map((el) =>
        $(el).prop("checked", false)
      );
      target.prop("checked", true);

      const keyData = configData.value[key];
      if (
        !keyData ||
        (keyData && "type" in keyData && keyData.type !== target.val())
      ) {
        if (key === "eye") {
          configData.val = {
            key: "eye",
            value: { type: target.val() },
            bInit: true,
          };
        } else if (key === "motion") {
          configData.val = {
            key: "motion",
            value: { type: target.val() },
            bInit: true,
          };
        } else if (key === "oled") {
          configData.val = {
            key: "oled",
            value: { type: target.val() },
            bInit: true,
          };
        } else if (key === "tts") {
          configData.val = {
            key: "tts",
            value: { type: target.val() },
          };
        }
      }
    };

    const setCardBtnEvent = (key) => {
      const playBtn = $(`#${key}_play_bt`);
      const initBtn = $(`#${key}_init_bt`);
      playBtn.off("click").on("click", () => {
        const icon = playBtn.children("i");
        if (icon.hasClass("fa-play")) {
          icon.removeClass("fa-play").addClass("fa-stop");
          simSocket("sim_play_item", configData.data[key]);
        } else {
          icon.removeClass("fa-stop").addClass("fa-play");
          simSocket("sim_stop_item", key);
        }
      });
      initBtn.off("click").on("click", () => {
        const data = initialData[key];
        switch (key) {
          case "eye":
            return setEyeColorCard(data);
          case "motion":
            return setMotionCard(data);
          case "audio":
            return setAudioCard(data);
          case "oled":
            return setOledCard(data);
          case "tts":
            return setTtsCard(data);
          default:
            break;
        }
      });
    };

    /* 눈 색상 카드 */
    const setEyeColorCard = (data) => {
      configData.val = { key: "eye", value: data, bInit: true };

      const eyeColorList = [
        [239, 51, 64],
        [242, 113, 28],
        [255, 222, 34],
        [33, 186, 69],
        [3, 191, 215],
        [163, 51, 200],
        [255, 142, 223],
        [255, 255, 255],
      ];

      const transColorValue = (v) => {
        if (v === null) return "";
        const n = Number(v);
        if (n >= 0 && n <= 255) {
          return n;
        }
        return "";
      };

      const setEyeColor = ([eye, rs, gs, bs]) => {
        const r = transColorValue(rs);
        const g = transColorValue(gs);
        const b = transColorValue(bs);
        const target = $(`span[name=${eye}_${r}_${g}_${b}]`);
        const siblings = Array.from(
          $(`#eye_color_group_${eye} div.swatch span.color`)
        );
        siblings.forEach((el) => $(el).removeClass("selected"));
        target.addClass("selected");
        if (r > 199 && g > 199 && b > 199) {
          target.addClass("inverse");
        }
        const inputKeyDownHandler = (e) => {
          const name = $(e.target).attr("name");
          const value = $(e.target).val().replace(/[^\d]/g, "");
          if (Number(value) < 0) {
            $(e.target).val(0);
          } else if (Number(value) > 255) {
            $(e.target).val(255);
          } else if (value) {
            $(e.target).val(value);
          }
          const content =
            configData.value.eye.content ||
            data.contents ||
            new Array(6).fill("");
          const [t, color, side] = name.split("_");
          let idx = side === "r" ? 0 : 3;
          if (color === "red") {
            idx += 0;
          } else if (color === "green") {
            idx += 1;
          } else if (color === "blue") {
            idx += 2;
          }
          content.splice(idx, 1, value);
          configData.val = { key: "eye", value: { content } };
        };

        const inputR = $(`#color_input_${eye} input[name=color_red_${eye}]`);
        const inputG = $(`#color_input_${eye} input[name=color_green_${eye}]`);
        const inputB = $(`#color_input_${eye} input[name=color_blue_${eye}]`);
        inputR.val(r);
        inputG.val(g);
        inputB.val(b);
        inputR.off("keyup").on("keyup", inputKeyDownHandler);
        inputG.off("keyup").on("keyup", inputKeyDownHandler);
        inputB.off("keyup").on("keyup", inputKeyDownHandler);
        let arr = configData.value.eye.contents || data.contents;
        if (arr && arr.length) {
          const [rr, rg, rb, lr, lg, lb] = arr;
          if (eye === "r") {
            arr = [r, g, b, lr, lg, lb];
          }
          if (eye === "l") {
            arr = [rr, rg, rb, r, g, b];
          }
        } else {
          if (eye === "r") {
            arr = [r, g, b, null, null, null];
          }
          if (eye === "l") {
            arr = [null, null, null, r, g, b];
          }
        }
        configData.val = { key: "eye", value: { content: arr } };
      };

      let eyeArr = [];
      ["r", "l"].map((eye) => {
        const eyeGroup = $(`#eye_color_group_${eye}>div.color.swatch`);
        eyeGroup.children().remove();
        setEyeColor([eye]);
        const eyeColors = eyeColorList.map(([r, g, b]) => {
          const el = $(
            `<span class="color" name="${eye}_${r}_${g}_${b}" style="background: rgb(${r}, ${g}, ${b})"></span>`
          );
          if (data.content && data.content.length) {
            const [rr, rg, rb, lr, lg, lb] = data.content;
            if (eye === "r" && rr === r && rg === g && rb === b) {
              el.attr("selected", true);
              eyeArr.unshift(...[r, g, b]);
            } else if (eye === "l" && lr === r && lg === g && lb === b) {
              el.attr("selected", true);
              eyeArr.push(...[r, g, b]);
            }
          }
          el.on("click", (e) =>
            setEyeColor($(e.target).attr("name").split("_"))
          );
          return el;
        });
        eyeGroup.append(...eyeColors);
      });
      if (data.type === "custom") {
        eyeArr = [...data.content];
        $(".color-swatch-group .color.swatch").addClass("hide");
        $(".color-input-wrap input[type=tel]").prop("readonly", false);
      } else {
        $(".color-swatch-group .color.swatch").removeClass("hide");
        $(".color-input-wrap input[type=tel]").prop("readonly", true);
      }
      if (eyeArr.length === 6) {
        const [rr, rg, rb, lr, lg, lb] = eyeArr;
        setEyeColor(["r", rr, rg, rb]);
        setEyeColor(["l", lr, lg, lb]);
      }

      const eyeRadioList = [
        { name: "default", value: "기본" },
        { name: "custom", value: "사용자" },
      ];
      const eyeRadioGroup = $("#eye_radio_group");
      eyeRadioGroup.children().remove();
      const inputRadios = eyeRadioList.map(({ name, value }) => {
        const radioInput = $(
          `<input type="radio" id="eye_${name}" name="eye_${name}" value="${name}" />`
        );
        radioInput.prop(
          "checked",
          (!data && name === "default") || (data && data.type === name)
        );
        radioInput.on("click", (e) => {
          radioButtonClickHandler(e);
          if (e.target.name === "eye_custom") {
            $(".color-swatch-group .color.swatch").addClass("hide");
            $(".color-input-wrap input[type=tel]").prop("readonly", false);
          } else {
            $(".color-swatch-group .color.swatch").removeClass("hide");
            $(".color-input-wrap input[type=tel]").prop("readonly", true);
          }
          setEyeColor(["r", null, null, null]);
          setEyeColor(["l", null, null, null]);
        });
        return [radioInput, $(`<label for="eye_${name}">${value}</label>`)];
      });
      eyeRadioGroup.append(...inputRadios.flat());

      setCardBtnEvent("eye");
    };

    /* 모션 카드 */
    const setMotionCard = (data) => {
      configData.val = { key: "motion", value: data, bInit: true };

      const setMotionList = (list, name, cycle) => {
        const motionList = [
          { value: "", label: "모션을 선택하세요." },
          ...list.map((li) => ({ value: li, label: li })),
        ];
        const motionSelect = $("#motion_select");
        motionSelect.children().remove();
        const motionSelectOptions = motionList.map(
          ({ value, label }) =>
            $(
              `<option value=${value} ${
                name === value ? "selected" : ""
              }>${label}</option>`
            ) // 선택된 값 세팅 될 경우 selected
        );
        motionSelect.append(...motionSelectOptions);
        motionSelect.on("change", (e) => {
          configData.val = {
            key: "motion",
            value: { content: e.target.value },
          };
        });
        const motionRepeat = $("#motion_cycle_input");
        motionRepeat.val(cycle || 1);
        motionRepeat.on("change", (e) => {
          let val = Number(e.target.value);
          if (val > 99) {
            val = 99;
          } else if (val < 1) {
            val = 1;
          }
          configData.val = {
            key: "motion",
            value: { cycle: val },
          };
        });
      };

      const motionRadioList = [
        { name: "default", value: "기본" },
        { name: "mymotion", value: "사용자" },
      ];
      const motionRadioGroup = $("#motion_radio_group");
      motionRadioGroup.children().remove();
      const inputRadios = motionRadioList.map(({ name, value }) => {
        const radioInput = $(
          `<input type="radio" id="motion_${name}" name="motion_${name}" value="${name}" />`
        );
        radioInput.prop(
          "checked",
          (!data && name === "default") || (data && data.type === name)
        );
        radioInput.on("click", (e) => {
          radioButtonClickHandler(e);
          simSocket("sim_update_motion", e.target.value, (list) => {
            setMotionList(list);
          });
        });
        return [radioInput, $(`<label for="motion_${name}">${value}</label>`)];
      });
      motionRadioGroup.append(...inputRadios.flat());
      simSocket(
        "sim_update_motion",
        data && data.type ? data.type : "default",
        (list) => {
          setMotionList(list, data && data.content, data && data.cycle);
        }
      );

      setCardBtnEvent("motion");
    };

    /* 오디오 카드 */
    const setAudioCard = (data) => {
      configData.val = { key: "audio", value: data, bInit: true };
      const setAudioList = (list, type, content) => {
        const audiof =
          content.indexOf(type) < 0 ? `${type}${content}` : content;
        const audioFileList = [
          { value: "", label: "오디오 파일을 선택하세요." },
          ...list.map((li) => ({
            value: li,
            label: li.replace(/^\/.+(\/)/gim, ""),
          })),
        ];
        const audioFileSelect = $("#audio_select");
        audioFileSelect.children().remove();
        const audioSelectOptions = audioFileList.map(({ value, label }) =>
          $(
            `<option value=${value} ${
              value === audiof ? "selected" : ""
            }>${label}</option>`
          )
        );
        audioFileSelect.append(...audioSelectOptions);
        audioFileSelect.on("change", (e) => {
          configData.val = {
            key: "audio",
            value: { type, content: e.target.value },
          };
        });
      };

      const path = "/home/pi/openpibo-files/audio/";
      const audioRadioList = [
        { name: "music", value: `${path}music/`, label: "음악" },
        { name: "voice", value: `${path}voice/`, label: "목소리" },
        { name: "effect", value: `${path}effect/`, label: "효과음" },
        { name: "animal", value: `${path}animal/`, label: "동물소리" },
        { name: "myaudio", value: "/home/pi/myaudio/", label: "내 오디오" },
      ];
      const audioRadioGroup = $("#audio_radio_group");
      audioRadioGroup.children().remove();
      const inputRadios = audioRadioList.map(({ name, label, value }) => {
        const radioInput = $(
          `<input type="radio" id="audio_${name}" name="audio_${name}" value="${value}" />`
        );
        radioInput.prop(
          "checked",
          (!data && name === "music") || (data && data.type === value)
        );
        radioInput.on("click", (e) => {
          radioButtonClickHandler(e);
          simSocket("sim_update_audio", e.target.value, (list) => {
            setAudioList(list, e.target.value);
          });
        });
        return [radioInput, $(`<label for="audio_${name}">${label}</label>`)];
      });
      audioRadioGroup.append(...inputRadios.flat());
      const type = data && data.type ? data.type : audioRadioList[0].value;
      simSocket("sim_update_audio", type, (list) => {
        setAudioList(list, type, data && data.content);
      });
      const audioVolume = $("#audio_volume_input");
      audioVolume.val(data.volume);
      audioVolume.on("change", (e) => {
        configData.val = {
          key: "audio",
          value: { volume: Number(e.target.value) },
        };
      });

      setCardBtnEvent("audio");
    };

    /* 디스플레이 카드 */
    const setOledCard = (data) => {
      configData.val = { key: "oled", value: data, bInit: true };

      const setOledImageList = (list, imgPath, name) => {
        const imageList = [
          { value: "", label: "이미지를 선택하세요." },
          ...list.map((li) => ({
            value: `${imgPath}/${li}`,
            label: li.replace(/[\.]+[a-z]+$/gim, ""),
          })),
        ];
        const imgSelect = $("#oled_img_select");
        imgSelect.children().remove();
        const imgSelectOptions = imageList.map(
          ({ value, label }) =>
            $(
              `<option value=${value} ${
                value === `${imgPath}/${name}` ? "selected" : ""
              }>${label}</option>`
            ) // 선택된 값 세팅 될 경우 selected
        );
        imgSelect.append(...imgSelectOptions);
        imgSelect.off("change").on("change", (e) => {
          configData.val = {
            key: "oled",
            value: { type: "image", content: e.target.value },
          };
        });
      };

      const setOledImagePathList = (path, img) => {
        const oledImgOptionsList = [
          { value: "", label: "이미지 종류를 선택하세요." },
          { value: "/home/pi/openpibo-files/icon/expression", label: "표정" },
          { value: "/home/pi/openpibo-files/icon/game", label: "가위바위보" },
          { value: "/home/pi/openpibo-files/icon/recycle", label: "재활용" },
          { value: "/home/pi/openpibo-files/icon/story", label: "이야기" },
          { value: "/home/pi/openpibo-files/icon/weather", label: "날씨" },
          { value: "/home/pi/myimage", label: "내 이미지" },
        ];
        const oledPathSelect = $("#oled_path_select");
        oledPathSelect.children().remove();
        const oledPathOptions = oledImgOptionsList.map(({ label, value }) => {
          if (!path || path === value) {
            simSocket("sim_update_oled", value, (list) =>
              setOledImageList(list, path, img)
            );
          }
          return $(
            `<option value=${value} ${
              path === value ? "selected" : ""
            }>${label}</option>`
          );
        });
        oledPathSelect.off("change").on("change", (e) => {
          simSocket("sim_update_oled", e.target.value, (list) =>
            setOledImageList(list, e.target.value, "")
          );
        });
        oledPathSelect.append(...oledPathOptions);
      };

      const setOledContent = (type, obj) => {
        if (type === "image") {
          $("#oled_text_group").hide();
          $("#oled_img_group").show();
          if (obj && obj.content) {
            const [path, img] = obj.content.split("/").reduce(
              (a, c, i, arr) => {
                if (i === arr.length - 1) return [a[0], c];
                const str = c ? "/" + c : "";
                return [a[0] + str, a[1]];
              },
              [[], []]
            );
            setOledImagePathList(path, img);
          } else {
            setOledImagePathList();
          }
        } else {
          $("#oled_img_group").hide();
          $("#oled_text_group").show();
          const { content, x, y, size } = obj;
          const oledTA = $("#oled_textarea");
          oledTA.val(content || "");
          oledTA.on("change", (e) => {
            configData.val = {
              key: "oled",
              value: { type, content: e.target.value },
            };
          });

          const oledConfigInputs = Array.from($("#oled_text_config input"));
          oledConfigInputs.map((item) => {
            if (item.id === "oled_x") {
              $(item).val(x || 0);
            } else if (item.id === "oled_y") {
              $(item).val(y || 0);
            } else if (item.id === "oled_size") {
              $(item).val(size || 10);
            }
            $(item).on("change", (e) => {
              const { name, value } = e.target;
              const key = name.split("oled_")[1];
              configData.val = { key: "oled", value: { [key]: Number(value) } };
            });
          });
        }
      };
      const oledRadioList = [
        { name: "text", value: "문자" },
        { name: "image", value: "이미지" },
      ];
      const oledRadioGroup = $("#oled_radio_group");
      oledRadioGroup.children().remove();
      const oledInputRadios = oledRadioList.map(({ name, value }) => {
        const radioInput = $(
          `<input type ="radio" id="oled_${name}" name="oled_${name}" value="${name}" />`
        );
        radioInput.prop(
          "checked",
          (!data && name === "text") || (data && data.type === name)
        );
        radioInput.on("click", (e) => {
          radioButtonClickHandler(e);
          setOledContent(e.target.name.indexOf("image") > 0 ? "image" : "text");
        });
        return [radioInput, $(`<label for="oled_${name}">${value}</label>`)];
      });
      oledRadioGroup.append(...oledInputRadios.flat());
      if (data) {
        const type = data.type;
        setOledContent(type, data || { content: "", x: 0, y: 0, size: 10 });
      } else {
        setOledContent("text", { content: "", x: 0, y: 0, size: 10 });
      }

      setCardBtnEvent("oled");
    };

    /* 음성 카드 */
    const setTtsCard = (data) => {
      configData.val = { key: "tts", value: data, bInit: true };

      const ttsOptionsList = [
        { value: "main", label: "기본" },
        { value: "pibo", label: "파이보" },
        { value: "boy", label: "소년" },
        { value: "girl", label: "소녀" },
      ];
      const ttsSelect = $("#tts_select");
      ttsSelect.children().remove();
      const ttsOptions = ttsOptionsList.map(({ label, value }) =>
        $(
          `<option value=${value} ${
            data.type === value ? "selected" : ""
          }>${label}</option>`
        )
      );
      ttsSelect.append(...ttsOptions);

      const ttsTA = $("#tts_textarea");
      ttsTA.val((data && data.content) || "");
      ttsTA.on("change", (e) => {
        configData.val = {
          key: "tts",
          value: { content: e.target.value.slice(0, 48) },
        };
      });

      const ttsVolumeInput = $("#tts_volume_input");
      ttsVolumeInput.val((data && data.volume) || 60);
      ttsVolumeInput.on("change", (e) => {
        configData.val = {
          key: "tts",
          value: { volume: Number(e.target.value) },
        };
      });

      setCardBtnEvent("tts");
    };

    configData.value = obj;
    setEyeColorCard(configData.value.eye);
    setMotionCard(configData.value.motion);
    setAudioCard(configData.value.audio);
    setOledCard(configData.value.oled);
    setTtsCard(configData.value.tts);

    const timeInput = $("#config_time_input");
    timeInput.val(configData.value.time || 0);
    const timeSave = $("#config_time_bt");
    timeSave.off("click").on("click", () => {
      const time = Number(timeInput.val()) || 0;
      addTimelineItem({
        ...configData.value,
        time,
      });
      handleTimelineItemClick(
        $(`div[name=timeline_row_${time.toString().replace(".", "_")}]`)
      );
    });
  };

  onFileList();
  setConfigSection();
  setTimelineSection();
};

$(function () {
  const socket = io("ws://" + window.location.hostname + ":80", {
    path: "/ws/socket.io",
  });

  getStatus(socket);
  getVisions(socket);
  getMotions(socket);
  getSpeech(socket);
  getDevices(socket);
  getSimulations(socket);

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

  handleMenu("simulator");
  const menus = $("nav").find("button");
  menus.each((idx) => {
    const element = menus.get(idx);
    const name = element.getAttribute("name");
    element.addEventListener("click", () => handleMenu(name));
  });
});
