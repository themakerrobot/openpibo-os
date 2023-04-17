const MAX_FILENAME_LENGTH = 30;
const codeMirrorMode = {
  python: "python",
  html: {
        name: "htmlmixed",
        scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                       mode: null},
                      {matches: /(text|application)\/(x-)?vb(a|script)/i,
                       mode: "vbscript"}]
  },
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
    location.replace(`http://${location.hostname}:80`);
});

$("#fontsize").on("change", () => {
  document.querySelector("div.CodeMirror").style.fontSize = `${$("#fontsize").val()}px`;
  codeEditor.refresh();
});

socket.on("update", (data) => {
  if ("code" in data) {
    $("#codepath").html(data["filepath"]);
    if ($("#blockly_check").is(":checked") ) {
      saveBlock = data["code"];
      try {
        Blockly.serialization.workspaces.load(JSON.parse(saveBlock), workspace);
        update_block();
      }
      catch(e) {
        //alert("블록 데이터를 불러오지 못했습니다.");
        //saveBlock = "{}";
        Blockly.serialization.workspaces.load(JSON.parse("{}"), workspace);
      }
    }
    else {      
      saveCode = data["code"];
      codeEditor.setValue(saveCode);
    }
  }

  if ("image" in data) {
    $("#mediapath").html(data["filepath"]);
    $("#image").attr("src", `data:image/jpeg;charset=utf-8;base64,${data["image"]}`);
  }

  if ("audio" in data) {
    $("#mediapath").html(data["filepath"]);
    $("#audio").attr("src", `data:audio/mpeg;charset=utf-8;base64,${data["audio"]}`);
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
});

codeTypeBtns.forEach((btn) => {
  const handler = (e) => {
    codeTypeBtns.forEach((el) => el.classList.remove("checked"));
    const target = e.currentTarget;
    target.classList.add("checked");
    codeEditor.setOption("mode", codeMirrorMode[target.name]);
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

  if ($("#blockly_check").is(":checked")) {
    if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
      alert("json 파일만 실행 가능합니다.");
      return;
    }
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
    codeTypeBtns.forEach((el) => {
      if (el.classList.value.includes("checked")) codetype = el.name;
    });

    if(codetype == 'html') {
      alert("html모드는 저장만 가능합니다.");
      socket.emit("save", { codepath: $("#codepath").html(), codetext: saveCode });
      return;
    }
    socket.emit("execute", { codetype: codetype, codepath: codepath, codetext: saveCode });
  }

  execute.classList.add("disabled");
  stop.classList.remove("disabled");
  execute.disabled = true;
  stop.disabled = false;
  $("#respath").text($("#codepath").html());
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
                  if ($("#blockly_check").is(":checked")) {
                    if(["json"].includes(ext.toLowerCase()) == false) {
                      alert("json 파일만 로드 가능합니다.");
                      return;
                    }
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
                    if ($("#blockly_check").is(":checked")) {
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
  let name = prompt("새폴더의 이름을 적어주세요.(이름 안의 공백은 '_' 으로 변경됩니다.)");
  if (name != null) {
    if(name == "") {
      alert("새폴더의 이름을 적어주세요.");
      return;
    }
    name = name.trim().replace(/ /g, "_");
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
  let name = prompt("새파일의 이름을 적어주세요.(이름 안의 공백은 '_' 으로 변경됩니다.)");
  if (name != null ) {
    if(name == "") {
      alert("새파일의 이름을 적어주세요.");
      return;
    }

    name = name.trim().replace(/ /g, "_");
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
  if ($("#terminal_check").is(":checked")) {
    $("#terminal").attr("src", `http://${location.hostname}:50001`);
  }
  else {
    result.value = "";
    $("#respath").text("");
  }
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

$("#terminal").attr("src", `http://${location.hostname}:50001`);
$("#terminal_check").on("change", ()=> {
  if ($("#terminal_check").is(":checked")) {
    $("#result").hide();
    $("#terminal").show();
  }
  else {
    $("#result").show();
    $("#terminal").hide();
  }
});

$("#home_bt").on("click", () => {
  if (confirm("Tools로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)"))
    location.replace(`http://${location.hostname}:80`);
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
    startScale: 0.9,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
    pinch: true
  },
});

$("#blockly_check").on("change", () => {
  if ($("#blockly_check").is(":checked")) {
    alert("주의!) 저장할 파일은 먼저 선택해주세요.");
    $("#codeDiv").hide();
    $("#blocklyDiv").show();
    CODE_PATH = $("#codepath").html();
    $("#codepath").html(BLOCK_PATH);
  }
  else {
    $("#blocklyDiv").hide();
    $("#codeDiv").show();
    BLOCK_PATH = $("#codepath").html();
    $("#codepath").html(CODE_PATH);
  }
  Blockly.svgResize(workspace);
});

$("#save").on("click", () => {
  let filepath = $("#codepath").html();

  if (filepath == "") {
    alert("파일이 없습니다.");
    return;
  }

  if ($("#blockly_check").is(":checked")) {
    if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
      alert("json 파일만 저장 가능합니다.");
      return;
    }
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
      if ($("#blockly_check").is(":checked")) {
        if (filepath.substring(filepath.lastIndexOf(".") + 1, filepath.length) != "json") {
          alert("json 파일만 저장 가능합니다.");
          return;
        }
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
