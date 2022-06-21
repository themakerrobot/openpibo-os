let save_code = "";
const socket = io();
const codeMirrorMode = {
  python: "python",
  nodejs: "javascript",
  shell: "shell",
};
const filePath = {
  python: "/home/pi/code/test.py",
  nodejs: "/home/pi/code/test.js",
  shell: "/home/pi/code/test.sh",
};

const compile = document.getElementById("compile");
const stop = document.getElementById("stop");
const codeTypeBtns = document.querySelectorAll("div[name=codetype] button");
const codepath = document.getElementById("codepath");
const codecheck = document.getElementById("codecheck");
const update = document.getElementById("update");
const imgpath = document.getElementById("imgpath");
const home_bt = document.getElementById("home_bt");

const editor = CodeMirror.fromTextArea(
  document.getElementById("codemirror-code"),
  {
    lineNumbers: "true",
    mode: codeMirrorMode["python"],
    theme: "cobalt",
    extraKeys: {
      "Ctrl-S": function (instance) {
        save_code = editor.getValue();
        CodeMirror.signal(editor, "change");
        socket.emit("save", { path: codepath.value, text: save_code });
      },
    },
  }
);

const fontsize = document.getElementById("fontsize");
fontsize.addEventListener("input", () => {
  document.querySelector("div.codemirror.cm-s-cobalt").style.fontSize =
    fontsize.value;
  editor.refresh();
});

socket.on("update", function (data) {
  if ("code" in data) {
    save_code = data["code"];
    editor.setValue(save_code);
  }

  if ("image" in data) {
    const image = document.getElementById("image");
    image.src = "data:image/jpeg;charset=utf-8;base64," + data["image"];
    image.height = "240";
  }

  if ("record" in data) {
    update.value = data["record"];
    update.scrollTop = update.scrollHeight;
  }

  if ("dialog" in data) {
    alert(data["dialog"]);
  }

  if ("exit" in data) {
    compile.classList.remove("disabled");
    stop.classList.add("disabled");
    compile.disabled = false;
  }
});

socket.emit("init");
socket.on("init", (d) => {
  editor.setOption("mode", codeMirrorMode[d["type"]]);
  save_code = d["text"];
  editor.setValue(save_code);
  //document.getElementById(d["type"]).checked = true;
  codeTypeBtns.forEach((el) => {
    if (el.name == d["type"]) el.classList.add("checked");
    else el.classList.remove("checked");
  });
  codepath.value = d["path"];
});

socket.emit("system");
setInterval(function () {
  socket.emit("system");
}, 10000);

socket.on("system", function (data) {
  document.getElementById("s_serial").textContent = data[0];
  document.getElementById("s_os_version").textContent = data[1];
  document.getElementById("s_runtime").textContent =
    Math.floor(data[2] / 3600) + " Hours";
  document.getElementById("s_cpu_temp").textContent = data[3];
  document.getElementById("s_memory").textContent =
    Math.floor((data[5] / data[4] / 4) * 100) + " %";
  document.getElementById("s_network").textContent =
    data[6] + "/" + data[7].replace("\n", "");
});

codeTypeBtns.forEach((btn) => {
  const handler = (e) => {
    codeTypeBtns.forEach((el) => el.classList.remove("checked"));
    const target = e.currentTarget;
    target.classList.add("checked");
    editor.setOption("mode", codeMirrorMode[target.name]);
    codepath.value = filePath[target.name];
  };
  btn.addEventListener("click", handler);
});

editor.on("change", () => {
  codecheck.textContent = save_code == editor.getValue() ? "" : "●";
});

document.getElementById("load").addEventListener("click", () => {
  let comment = "[Openpibo IDE] 아래 파일을 불러오겠습니까?";
  comment += "\n파일이름: " + codepath.value;

  if (confirm(comment)) {
    socket.emit("load", codepath.value);
  }
});

compile.addEventListener("click", () => {
  let codetype = "";  
  update.value = "";
  save_code = editor.getValue();
  CodeMirror.signal(editor, "change");
  codeTypeBtns.forEach((el) => {
    if (el.classList.value.includes("checked")) codetype = el.name;
  });

  socket.emit("compile", {
    type: codetype,
    path: codepath.value,
    text: save_code,
  });
  compile.classList.add("disabled");
  stop.classList.remove("disabled");
  compile.disabled = true;
  stop.disabled = false;
});

stop.addEventListener("click", () => {
  socket.emit("stop", codepath.value);
  stop.disabled = true;
});

document.getElementById("view").addEventListener("click", () => {
  socket.emit("view", imgpath.value);
});

document.getElementById("home_bt").addEventListener("click", () => {
  window.location.replace("http://" + window.location.hostname + ":80");
});
