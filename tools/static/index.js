      const getStatus = (socket) => {
        $("#devtool_bt").click(() =>  $(location).attr( "href", "http://" + window.location.hostname + ":50000"));

        socket.emit("onoff");
        socket.on("onoff", function (d) {
          $("input:checkbox[name=onoff_sel]").prop("disabled", false);
          $("input:checkbox[name=onoff_sel]").attr(
            "checked",
            d == "on" ? true : false
          );

          if (d == "on") socket.emit("motor_init");
        });

        $("input:checkbox[name=onoff_sel]").change(function () {
          let sel = $("input:checkbox[name=onoff_sel]").is(":checked")
            ? "on"
            : "off";
          $("input:checkbox[name=onoff_sel]").prop("disabled", true);
          socket.emit("onoff", sel);
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

        $("input[type=submit]").click(function () {
          let comment = "WIFI 정보를 변경하시겠습니까?";
          comment += "\n===========================================";
          comment += "\nssid: " + $("#ssid").val();
          comment += "\npassword: " + $("#password").val();
          if (confirm(comment)) {
            socket.emit("wifi", {
              ssid: $("#ssid").val(),
              psk: $("#password").val(),
            });
          }
        });

        setTimeout(function () {
          socket.emit("config");
        }, 1000);
        socket.on("config", function (data) {
          $("#kakaokey").val(data["kakaokey"]);
          $("#eye").val(data["eye"]);
        });

        $("#kakaokey_bt").click(function () {
          if (confirm("카카오 개발 계정을 업데이트하시겠습니까?"))
          socket.emit("config", {
            kakaokey: $("#kakaokey").val(),
          });
        });

        $("#poweroff_bt").click(function () {
          if (confirm("정말 종료하시겠습니까?"))
            socket.emit("poweroff");
        });

        $("#restart_bt").click(function () {
          if (confirm("재시작하시겠습니까?"))
            socket.emit("restart");
        });

        $("#swupdate_bt").click(function () {
	  //socket.emit("swupdate");
        });
      };

      const getVisions = (socket) => {
        socket.on("stream", function (data) {
          $("#v_im_in").attr(
            "src",
            "data:image/jpeg;charset=utf-8;base64," + data
          );
        });

        $("#v_detect_bt").click(function () {
          socket.emit("detect");
        });

        socket.on("detect", function (data) {
          $("#v_im_out").attr(
            "src",
            "data:image/jpeg;charset=utf-8;base64," + data["img"]
          );
          $("#v_res_face").text(data["data"]["face"]);
          $("#v_res_qr").text(data["data"]["qr"]);
          $("#v_res_obj").text(data["data"]["object"]);
        });

        $("#v_cartoon_bt").click(function () {
          socket.emit("cartoon");
        });

        socket.on("cartoon", function (data) {
          $("#v_im_out").attr(
            "src",
            "data:image/jpeg;charset=utf-8;base64," + data
          );
        });
      };

      const getMotions = (socket) => {
        const motor_default = [0, 0, -80, 0, 0, 0, 0, 0, 80, 0];
        //socket.emit("motor_init");

        socket.on("init_motion", function (data) {
          for (let i = 0; i < 10; i++) {
            let tval = "#m" + i + "_value";
            let trange = "#m" + i + "_range";
            $(tval).val(data[i]);
            $(trange).val(data[i]);
          }
        });

        for (let i = 0; i < 10; i++) {
          let tval = "#m" + i + "_value";
          let trange = "#m" + i + "_range";
          $(trange).on("input", function (d) {
            var pos = $(trange).val();
            $(tval).val(pos);
            socket.emit("set_pos", { idx: i, pos: Number(pos) });
          });

          $(tval).on("input", function () {
            var pos = $(tval).val();
            $(trange).val(pos);
            socket.emit("set_pos", { idx: i, pos: Number(pos) });
          });
        }

        $("#init_bt").click(function () {
          for (let i = 0; i < 10; i++) {
            let tval = "#m" + i + "_value";
            let trange = "#m" + i + "_range";
            $(tval).val(motor_default[i]);
            $(trange).val(motor_default[i]);
            socket.emit("set_pos", { idx: i, pos: Number(motor_default[i]) });
          }
        });

        // 타임라인 동기화
        $("#timeline").on("input", function () {
          $("#time_val").val($(this).val());
        });

        $("#time_val").on("input", function () {
          if ($(this).val() % 50 == 0) $("#timeline").val($(this).val());
        });

        // 저장 버튼
        $("#add_frame_bt").click(function () {
          let seq = $("#time_val").val();
          if (seq % 50 != 0) {
            alert("타임라인을 50ms 단위로 설정해주세요.");
            return;
          }
          socket.emit("add_frame", seq);
        });

        // 테이블 작성
        socket.on("disp_record", function (data) {
          $("#record_table > tbody").empty();
          for (let i = 0; i < data.length; i++) {
            $("#record_table > tbody").append(
              $("<tr>")
                .append(
                  $("<td>").append(data[i].seq + " ms"),
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
                    // 포즈 하나 삭제 옵션
                    $(this).animate({ opacity: "0.5" });
                  },
                  function () {
                    $(this).animate({ opacity: "1" });
                  }
                )
                .click(function () {
                  if (
                    confirm(
                      $(this).text().split(" ms")[0] +
                        " ms 을 삭제하시겠습니까?"
                    )
                  ) {
                    socket.emit(
                      "remove_frame",
                      Number($(this).text().split(" ms")[0])
                    );
                    $(this).remove();
                  }
                })
            );
          }
        });

        // 테이블 초기화
        $("#init_frame_bt").click(function () {
          socket.emit("init_frame");
          $("#record_table > tbody").empty();
        });

        // 동작 재생
        $("#play_frame_bt").click(function () {
          if ($("#record_table > tbody").text()) {
            let cycle = $("#play_cycle_val").val();
            socket.emit("play_frame", cycle);
          } else {
            alert("저장된 동작이 없습니다.\n먼저 동작을 저장해주세요.");
          }
        });

        // 모션 추가
        $("#add_motion_bt").click(function () {
          let motionName = $("#motion_name_val").val();
          socket.emit("add_motion", motionName);
        });

        // 모션 불러오기
        $("#load_motion_bt").click(function () {
          let motionName = $("#motion_name_val").val();
          socket.emit("load_motion", motionName);
        });

        // 모션 삭제
        $("#del_motion_bt").click(function () {
          let motionName = $("#motion_name_val").val();
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

        socket.on("disp_code", function (code) {
          $("#code").text(JSON.stringify(code));
        });
      };
      
      const getChatbots = (socket) => {
        $("#c_question_text").on("keyup", function () {
          $(this).val(
            $(this)
              .val()
              .replace(/[^ㄱ-ㅣ가-힣 | 0-9 |?|.|,|'|"|!]/g, "")
          );
        });

        $("#c_question_text").keypress(function (key) {
          if (key.keyCode == 13) {
            // enter
            q = $("#c_question_text").val().trim();

            $("#c_question_text").prop("disabled", true);

            setTimeout(function () {
              $("#c_question_text").val(".");
            }, 100);
            setTimeout(function () {
              $("#c_question_text").val("..");
            }, 300);
            setTimeout(function () {
              $("#c_question_text").val("...");
            }, 500);
            setTimeout(function () {
              $("#c_question_text").val("....");
            }, 700);
            setTimeout(function () {
              $("#c_question_text").val(".....");
            }, 900);

            setTimeout(function () {
              socket.emit("question", {
                question: q,
                voice_type: $("select[name=c_voice_type]").val(),
                voice_mode: $("select[name=c_voice_mode]").val(),
                volume: Number($("select[name=volume]").val()),
              });
              $("#c_question_text").prop("disabled", false);
              $("#c_question_text").val(q);
            }, 1200);
          }
        });

        socket.on("answer", function (data) {
          $("#c_answer_text").val(data["answer"]);
          $("#c_record_tb > tbody").empty();
          rec = data["chat_list"];

          for (idx in rec) {
            if (rec[idx].length == 0) continue;

            $("#c_record_tb").append(
              $("<tr>").append(
                $("<td>").append(rec[idx][0]),
                $("<td>").append(rec[idx][1]),
                $("<td>").append(rec[idx][2])
              )
            );
          }
        });
      };
      
      const getDevices = (socket) => {
        socket.on("update_neopixel", function (data) {
          for (let i = 0; i < 6; i++) {
            $("#d_n" + i + "_val").val(data[i]);
          }
        });

        socket.on("update_battery", function (data) {
	  let bat = Number(data.split('%')[0]);
          $("#d_battery_val").html("<i class='fa fa-battery-" + Math.floor(bat/25)+ "' aria-hidden='true'></i>" + data);
        });

        socket.on("update_device", function (data) {
          $("#d_pir_val").text(data[0].toUpperCase());
          $("#d_touch_val").text(data[1].toUpperCase());
          $("#d_dc_val").html(
            data[2].toUpperCase() == "ON" ? "<i class='fa fa-plug' aria-hidden='true'></i>" : ""
          );
          $("#d_button_val").text(data[3].toUpperCase());
        });

        for (let i = 0; i < 6; i++) {
          $("#d_n" + i + "_val").on("input", function () {
            var v = $("#d_n" + i + "_val").val();
            socket.emit("set_neopixel", { idx: i, value: v });
          });
        }

        $("#eye_save_bt").click(function () {
          let eyeval = "";
          for (let i = 0; i < 6; i++) {
            eyeval += $("#d_n" + i + "_val").val();
            if (i == 5) break;
            else eyeval += ",";
          }
          socket.emit("config", {
            eye: eyeval,
          });
        });

        $("#d_otext_val").keypress(function (key) {
          if (key.keyCode == 13) {
            // enter
            var text = $("#d_otext_val").val().trim();
            var x = $("#d_ox_val").val();
            var y = $("#d_oy_val").val();
            var size = $("#d_osize_val").val();

            socket.emit("set_oled", {
              x: Number(x),
              y: Number(y),
              size: Number(size),
              text: text,
            });
          }
        });

        $("#mic_bt").click(function () {
          socket.emit("mic", {
            time: $("#mic_time_val").val(),
            volume: Number($("select[name=volume]").val()),
          });
        });
      };

      $(function () {
        const socket = io();

        getStatus(socket);
        getVisions(socket);
        getMotions(socket);
        getChatbots(socket);
        getDevices(socket);

        const handleMenu = (name) => {
          if (name === "home") {
            socket.emit("config");
            socket.emit("wifi");
          } else if (name === "chatbot") {
            $("#c_question_text").val("");
            $("#c_answer_text").val("");
          } else if (name === "device") {
            $("#d_otext_val").val("");
          }

          $("h2#content_header").text(name.toUpperCase());
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
