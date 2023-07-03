const init_usedata = {
  staytime:0,
  block:{click:0, keydown:0, execute:0, staytime:0},
  python:{click:0, keydown:0, execute:0, staytime:0},
  shell:{click:0, keydown:0, execute:0, staytime:0}
};
let usedata = init_usedata; // from server

const urlParams = new URLSearchParams(window.location.search);
let userid = null;
for(const entry of urlParams.entries()) {
  if(entry[0] == "userid") userid = entry[1];
}
console.log("USER ID:", userid);

const MAX_FILENAME_LENGTH = 50;
const codeMirrorMode = {
  python: "python",
  shell: "shell",
};
const codeEditor = CodeMirror.fromTextArea(
  document.getElementById("codemirror-code"),
  {
    lineNumbers: "true",
    //lineWrapping: "true",
    mode: codeMirrorMode["python"],
    theme: "cobalt",
    extraKeys: {
      "Ctrl-S": function (instance) {
        if ($("#codepath").html() == "") {
          alert("파일이 없습니다.");
          return;
        }
        saveCode = codeEditor.getValue();
        CodeMirror.signal(codeEditor, "change");
        socket.emit("save", { codepath: $("#codepath").html(), codetext: saveCode });
      },
    },
  }
);

const execute = document.getElementById("execute");
const stop = document.getElementById("stop");
const codeTypeBtns = document.querySelectorAll("div[name=codetype] button");
const result = document.getElementById("result");
const socket = io();

let CURRENT_DIR;
let CODE_PATH = '';
let BLOCK_PATH = '';
let saveCode = "";
let saveBlock = "{}";

$("#logo_bt").on("click", () => {
  if (confirm("Tools로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)"))
    location.replace(`http://${location.hostname}` + (userid == null?'':`/?userid=${userid}`));
});

$("#fontsize").on("change", () => {
  document.querySelector("div.CodeMirror").style.fontSize = `${$("#fontsize").val()}px`;
  codeEditor.refresh();
});

socket.on("update", (data) => {
  if ("code" in data) {
    const oldpath = $("#codepath").html();
    $("#codepath").html(data["filepath"]);

    if(oldpath != "" || data["code"] != "") {
      let codetype = "";
      codeTypeBtns.forEach((el) => {
        if (el.classList.value.includes("checked")) codetype = el.name;
      });
      if (codetype == "block") {
        try {
          Blockly.serialization.workspaces.load(JSON.parse(data["code"]), workspace);
          saveBlock = data["code"];
          update_block();
        }
        catch(e) {
          //alert("블록 데이터를 불러오지 못했습니다.");
          //saveBlock = "{}";
          if(data["code"] == "") {
            saveBlock = "";
            Blockly.serialization.workspaces.load(JSON.parse("{}"), workspace);
            update_block();
          }
          else {
            alert("블록 데이터를 불러오지 못했습니다.");
            $("#codepath").html(oldpath);
          }
        }
      }
      else {
        saveCode = data["code"];
        codeEditor.setValue(saveCode);
      }
    }
  }

  if ("image" in data) {
    $("#mediapath").html(data["filepath"]);
    $("#image").prop("src", `data:image/jpeg;charset=utf-8;base64,${data["image"]}`);
  }

  if ("audio" in data) {
    $("#mediapath").html(data["filepath"]);
    $("#audio").prop("src", `data:audio/mpeg;charset=utf-8;base64,${data["audio"]}`);
  }

  if ("record" in data) {
    result.value = data["record"];
    result.scrollTop = result.scrollHeight;
    execute.classList.add("disabled");
    stop.classList.remove("disabled");
    execute.disabled = true;
    stop.disabled = false;
  }

  if ("dialog" in data) {
    alert(data["dialog"]);
  }

  if ("exit" in data) {
    execute.classList.remove("disabled");
    stop.classList.add("disabled");
    execute.disabled = false;
  }
});

socket.emit("init");
socket.on("init", (d) => {
  saveCode = d["codetext"];
  codeEditor.setValue(saveCode);

  codeTypeBtns.forEach((el) => {
    if (el.name == "python") el.classList.add("checked");
    else el.classList.remove("checked");
  });

  $("#codepath").text(d["codepath"]);
  CURRENT_DIR = d["path"].split("/");
  socket.emit("load_directory", CURRENT_DIR.join("/"));
});

