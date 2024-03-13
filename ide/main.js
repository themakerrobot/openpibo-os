const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const multer = require('multer');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
const http = require('http');
const port = process.argc > 2 ? Number(process.argv[2]):50000;
const codeExec = {
  python: 'python3',
  shell: 'sh',
};

const protectList = [
  '/home/pi/openpibo-os',
  '/home/pi/openpibo-files',
  '/home/pi/node_modules',
  '/home/pi/package.json',
  '/home/pi/package-lock.json',
  '/home/pi/config.json',
];

let record = '';
let ps = undefined;
let PATH = '/home/pi/code';
let codeText = '';
let codePath = '';

const sleep = (t) => {
  return new Promise(resolve=>setTimeout(resolve,t));
}

class Mutex {
  constructor() {
    this.lock = false;
  }
  async acquire() {
    while(true) {
      if (this.lock === false) break;
      await sleep(100);
    }
    this.lock = true;
  }
  release() {
    this.lock = false;
  }
}

const readDirectory = (d) => {
  let dlst = [];
  let flst = [];

  try {
    fs.readdirSync(d, {withFileTypes:true}).forEach(p => {
      if(p.isDirectory() || p.isSymbolicLink()) dlst.push({name:p.name, type:"folder", protect:isProtect(`${d}/${p.name}`)});
      else flst.push({name:p.name, type:"file", protect:(isProtect(d) || isProtect(`${d}/${p.name}`))});
    });
  }
  catch (err) {
    console.log(err);
    return false;
  }
  return dlst.concat(flst);
}

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH);
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    let name = file.originalname//.replace(/ /g, "_");
    cb(null, name);
  }
});

let storage_for_home = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/pi');
  },
  filename: function (req, file, cb) {
    cb(null, '.tmp.jpg');
  }
});

const isProtect = (p) => {
  for(idx in protectList) {
    if (p.includes(protectList[idx])) return true;
  }
  return false;
}

const execute = async(EXEC, codepath) => {
  await mutex.acquire();
  return new Promise((res, rej) => {
    //record = '[' + new Date().toString().split(' GMT')[0] + ']: $ sudo ' + EXEC + ' ' + codepath + ' >> \n\n';
    record = '[' + new Date().toString() + ']: \n\n';
    io.emit('update', {record:record});

    ps = (EXEC == 'python3')?spawn(EXEC, ['-u', codepath], {cwd:PATH}):spawn(EXEC, [codepath], {cwd:PATH}); // python3/sh
    ps.stdout.on('data', (data) => {
      record += data.toString();
      io.emit('update', {record:record});
    });

    ps.stderr.on('data', (data) => {
      record += data.toString();
      io.emit('update', {record:record});
    });

    ps.on('error', (err) => {
      record += err.toString();
      io.emit('update', {record:record});
    });

    ps.on('close', (code) => {
      record += "\n종료됨.";
      io.emit('update', {record:record, exit:true});
      io.emit('update_file_manager', {data: readDirectory(PATH)});
      res(mutex.release());
    });
  });
}

const mutex = new Mutex();
let upload = multer({ storage: storage });
let upload_for_home = multer({ storage: storage_for_home});

server.listen(port, () => {
  console.log('Server Start: ', port);
});

app.use('/static', express.static(__dirname + '/static'));
app.use('/svg', express.static(__dirname + '/svg'));
app.use('/webfonts', express.static(__dirname + '/webfonts'));

let fileExtensionCheck = (filename) => {
  let fileln = filename.length;
  let fileDot = filename.lastIndexOf(".");
  return filename.substring(fileDot+1, fileln).toLowerCase();
}

app.get('/dir', (req, res) => {
  const directoryPath = req.query.folderName;
  //const fileType = req.query.filetype.split(",");

  let files = [];
  try {
    fs.readdirSync(directoryPath, {withFileTypes:true}).forEach(p => {
      if(!p.isDirectory() && !p.isSymbolicLink() && p.name[0] != '.' /* && fileType.includes(fileExtensionCheck(p.name))*/) {
        files.push(p.name)
      }
    });
  }
  catch (err) {
    files = [];
  }
  res.json(files);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/index.html')
});

app.get('/download', (req, res) => {
  if (isProtect(PATH + "/" + req.query.filename)) {
    io.emit('update', {dialog:'파일 다운로드 오류: 보호 디렉토리입니다.'});
    return;
  }
  res.download(PATH + "/" + req.query.filename); 
});
//app.post('/upload', upload.single('data'), (req, res) => {
app.post('/upload', upload.array('data', 10), (req, res) => {
  if (isProtect(PATH)) {
    io.emit('update', {dialog:'파일 업로드 오류: 보호 디렉토리입니다.'});
    return;
  }
  io.emit('update_file_manager', {data: readDirectory(PATH)});

  try {
    execSync(`chown -R pi:pi "${PATH}"`);
  }
  catch (err) {
    console.log(err);
  }
  res.status(200).end();
});

