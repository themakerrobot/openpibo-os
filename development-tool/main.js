const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');

const codeExec = {
  'python': 'python3',
  'nodejs': 'node',
  'shell': 'sh',
  };
const port = process.argc > 2 ? Number(process.argv[2]):50000;
const DIR = '/home/pi/code';

let record = '';
let ps = undefined;
let codeType = 'python';
let codeText = '';
let codePath = DIR + '/test.py';

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
const mutex = new Mutex();

const compile = async(EXEC, codepath) => {
  await mutex.acquire();
  return new Promise((res, rej) => {
    record = '[' + new Date().toString().split(' GMT')[0] + ']: $ sudo ' + EXEC + ' ' + codepath + ' >> \n\n';
    io.emit('update', {'record':record});
    ps = (EXEC == 'python3')?spawn(EXEC, ['-u', codepath]):spawn(EXEC, [codepath]); // python3/node/sh
    ps.stdout.on('data', (data) => {
      record += data.toString();
      io.emit('update', {'record':record});
    });

    ps.stderr.on('data', (data) => {
      record += data.toString();
      io.emit('update', {'record':record});
    });

    ps.on('error', (err) => {
      record += err.toString();
      io.emit('update', {'record':record});
    });

    ps.on('close', (code) => {
      record += "\n종료됨.";
      io.emit('update', {'record':record, 'exit':true});
      res(mutex.release());
    });
  });
}

server.listen(port, () => {
  execSync('v4l2-ctl -c vertical_flip=1,horizontal_flip=1,white_balance_auto_preset=3');
  console.log('Server Start: ', port);
});

app.use('/static', express.static(__dirname + '/static'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/index.html')
});

io.on('connection', (socket) => {
  socket.on('init', () => {
    fs.readFile(codePath, (err, data) => {
      if(!err) codeText = data.toString()
      else codeText = '';
      io.emit('init', {'type':codeType, 'path': codePath, 'text':codeText});
    });
  });

  socket.on('stop', (path) => {
    exec('pkill omxplayer');
    if(ps) ps.kill('SIGKILL');
  });

  socket.on('view', (path) => {
    fs.readFile(path, (err, data) => {
      if(!err) io.emit('update', {'image':Buffer.from(data).toString('base64'), 'dialog':'불러오기 완료: ' + path});
      else io.emit('update', {'record':err.toString()});
    });
  });

  socket.on('load', (path) =>{
    fs.readFile(path, (err, data) => {
      if(!err) io.emit('update', {'code': data.toString(), 'dialog':'불러오기 완료: ' + path});
      else io.emit('update', {'code':'', 'record':err.toString()});
    });
  });

  socket.on('system', () => {
    io.emit('system', execSync('/home/pi/openpibo-tools/ide/system.sh').toString().split(','));
  });

  socket.on('save', (d) => {
    execSync('mkdir -p ' + path.dirname(d['path']));
    fs.writeFileSync(d['path'], d['text']);
    execSync('chown -R pi:pi ' + path.dirname(d['path']));
  });

  socket.on('compile', async (d) => {
    codeType = d['type'];
    codeText = d['text'];
    codePath = d['path'];
    if(ps) ps.kill('SIGKILL');
    execSync('mkdir -p ' + path.dirname(d['path']));
    fs.writeFileSync(d['path'], d['text']);
    execSync('chown -R pi:pi ' + path.dirname(d['path']));
    await compile(codeExec[d['type']], d['path']);
  });
});