socket.on("system", (data) => {
  $("#s_serial").text(data[0]);
  $("#s_os_version").text(data[1]);
  $("#s_runtime").text(`${Math.floor(data[2] / 3600)} hours`);
  $("#s_cpu_temp").text(data[3]);
  $("#s_memory").text(`${Math.floor(data[5]/data[4]/4*100)} %`);
  $("#s_network").text(`${data[6]}/${data[7].replace("\n", "")}`);
  $("#wifi_info").text(`${data[6]}/${data[7].replace("\n", "")}`);
});

let startTime_item = new Date().getTime();

codeTypeBtns.forEach((btn) => {
  const handler = (e) => {
    let before_codetype = "";
    codeTypeBtns.forEach((el) => {
      if (el.classList.value.includes("checked")) before_codetype = el.name;
    });
    codeTypeBtns.forEach((el) => el.classList.remove("checked"));
    const target = e.currentTarget;
    target.classList.add("checked");

    usedata[target.name]["staytime"] += parseInt((new Date().getTime() - startTime_item) / 1000);
    startTime_item = new Date().getTime();

    if (target.name == "block") {
        // if (BLOCK_PATH == "") {
        //   alert("주의!) 저장할 파일은 먼저 선택해주세요.");
        // }
        if (before_codetype != "block") {
          $("#codeDiv").hide();
          $("#blocklyDiv").show();
          CODE_PATH = $("#codepath").html();
          $("#codepath").html(BLOCK_PATH);
        }
        $("#execute").html('<i class="fa-solid fa-flag"></i>');
        $("#stop").html('<i class="fa-solid fa-circle"></i>');
    }
    else {
      // if (CODE_PATH == "") {
      //   alert("주의!) 저장할 파일은 먼저 선택해주세요.");
      // }
      if (before_codetype == "block") {
        $("#blocklyDiv").hide();
        $("#codeDiv").show();
        BLOCK_PATH = $("#codepath").html();
        $("#codepath").html(CODE_PATH);
      }
      codeEditor.setOption("mode", codeMirrorMode[target.name]);
      $("#execute").html('<i class="fa-solid fa-play"></i>');
      $("#stop").html('<i class="fa-solid fa-stop"></i>');
    }
    Blockly.svgResize(workspace);
  };
  btn.addEventListener("click", handler);
});

codeEditor.on("change", () => {
  $("#codecheck").html(saveCode==codeEditor.getValue() ? "" : "<i class='fa-solid fa-circle'></i>");
});

execute.addEventListener("click", () => {
  let filepath = $("#codepath").html();
  if (filepath == "") {
    alert("파일이 없습니다.");
    return;
  }

  let codetype = "";
  let codepath = "";
  result.value = "";

  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });
  if (codetype == "block") {
    // if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
    //   alert("json 파일만 실행 가능합니다.");
    //   return;
    // }
    saveBlock = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
    socket.emit("save", { 
      codepath: filepath, 
      codetext: saveBlock 
    });
    update_block();
    socket.emit("execute", { codetype: "python", codepath: "/home/pi/blockly.py", codetext: Blockly.Python.workspaceToCode(workspace) });
  }
  else {
    saveCode = codeEditor.getValue();
    codepath = $("#codepath").html();
    CodeMirror.signal(codeEditor, "change");
    socket.emit("execute", { codetype: codetype, codepath: codepath, codetext: saveCode });
  }

  execute.classList.add("disabled");
  stop.classList.remove("disabled");
  execute.disabled = true;
  stop.disabled = false;
  $("#respath").text($("#codepath").html());

  usedata[codetype]["execute"]++;
  localStorage.setItem("usedata", JSON.stringify(usedata));
});

stop.addEventListener("click", () => {
  socket.emit("stop");
  stop.disabled = true;
});

