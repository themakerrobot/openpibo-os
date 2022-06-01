let save_code = '';
const socket = io();
const codeMirrorMode = {'python':'python', 'nodejs':'javascript', 'shell':'shell'};
const filePath = {'python':'/home/pi/code/test.py', 'nodejs':'/home/pi/code/test.js', 'shell':'/home/pi/code/test.sh'};
   
const codetypes = document.querySelectorAll('input[name=codetype]');
const codepath = document.getElementById('codepath');
const codecheck = document.getElementById('codecheck');
const update = document.getElementById('update');
const imgpath = document.getElementById('imgpath');

const editor = CodeMirror.fromTextArea(
  document.getElementById('codemirror-code'),
  {
    "lineNumbers": "true",
    "mode": codeMirrorMode['python'],
    "theme": "cobalt",
    "extraKeys": {
      "Ctrl-S": function(instance) {
        save_code = editor.getValue(); 
        CodeMirror.signal(editor, 'change');
        socket.emit("save", {'path':codepath.value, 'text': save_code})
      },
    }
  }
);

socket.on('update', function(data){
  if('code' in data){
    save_code = data['code'];
    editor.setValue(save_code);
  }

  if('image' in data){
    const image = document.getElementById('image');
    image.src = "data:image/jpeg;charset=utf-8;base64," + data['image'];
    image.height="240";
  }

  if('record' in data){
    update.value = data['record'];
    update.scrollTop = update.scrollHeight;
  }
});

socket.emit('init');
socket.on('init', (d) => {
  editor.setOption('mode', codeMirrorMode[d['type']]);
  save_code = d['text'];
  editor.setValue(save_code);
  document.getElementById(d['type']).checked = true;
  codepath.value = d['path'];
});

socket.emit("system");
setInterval(function () {
  socket.emit("system");
}, 10000);

socket.on("system", function (data) {
  document.getElementById("s_serial").textContent = data[0];
  document.getElementById("s_os_version").textContent = data[1];
  document.getElementById("s_runtime").textContent = Math.floor(data[2] / 3600) + " Hours";
  document.getElementById("s_cpu_temp").textContent = data[3];
  document.getElementById("s_memory").textContent = Math.floor((data[5] / data[4] / 4) * 100) + " %";
  document.getElementById("s_network").textContent = data[6] + "/" + data[7].replace("\n", "");
});

codetypes.forEach(codetype => {
  codetype.addEventListener('change', () => {
    editor.setOption('mode', codeMirrorMode[codetype.value]);
    codepath.value = filePath[codetype.value];
  });
});

editor.on('change', () => {
  codecheck.textContent = (save_code == editor.getValue())?'':'●';
});

document.getElementById('load').addEventListener('click', () => {
  let comment = "[THE MAKER] 아래 파일을 불러오겠습니까?";
  comment += "\n=========================================";
  comment += "\nFile: " + codepath.value;
  
  if(confirm(comment)){
    socket.emit('load', codepath.value);
  }
});

document.getElementById('compile').addEventListener('click', () => {
  update.value = '';
  save_code = editor.getValue();
  CodeMirror.signal(editor, 'change');
  
  socket.emit('compile', {
    'type':document.querySelector('input[name=codetype]:checked').value,
    'path':codepath.value,
    'text':save_code,
  });
});

document.getElementById('view').addEventListener('click', () => {
  socket.emit('view', imgpath.value);
});

document.getElementById('stop').addEventListener('click', () => {
  socket.emit('stop', codepath.value);
});

document.getElementById('tool_bt').addEventListener('click', () => {
  window.location.replace('http://'+window.location.hostname + ':80');
});