app.post('/show', upload_for_home.single('data'), (req, res) => {
  try {
    fs.readFile("/home/pi/.tmp.jpg", (err, data) => {
      if(!err) io.emit('update', {image:Buffer.from(data).toString('base64'), filepath:"/home/pi/.tmp.jpg"});
      else io.emit('update', {dialog:'보기 오류: ' + err.toString()});
    });
  }
  catch (err) {
    console.log(err);
  }
  res.status(200).end();
});

io.on('connection', (socket) => {
  socket.on('init', () => {
    try {
      io.emit('system', execSync('/home/pi/openpibo-os/system/system.sh').toString().replaceAll('\n','').split(','));
    }
    catch (err) {
      console.log(err);
      io.emit('update', {dialog:'초기화: 시스템 파일 오류입니다.'});
    }
    fs.readFile(codePath, (err, data) => {
      if(!err) codeText = data.toString()
      else codeText = '';
      io.emit('init', {codepath: codePath, codetext:codeText, path:PATH});
    });
  });

  socket.on('poweroff', () => {
    exec('shutdown -h now &');
    exec('echo "#11:!" > /dev/ttyS0');
  });

  socket.on('restart', () => {
    exec('shutdown -r now');
  });

  socket.on('load_directory', function(p) {
    let res = readDirectory(p);
    if (res) {
      PATH = p;
    }
    else {
      res = readDirectory(PATH);
    }

    io.emit('update_file_manager', {data: res, path:PATH});
  });

  socket.on('stop', () => {
    exec('pkill play');
    if(ps) ps.kill('SIGKILL');
  });

  socket.on('view', (p) => {
    fs.readFile(p, (err, data) => {
      if(!err) io.emit('update', {image:Buffer.from(data).toString('base64'), filepath:p/*, dialog:'불러오기 완료: ' + p*/});
      else io.emit('update', {dialog:'보기 오류: ' + err.toString()});
    });
  });
  
  socket.on('play', (p) => {
    fs.readFile(p, (err, data) => {
      if(!err) io.emit('update', {audio:Buffer.from(data).toString('base64'), filepath:p/*, dialog:'불러오기 완료: ' + p*/});
      else io.emit('update', {dialog:'재생 오류: ' + err.toString()});
    });
  });

  //load 
  socket.on('load', (p) => {
    if (isProtect(p)) {
      io.emit('update', {dialog:'파일 불러오기 오류: 보호 파일입니다.'});
      return;
    }

    fs.readFile(p, (err, data) => {
      if(!err) io.emit('update', {code: data.toString(), filepath:p/*, dialog:'불러오기 완료: ' + p*/});
      else io.emit('update', {dialog:'파일 불러오기 오류: ' + err.toString()});
    });
  });

  socket.on('delete', (d) => {
    if (isProtect(d)) {
      io.emit('update', {dialog:'파일 삭제 오류: 보호 파일 입니다.'});
      return;
    }
    if (d == codePath) {
      codePath = "";
      codeText = "";
    }
    try {
      fs.rmSync(d, {recursive:true, force:true});
    } catch (err) {
      console.log(err);
      io.emit('update', {dialog:'파일 삭제 오류: 파일명 파싱 에러입니다.'});
      return;
    }
    
    io.emit('update_file_manager', {data: readDirectory(PATH)});
  });

  socket.on('rename', (d) => {
    if (isProtect(d['oldpath']) || isProtect(d['newpath'])) {
      io.emit('update', {dialog:'파일 이름 변경 오류: 보호 파일 입니다.'});
      return;
    }

    try {
      fs.renameSync(d['oldpath'], d['newpath']);
    } catch (err) {
      io.emit('update', {dialog:'파일 이름 변경 오류: 파일명 파싱 에러입니다.'});
      return;
    }
    io.emit('update_file_manager', {data: readDirectory(PATH)});

    if (d['oldpath'] == codePath) {
      fs.readFile(d['newpath'], (err, data) => {
        if(!err) {
          codePath = d['newpath'];
          codeText = data.toString();
          io.emit('update', {code: codeText, filepath: codePath});
        }
        else io.emit('update', {dialog:'파일 불러오기 오류: ' + err.toString()});
      });
    }
  });

  socket.on('add_file', (p) => {
    if (isProtect(PATH)) {
      io.emit('update', {dialog:'파일 생성 오류: 보호 디렉토리입니다.'});
      return;
    }

    fs.access(p, fs.constants.F_OK, (evt) => {
      try {
        if(evt.code == 'ENOENT') {
          execSync(`mkdir -p "${path.dirname(p)}"`);
          execSync(`touch "${p}"`);
          execSync(`chown -R pi:pi "${path.dirname(p)}"`);
          io.emit('update_file_manager', {data: readDirectory(PATH)});
        }
      } catch (err) {
        io.emit('update', {dialog:'파일 생성 오류: ' + err.toString()});
        return;
      }

      codePath = p;
      fs.readFile(p, (err, data) => {
        if(!err) io.emit('update', {code: data.toString(), filepath: p});
        else io.emit('update', {dialog:'파일 불러오기 오류: ' + err.toString()});
      });
    });
  });

  socket.on('add_directory', (p) => {
    if (isProtect(PATH)) {
      io.emit('update', {dialog:'디렉토리 생성 오류: 보호 폴더입니다.'});
      return;
    }

    fs.access(p, fs.constants.F_OK, (evt) => {
      try {
        if(evt.code == 'ENOENT') {
          execSync(`mkdir -p "${p}"`);
          execSync(`chown -R pi:pi "${p}"`);
          io.emit('update_file_manager', {data: readDirectory(PATH)});
        }
      } catch (err) {
        io.emit('update', {dialog:'디렉토리 생성 오류: ' + err.toString()});
        return;
      }
    });
  });

  socket.on('save', (d) => {
    try {
      if (isProtect(d['codepath']) || isProtect(path.dirname(d['codepath']))) {
        io.emit('update', {dialog:'파일 저장 오류: 보호 파일입니다.'});
        return;
      }
      codeText = d['codetext'];
      codePath = d['codepath'];
      execSync(`mkdir -p "${path.dirname(codePath)}"`);
      fs.writeFileSync(codePath, codeText);
      execSync(`chown -R pi:pi "${path.dirname(codePath)}"`);
    } catch (err) {
      io.emit('update', {dialog:'파일 저장 오류: ' + err.toString()});
    }
  });

  socket.on('execute', async (d) => {
    try {
      if (isProtect(d['codepath']) || isProtect(path.dirname(d['codepath']))) {
        io.emit('update', {dialog:'실행 오류: 보호 파일입니다.', exit:true});
        return;
      }
      codeText = d['codetext'];
      codePath = d['codepath'];
      if(ps) ps.kill('SIGKILL');
      execSync(`mkdir -p "${path.dirname(codePath)}"`);
      fs.writeFileSync(codePath, codeText);
      execSync(`chown -R pi:pi "${path.dirname(codePath)}"`);
      await execute(codeExec[d["codetype"]], codePath);
    } catch (err) {
      io.emit('update', {dialog:'실행 오류: ' + err.toString(), exit:true});
    }
  });

  // for block
  socket.on('executeb', async (d) => {
    try {
      // codepath = '/home/pi/blockly.py'
      if(ps) ps.kill('SIGKILL');
      execSync(`mkdir -p "${path.dirname(d['codepath'])}"`);
      fs.writeFileSync(d['codepath'], d['codetext']);
      execSync(`chown -R pi:pi "${path.dirname(d['codepath'])}"`);
      await execute(codeExec[d["codetype"]], d['codepath']);
    } catch (err) {
      io.emit('update', {dialog:'실행 오류: ' + err.toString(), exit:true});
    }
  });

  socket.on('prompt', (s) => {
    if(ps)
      ps.stdin.write(s+"\n");
  });
});

setInterval(() => {
  try {
    io.emit('system', execSync('/home/pi/openpibo-os/system/system.sh').toString().replaceAll('\n','').split(','));
  }
  catch (err) {
    io.emit('update', {dialog:'초기화: 시스템 파일 오류입니다.'});
  }

  try {
    io.emit('update_battery', execSync('curl -s "http://0.0.0.0/device/%2315%3A%21"').toString().replaceAll('"', '').split(':')[1]);
  }
  catch (err) {
    //io.emit('update', {dialog:'초기화: 배터리체크 오류입니다.'});
  }

  try {
    io.emit('update_dc', execSync('curl -s "http://0.0.0.0/device/%2314%3A%21"').toString().replaceAll('"', '').split(':')[1]);
  }
  catch (err) {
    //io.emit('update', {dialog:'초기화: DC 체크 오류입니다.'});
  }
}, 10000);