socket.on("update_file_manager", (d) => {
  CURRENT_DIR = "path" in d?d["path"].split("/"):CURRENT_DIR;
  $('#path').text( CURRENT_DIR.join("/"));
  $("#fm_table > tbody").empty();

  let data;
  if ($("#hiddenfile").is(":checked") == false) {
   data = [];
   for (let i = 0; i < d['data'].length; i++)
     if (d['data'][i].name[0] != ".")
       data.push(d['data'][i])
  }
  else {
    data = d['data'];
  }

  data.unshift({name:"..", type:""});
  for (let i = 0; i < data.length; i++) {
    $("#fm_table > tbody").append(
      $("<tr>")
        .append(
          $("<td style='width:30px;text-align:center'>").append(`<i class='fa-solid fa-${data[i].type}'></i>`),
          $("<td>").append(data[i].name)
            .hover(
              function () { $(this).animate({ opacity: "0.3" }, 100); $(this).css("cursor", "pointer"); },
              function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
            )
            .click( function() {
              let idx = $(this).closest('tr').index();
              let type = $(`#fm_table tr:eq(${idx}) td:eq(0)`).html()
              let name = $(`#fm_table tr:eq(${idx}) td:eq(1)`).html()

              if (name == "..") {
                if (CURRENT_DIR.length < 4) {
                  alert("더이상 상위 폴더로 이동할 수 없습니다.");
                  return;
                }
                CURRENT_DIR.pop();
                socket.emit("load_directory", CURRENT_DIR.join("/"));
              }
              else if (type.includes("folder")) {
                CURRENT_DIR.push(name);
                socket.emit("load_directory", CURRENT_DIR.join("/"));
              }
              else if (type.includes("file")){
                let ext = name.split(".");
                ext = ext[ext.length-1];
                let filepath = CURRENT_DIR.join("/") + "/" + name;

                if(confirm(`${filepath} 파일을 불러오시겠습니까?`) == false) return;
                if (["jpg", "png", "jpeg"].includes(ext.toLowerCase())) {
                  socket.emit("view", filepath);
                }
                else if(["wav", "mp3"].includes(ext.toLowerCase())) {
                  socket.emit("play", filepath);
                }
                else {
                  let codetype = "";
                  codeTypeBtns.forEach((el) => {
                    if (el.classList.value.includes("checked")) codetype = el.name;
                  });
                  if (codetype == "block") {
                    // if(["json"].includes(ext.toLowerCase()) == false) {
                    //   alert("json 파일만 로드 가능합니다.");
                    //   return;
                    // }
                    if (saveBlock != JSON.stringify(Blockly.serialization.workspaces.save(workspace))) {
                      if(confirm(`${$("#codepath").html()} 파일의 내용을 저장하지 않았습니다. 저장하시겠습니까?`))
                        socket.emit("save", { codepath: $("#codepath").html(), codetext: JSON.stringify(Blockly.serialization.workspaces.save(workspace)) });
                    }
                  }
                  else {
                    if(saveCode != codeEditor.getValue()){
                      if(confirm(`${$("#codepath").html()} 파일의 내용을 저장하지 않았습니다. 저장하시겠습니까?`))
                        socket.emit("save", { codepath: $("#codepath").html(), codetext: codeEditor.getValue() });
                    }
                  }
                  socket.emit("load", filepath);
                }
              }
            })
            ,
            $("<td style='width:30px;text-align:center'>").append(["", "folder"].includes(data[i].type) || data[i].protect==true?"":`<a href='/download?filename=${data[i].name}'><i class='fa-solid fa-circle-down'></i></a>`)
              .hover(
                function () { $(this).animate({ opacity: "0.3" }, 100); },
                function () { $(this).animate({ opacity: "1" }, 100); }
              )
            ,
            $("<td style='width:30px;text-align:center'>").append([""].includes(data[i].type) || data[i].protect==true?"":"<i class='fa-solid fa-trash-can'></i>")
              .hover(
                function () { $(this).animate({ opacity: "0.3" }, 100); $(this).css("cursor", "pointer"); },
                function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
              )
              .click(function () {
                if ($(this).html() == "") return;

                let idx = $(this).closest('tr').index();
                //let type = $(`#fm_table tr:eq(${idx}) td:eq(0)`).html();
                let name = $(`#fm_table tr:eq(${idx}) td:eq(1)`).html();

                if (confirm(`${CURRENT_DIR.join("/")}/${name} 파일 또는 폴더를 삭제하시겠습니까?`)) {
                  if ((CURRENT_DIR.join("/") + "/" + name) == $("#codepath").html()) {
                    $("#codepath").html("");
                    let codetype = "";
                    codeTypeBtns.forEach((el) => {
                      if (el.classList.value.includes("checked")) codetype = el.name;
                    });
                    if (codetype == "block") {
                      saveBlock = "{}";
                      Blockly.serialization.workspaces.load(JSON.parse(saveBlock), workspace);
                    }
                    else {
                      saveCode = "";
                      codeEditor.setValue(saveCode);
                    }
                  }
                  socket.emit('delete', CURRENT_DIR.join("/") + "/" + name);
                }
              })
            ,
        )
    );
  }
});

