let PATH;
let save_code = "";
const socket = io();
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

const max_filename_length = 30;

const execute = document.getElementById("execute");
const stop = document.getElementById("stop");
const codeTypeBtns = document.querySelectorAll("div[name=codetype] button");
const result = document.getElementById("result");

const editor = CodeMirror.fromTextArea(
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
        save_code = editor.getValue();
        CodeMirror.signal(editor, "change");
        socket.emit("save", { codepath: $("#codepath").html(), codetext: save_code });
      },
    },
  }
);

$("#logo_bt").on("click", () => {
  if (confirm("Tools로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)"))
    window.location.replace(`http://${window.location.hostname}:80`);
});

$("#fontsize").on("change", () => {
  document.querySelector("div.CodeMirror").style.fontSize = `${$("#fontsize").val()}px`;
  editor.refresh();
});

socket.on("update", (data) => {
  if ("code" in data) {
    save_code = data["code"];
    editor.setValue(save_code);
  }

  if ("image" in data) {
    $("#image").attr("src", `data:image/jpeg;charset=utf-8;base64,${data["image"]}`);
  }

  if ("audio" in data) {
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
  save_code = d["codetext"];
  editor.setValue(save_code);

  codeTypeBtns.forEach((el) => {
    if (el.name == "python") el.classList.add("checked");
    else el.classList.remove("checked");
  });

  $("#codepath").text(d["codepath"]);
  PATH = d["path"].split("/");
  socket.emit("load_directory", PATH.join("/"));
});

socket.emit("system");
setInterval(() => {
  socket.emit("system");
}, 10000);

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
    editor.setOption("mode", codeMirrorMode[target.name]);
  };
  btn.addEventListener("click", handler);
});

editor.on("change", () => {
  $("#codecheck").html(save_code==editor.getValue() ? "" : "<i class='fa-solid fa-circle'></i>");
});

execute.addEventListener("click", () => {
  if ($("#codepath").html() == "") {
    alert("파일이 없습니다.");
    return;
  }

  let codetype = "";  
  result.value = "";
  save_code = editor.getValue();
  CodeMirror.signal(editor, "change");
  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });

  if(codetype == 'html') {
    alert("html모드는 저장만 가능합니다.");
    socket.emit("save", { codepath: $("#codepath").html(), codetext: save_code });
    return;
  }

  socket.emit("execute", { codetype: codetype, codepath: $("#codepath").html(), codetext: save_code });
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
  $('#path').text(PATH.join("/"));
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
                if (PATH.length < 4) {
                  alert("더이상 상위 폴더로 이동할 수 없습니다.");
                  return;
                }
                PATH.pop();
                socket.emit("load_directory", PATH.join("/"));
              }
              else if (type.includes("folder")) {
                PATH.push(name);
                socket.emit("load_directory", PATH.join("/"));
              }
              else if (type.includes("file")){
                let ext = name.split(".");
                ext = ext[ext.length-1];
                let filepath = PATH.join("/") + "/" + name;

                if (["jpg", "png", "jpeg"].includes(ext.toLowerCase())) {
                  $("#imgpath").text(filepath);
                  socket.emit("view", filepath);
                }
                else if(["wav", "mp3"].includes(ext.toLowerCase())) {
                  $("#imgpath").text(filepath);
                  socket.emit("play", filepath);
                }
                else {
                  $("#codepath").html(filepath);
                  socket.emit("load", filepath);
                }
              }
              else {}
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

                if (confirm(`${PATH.join("/")}/${name} 파일 또는 폴더를 삭제하시겠습니까?`)) {
                  if ((PATH.join("/") + "/" + name) == $("#codepath").html()) {
                    $("#codepath").html("")
                    save_code = "";
                    editor.setValue(save_code);
                  }
                  socket.emit('delete', PATH.join("/") + "/" + name);
                }
              })
            ,
        )
    );
  }
});

$("#hiddenfile").on("change", () => {
  socket.emit("load_directory", PATH.join("/"));
});

$("#add_directory").on("click", () => {
  let name = prompt("새폴더의 이름을 적어주세요.(이름 안의 공백은 '_' 으로 변경됩니다.)");
  if (name != null) {
    if(name == "") {
      alert("새폴더의 이름을 적어주세요.");
      return;
    }
    name = name.trim().replace(/ /g, "_");
    if(name.length > max_filename_length) {
      alert(`폴더 이름이 너무 깁니다. (${max_filename_length}자 이내로 작성해주세요.)`);
      return;
    }

    socket.emit('add_directory', PATH.join("/") + "/"+ name);
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
    if(name.length > max_filename_length) {
      alert(`파일 이름이 너무 깁니다. (${max_filename_length}자 이내로 작성해주세요.)`);
      return;
    }

    $("#codepath").html(PATH.join("/") + "/" + name);
    socket.emit('add_file', PATH.join("/") + "/"+ name);
  }
});

$("#upload").on("change", (e) => {
  if($("#upload")[0].files[0].name.length > max_filename_length) {
    alert(`파일 이름이 너무 깁니다. (${max_filename_length}자 이내로 작성해주세요.)`);
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
    alert(`파일 전송이 완료되었습니다. ${status}`);
  });
});

$("#eraser").on("click", () => {
  result.value = "";
  $("#respath").text("");
});

$("#result_check").on("change", ()=> {
  if ($("#result_check").is(":checked")) {
    $("#result_en").show();
    editor.setSize(700, null);
  }
  else {
    $("#result_en").hide();
    editor.setSize("72.26vw", null); 
  }
});

$("#home_bt").on("click", () => {
  if (confirm("Tools로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)"))
    window.location.replace(`http://${window.location.hostname}:80`);
});
$("#home_bt").hover(
  function () { $(this).animate({ opacity: "0.7" }, 100); $(this).css("cursor", "pointer"); },
  function () { $(this).animate({ opacity: "1" }, 100); $(this).css("cursor", "default");}
);

$("#theme_check").on("change", () => {
  editor.setOption(
    "theme",
    $("#theme_check").is(":checked")?"cobalt":"duotone-light"
  );
});