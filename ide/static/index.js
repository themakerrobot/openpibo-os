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
fontsize.addEventListener("click", () => {
  document.querySelector("div.CodeMirror").style.fontSize = fontsize.value + 'px';
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
  let comment = "아래 파일을 불러오겠습니까?(파일이 없으면 생성됩니다.)";
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
  socket.emit("stop");
  stop.disabled = true;
});

document.getElementById("view").addEventListener("click", () => {
  let comment = "아래 사진을 불러오겠습니까?";
  comment += "\n파일이름: " + imgpath.value;

  if (confirm(comment)) {
    socket.emit("view", imgpath.value);
  }
});

document.getElementById("example1").addEventListener("click", () => {
  save_code =
'\
import time\n\
from openpibo.device import Device\n\
\n\
device = Device()\n\
\n\
device.send_cmd(Device.code_list["NEOPIXEL_EACH"], "255,0,0,255,0,0")\n\
time.sleep(1)\n\
\n\
device.send_cmd(Device.code_list["NEOPIXEL_EACH"], "0,255,0,0,255,0")\n\
time.sleep(1)\n\
\n\
device.send_cmd(Device.code_list["NEOPIXEL_EACH"], "0,0,255,0,0,255")\n\
time.sleep(1)\n\
\n\
device.send_cmd(Device.code_list["NEOPIXEL_EACH"], "0,0,0,0,0,0")\n\
'
  editor.setValue(save_code);
});

document.getElementById("example2").addEventListener("click", () => {
  save_code =
'\
import time\n\
from openpibo.motion import Motion\n\
\n\
motion = Motion()\n\
\n\
motion.set_speeds([50,50,50,50,50, 50,50,50,50,50])\n\
motion.set_accelerations([10,10,10,10,10,10,10,10,10,10])\n\
\n\
motion.set_motors([0,0, 30,0, 20,0, 0,0, 20,0])\n\
time.sleep(2)\n\
\n\
motion.set_motors([0,0,-30,0,-20,0, 0,0,-20,0])\n\
time.sleep(2)\n\
\n\
motion.set_motors([0,0,-80,0,  0,0, 0,0, 80,0])\n\
time.sleep(2)\n\
'
  editor.setValue(save_code);
});

document.getElementById("example3").addEventListener("click", () => {
  save_code =
'\
from openpibo.vision import Camera\n\
from openpibo.vision import Detect\n\
\n\
camera = Camera()\n\
detect = Detect()\n\
\n\
img = camera.read()\n\
items = detect.detect_object(img)\n\
\n\
for item in items:\n\
	x1,y1,x2,y2 = item["position"]\n\
	colors = (100, 100, 200)\n\
	camera.rectangle(img, (x1,y1), (x2, y2), colors, 1)\n\
	camera.putText(img, item["name"], (x1-10, y1-10), 0.6, colors, 2)\n\
	print(obj)\n\
\n\
camera.imwrite("/home/pi/code/test.jpg", img)\n\
\n\
print("이미지보기의 파일경로에 /home/pi/code/test.jpg를 입력하고")\n\
print("불러오기를 클릭하세요.")\n\
'
  editor.setValue(save_code);
});

document.getElementById("example4").addEventListener("click", () => {
  save_code =
'\
from openpibo.oled import Oled\n\
\n\
oled = Oled()\n\
\n\
x, y = 10, 10\n\
text1 = "안녕하세요."\n\
text2 = "Oled 예제입니다."\n\
\n\
oled.set_font(size=15)\n\
\n\
oled.clear()\n\
oled.draw_text((x, y), text1)\n\
\n\
oled.draw_text((x, y+25), text2)\n\
\n\
oled.show()\n\
'
  editor.setValue(save_code);
});

document.getElementById("example5").addEventListener("click", () => {
  save_code =
'\
from openpibo.speech import Speech\n\
from openpibo.audio import Audio\n\
\n\
speech = Speech()\n\
audio = Audio()\n\
\n\
speech.tts("<speak>안녕하세요. 음성합성 예제입니다.</speak>", "test.mp3")\n\
audio.play(filename="test.mp3", volume=80, background=False)\n\
'
  editor.setValue(save_code);
});

document.getElementById("home_bt").addEventListener("click", () => {
  if (confirm("Tools로 이동하시겠습니까?(저장하지 않은 정보는 손실됩니다.)"))
    window.location.replace("http://" + window.location.hostname + ":80");
});