$("#hiddenfile").on("change", () => {
  socket.emit("load_directory", CURRENT_DIR.join("/"));
});

$("#add_directory").on("click", () => {
  let name = prompt("새폴더의 이름을 적어주세요.");
  if (name != null) {
    if(name == "") {
      alert("새폴더의 이름을 적어주세요.");
      return;
    }
    name = name.trim()//.replace(/ /g, "_");
    if(name.length > MAX_FILENAME_LENGTH) {
      alert(`폴더 이름이 너무 깁니다. (${MAX_FILENAME_LENGTH}자 이내로 작성해주세요.)`);
      return;
    }

    socket.emit('add_directory', CURRENT_DIR.join("/") + "/"+ name);
  }
});

$("#log").on("click", () => {
  $("#result").slideToggle();
});

$("#add_file").on("click", () => {
  let name = prompt("새파일의 이름을 적어주세요.");
  if (name != null ) {
    if(name == "") {
      alert("새파일의 이름을 적어주세요.");
      return;
    }

    name = name.trim()//.replace(/ /g, "_");
    if(name.length > MAX_FILENAME_LENGTH) {
      alert(`파일 이름이 너무 깁니다. (${MAX_FILENAME_LENGTH}자 이내로 작성해주세요.)`);
      return;
    }
    if(saveCode != codeEditor.getValue()){
      if(confirm(`${$("#codepath").html()} 파일의 내용을 저장하지 않았습니다. 저장하시겠습니까?`))
        socket.emit("save", { codepath: $("#codepath").html(), codetext: codeEditor.getValue() });
    }
    socket.emit('add_file', CURRENT_DIR.join("/") + "/"+ name);
  }
});

$("#upload").on("change", (e) => {
  if($("#upload")[0].files[0].name.length > MAX_FILENAME_LENGTH) {
    alert(`파일 이름이 너무 깁니다. (${MAX_FILENAME_LENGTH}자 이내로 작성해주세요.)`);
    return;
  }

  let formData = new FormData();
  formData.append('data', $("#upload")[0].files[0]);
  $("#upload").val("");
  $.ajax({
    url: `/upload`,
    type:'post',
    data: formData,
    contentType: false,
    processData: false
  })
  .always((xhr, status) => {
    if (status == "success") {
      alert(`파일 전송이 완료되었습니다.`);
    } else {
      alert(`파일 전송 에러입니다.\n >> ${xhr.responseJSON["result"]}`);
      $("#upload").val("");
    }
  });
});

$("#eraser").on("click", () => {
  // if ($("#terminal_check").is(":checked")) {
  //   $("#terminal").prop("src", `http://${location.hostname}:50001`);
  // }
  // else {
    result.value = "";
    $("#respath").text("");
  // }
});
window.dispatchEvent(new Event('onresize'));
window.onresize = () => {
  if ($("#result_check").is(":checked")) {

    if (window.innerWidth < 1130) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 35px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 35px)';
    }
    else if (window.innerWidth >= 1130 && window.innerWidth < 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
    else if(window.innerWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(60vw - 190px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(60vw - 190px)';
    }
  }
  else {
    if (window.innerWidth < 1130) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 35px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 35px)';
    }
    else if (window.innerWidth >= 1130 && window.innerWidth < 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
    else if(window.innerWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
  }
}

$("#result_check").on("change", ()=> {
  //codeEditor.setSize(700, null);
  if ($("#result_check").is(":checked")) {
    $("#result_en").show();
    if(document.body.offsetWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(60vw - 190px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(60vw - 190px)';
    }
  }
  else {
    $("#result_en").hide();
    if(document.body.offsetWidth >= 1530) {
      document.querySelector("div.CodeMirror").style.width = 'calc(100vw - 370px)';
      document.querySelector("#blocklyDiv").style.width = 'calc(100vw - 370px)';
    }
  }
  codeEditor.refresh();
  Blockly.svgResize(workspace);
});

// $("#terminal").prop("src", `http://${location.hostname}:50001`);
// $("#terminal_check").on("change", ()=> {
//   if ($("#terminal_check").is(":checked")) {
//     $("#result").hide();
//     $("#terminal").show();
//   }
//   else {
//     $("#result").show();
//     $("#terminal").hide();
//   }
// });

$("#home_bt").on("click", () => {
  if (confirm("Tools로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)")) {
    location.href = `http://${location.hostname}` + (userid == null?'':`/?userid=${userid}`);
  }
});

$("#home_bt").hover(
  function () { $(this).animate({ opacity: "0.7" }, 100); $(this).css("cursor", "pointer"); },
  function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
);

$("#theme_check").on("change", () => {
  codeEditor.setOption(
    "theme",
    $("#theme_check").is(":checked")?"cobalt":"duotone-light"
  );
});

let workspace = Blockly.inject("blocklyDiv", {
  toolbox: toolbox,
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: "start",
  css: true,
  media: "../static/",
  rtl: false,
  scrollbars: true,
  sounds: false,
  oneBasedIndex: true,
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ccc',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: false,
    startScale: 0.8,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.05,
    pinch: true
  },
  move:{
    scrollbars: {
      horizontal: true,
      vertical: true
    },
    drag: true,
    wheel: true,
  },
  renderer:"zelos", // "zelos", "minimalist", "thrasos"
});

$("#save").on("click", () => {
  let filepath = $("#codepath").html();

  if (filepath == "") {
    alert("파일이 없습니다.");
    return;
  }
  let codetype = "";
  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });
  if (codetype == "block") {
    // if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
    //   alert("json 파일만 저장 가능합니다.");
    //   return;
    // }
    saveBlock = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
    socket.emit("save", {
      codepath: "/home/pi/blockly.py",
      codetext: Blockly.Python.workspaceToCode(workspace) });
    socket.emit("save", { 
      codepath: $("#codepath").html(), 
      codetext: saveBlock 
    });
    result.value = Blockly.Python.workspaceToCode(workspace);
    update_block();
  }
  else {
    codeTypeBtns.forEach((el) => {
      if (el.classList.value.includes("checked")) codetype = el.name;
    });

    saveCode = codeEditor.getValue();
    CodeMirror.signal(codeEditor, "change");
    socket.emit("save", { codepath: $("#codepath").html(), codetext: saveCode });
  }
});

let update_block = () => {
  $("#codecheck").html(saveBlock==JSON.stringify(Blockly.serialization.workspaces.save(workspace)) ? "" : "<i class='fa-solid fa-circle'></i>");
}
workspace.addChangeListener ((event)=>{
  if (event.type = Blockly.Events.BLOCK_CHANGE) {
    update_block();
  }
});

$(document).keydown((evt)=> {
  if((evt.which == '115' || evt.which == '83') && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      let filepath = $("#codepath").html();

      if (filepath == "") {
        alert("파일이 없습니다.");
        return;
      }
      let codetype = "";
      codeTypeBtns.forEach((el) => {
        if (el.classList.value.includes("checked")) codetype = el.name;
      });
      if (codetype == "block") {
        // if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
        //   alert("json 파일만 저장 가능합니다.");
        //   return;
        // }
        saveBlock = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
        socket.emit("save", {
          codepath: "/home/pi/blockly.py",
          codetext: Blockly.Python.workspaceToCode(workspace) });
        socket.emit("save", {
          codepath: $("#codepath").html(),
          codetext: saveBlock
        });
        result.value = Blockly.Python.workspaceToCode(workspace);
        update_block();
      }
      else {
        codeTypeBtns.forEach((el) => {
          if (el.classList.value.includes("checked")) codetype = el.name;
        });
        saveCode = codeEditor.getValue();
        CodeMirror.signal(codeEditor, "change");
        socket.emit("save", { codepath: $("#codepath").html(), codetext: saveCode });
      }
      return false;
  }
  return true;
});

$("#showWifi").on("click", ()=>{
  document.getElementById("loginPopup").style.display = "none";
  document.getElementById("usedataPopup").style.display = "none";

  $("#wifi_list > tbody").empty();
  $("#wifi_list > tbody").append(
    $("<tr>")
    .append(
      $("<td colspan='4'>").append("Scanning...")
    )
  )
  $.ajax({
    url: `http://${location.hostname}/wifi_scan`,
  }).always((xhr, status) => {
    if (status == "success") {
      data = xhr
      $("#wifi_list > tbody").empty();
      for (let i = 0; i < data.length; i++) {
        $("#wifi_list > tbody").append(
          $("<tr>")
            .append(
              $("<td>").append(data[i].essid),
              $("<td>").append(`${data[i].quality} / ${data[i].dBm}dBm`),
              $("<td>").append(data[i].encryption)
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
              let lst = $(this).children();
              $("#ssid").val(lst.eq(0).text());
              $("#psk").val("");
              if(lst.eq(2).text() == "off") {
                $("#enctype_open").prop("checked", true);
                $("#psk").prop("disabled", true);
              }
              else {
                $("#enctype_open").prop("checked", false);
                $("#psk").prop("disabled", false);
              }
            })
        );
      }
    } else {
      //
    }
  });
  document.getElementById("wifiPopup").style.display = "block";
});

$("#hidewifi").on("click", ()=>{
  document.getElementById("wifiPopup").style.display = "none";
});

$.ajax({
  url: `http://${location.hostname}/wifi`,
}).always((xhr, status) => {
  if (status == "success") {
    $("#ssid").val(xhr["ssid"]);
    $("#psk").val(xhr["psk"]);
    if(xhr["psk"] == "") {
      $("#enctype_open").prop("checked", true);
      $("#psk").prop("disabled", true);
    }
    else {
      $("#enctype_open").prop("checked", false);
      $("#psk").prop("disabled", false);
    }
  } else {
    //
  }
});

$("#current_wifi").on("click", ()=> {
  $.ajax({
    url: `http://${location.hostname}/wifi`,
  }).always((xhr, status) => {
    if (status == "success") {
      $("#ssid").val(xhr["ssid"]);
      $("#psk").val(xhr["psk"]);
      if(xhr["psk"] == "") {
        $("#enctype_open").prop("checked", true);
        $("#psk").prop("disabled", true);
      }
      else {
        $("#enctype_open").prop("checked", false);
        $("#psk").prop("disabled", false);
      }
    } else {
      //
    }
  });
});

$("#wifi_bt").on("click", function () {
  let comment = "로봇의 Wifi 정보를 변경하시겠습니까?";
  comment += "\n\nWifi 이름: " + $("#ssid").val().trim();
  comment += "\n비밀번호: " + $("#psk").val().trim();
  comment += "\n암호화방식: " + ($("#psk").val().trim()==""?"OPEN":"WPA-PSK");
  comment += "\n\nWifi 정보를 한번 더 확인하시기 바랍니다.";
  comment += "\n(잘못된 정보 입력 시, 심각한 오류가 발생할 수 있습니다.)";
  if (confirm(comment)) {
    $.ajax({
      url: `http://${location.hostname}/wifi`,
      type: "post",
      data: JSON.stringify({ssid:$("#ssid").val().trim(), psk:$("#psk").val().trim()}),
      contentType: "application/json",
    }).always((xhr, status) => {
      if (status == "success") {
      } else {
        alert("WPA-PSK 방식에서는 비밀번호가 8자리 이상이어야 합니다.")
      }
    });
  }
});

$(document).on("click keydown", (evt) => {
  if (["click", "keydown"].includes(evt.type)) {
    let codetype = "";
    codeTypeBtns.forEach((el) => {
      if (el.classList.value.includes("checked")) codetype = el.name;
    });
    usedata[codetype][evt.type]++;
  }
});

$.ajax({
  url: `http://${location.hostname}/account`,
}).always((xhr, status) => {
  if (status == "success") {
    $("#logined_id").html(xhr['username']);
    $("#username").val(xhr['username']);
    $("#password").val(xhr['password']);
    if (xhr['username'] == "" || xhr['password'] == "") $("#userinfo").html('<i class="fa-solid fa-user-xmark"></i>');
    else $("#userinfo").html('<i class="fa-solid fa-user"></i>');
  } else {
    $("#userinfo").html('<i class="fa-solid fa-user-xmark"></i>');
  }
});

let startTime = new Date().getTime();

window.addEventListener('beforeunload', (evt) => {
  usedata["staytime"] = parseInt((new Date().getTime() - startTime) / 1000);
  let codetype = "";
  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });
  usedata[codetype]["staytime"] += parseInt((new Date().getTime() - startTime_item) / 1000);
  $.ajax({
    url: `http://${location.hostname}/usedata/ide`,
    type: "post",
    data: JSON.stringify(usedata),
    contentType: "application/json",
  }).always((xhr, status) => {
    if (status == "success") {
      usedata = init_usedata;
    } else {
      alert(`usedata 에러입니다.\n >> ${xhr.responseJSON["result"]}`);
    }
  });
  socket.emit("stop");
});

$("#showLogin").on("click", ()=>{
  document.getElementById("loginPopup").style.display = "block";
  document.getElementById("wifiPopup").style.display = "none";
  document.getElementById("usedataPopup").style.display = "none";
});

$("#hideLogin").on("click", ()=>{
  document.getElementById("loginPopup").style.display = "none";
});

$("#login").on("click", ()=>{
  const username = $("#username").val().trim();
  const password = $("#password").val().trim();

  // Check if username and password are not empty
  if (username === "" || password === "") {
    alert("Please enter username and password.");
    return;
  }

  $.ajax({
    url: `http://${location.hostname}/account`,
    type: "post",
    data: JSON.stringify({username:username, password:password}),
    contentType: "application/json",
  }).always((xhr, status) => {
    if (status == "success") {
      alert(`로그인 성공.`);
      $("#logined_id").html(xhr['username']);
      $("#username").val(xhr['username']);
      $("#password").val(xhr['password']);
      $("#userinfo").html('<i class="fa-solid fa-user"></i>');
    } else {
      alert(`로그인 에러.\n >> ${xhr.responseJSON["result"]}`);
    }
  });

  // Here you can add your own authentication logic
  // For example, you can send an AJAX request to your server and validate the credentials
  usedata = init_usedata; // from server
  document.getElementById("loginPopup").style.display = "none";    
});

$("#user_bt").on("click", () => {
  if(confirm("로그아웃 하시겠습니까?")){
      $.ajax({
        url: `http://${location.hostname}/account`,
        type: "post",
        data: JSON.stringify({username:"", password:""}),
        contentType: "application/json",
      }).always((xhr, status) => {
        if (status == "success") {
          alert(`로그아웃 성공.`);
          $("#logined_id").html(xhr['username']);
          $("#username").val(xhr['username']);
          $("#password").val(xhr['password']);
          $("#userinfo").html('<i class="fa-solid fa-user-xmark"></i>');
          document.getElementById("loginPopup").style.display = "none";
          $.ajax({
            url: `http://${location.hostname}/usedata/ide`,
            type: "post",
            data: JSON.stringify(usedata),
            contentType: "application/json",
          }).always((xhr, status) => {
            if (status == "success") {
              usedata = init_usedata;
            } else {
              alert(`usedata 에러입니다.\n >> ${xhr.responseJSON["result"]}`);
            }
          });
        } else {
          alert(`로그아웃 에러.\n >> ${xhr.responseJSON["result"]}`);
        }
    });
  }
});

$("#usedata_bt").on("click", ()=> {
  document.getElementById("loginPopup").style.display = "none";
  document.getElementById("wifiPopup").style.display = "none";

  $.ajax({
    url: `http://${location.hostname}/usedata/ide`,
    type: "post",
    data: JSON.stringify(usedata),
    contentType: "application/json",
  }).always((xhr, status) => {
    if (status == "success") {
      $("#usedata_json").JSONView(xhr, {collapsed:true});
      usedata = init_usedata;
    } else {
      alert(`usedata 에러입니다.\n >> ${xhr.responseJSON["result"]}`);
    }
  });
  document.getElementById("usedataPopup").style.display = "block";
});

$("#hideUsedata").on("click", ()=>{
  document.getElementById("usedataPopup").style.display = "none";
});

$('#password_check').on('click',function(){
  $('#password_check').toggleClass('active');
  $('#password').prop('type', $('#password_check').hasClass('active')?"text":"password");
});

$('#psk_check').on('click',function(){
  $('#psk_check').toggleClass('active');
  $('#psk').prop('type', $('#psk_check').hasClass('active')?"text":"password");
});

$('#ssid_en').on('click', function(){
  $("#ssid").prop("disabled", $("#ssid_en").is(":checked")?false:true);
});

$("#enctype_open").on('click', function(){
  if($("#enctype_open").is(":checked")){
    $("#psk").val("");
    $("#psk").prop("disabled", true);
  }
  else{
    $("#psk").prop("disabled", false);
  }
});