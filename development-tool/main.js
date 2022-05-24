const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;
const fs = require('fs');

const codeExec = {
  'python': 'python3',
  'nodejs': 'node',
  'shell': 'sh',
  };
const port = process.argc > 2 ? Number(process.argv[2]):50000;

let record = '';
let ps;

server.listen(port, function(){
  ps = spawn('v4l2-ctl', ['-c','vertical_flip=1,horizontal_flip=1,white_balance_auto_preset=3'])
  console.log('Server Start: ', port);
});

app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/index.html')
});

io.on('connection', function(socket){
  socket.on('stop', function(path){
    spawnSync('kill', [ '-9', ps.pid]);
  });

  socket.on('view', function(path){
    fs.readFile(path, function(err, data){
      if(!err) io.emit('update', {'image':Buffer.from(data).toString('base64'), 'record':'## Load File: ' + path});
      else io.emit('update', {'record':err.toString()});
    });
  });

  socket.on('load', function(path){
    fs.readFile(path, function(err, data){
      if(!err) io.emit('update', {'code': data.toString(), 'record':'## Load File: ' + path});
      else io.emit('update', {'code':'', 'record':err.toString()});
    });
  });

  socket.on('system', function(){
    io.emit('system', execSync('/home/pi/openpibo-tools/development-tool/system.sh').toString().split(','));
  });

  socket.on('compile', function(d){
    const EXEC = codeExec[d['type']];
    const codepath = d['path'];

    spawnSync('kill', [ '-9', ps.pid]);
    fs.writeFileSync(codepath, d['text']);

    record = '[' + new Date().toString().split(' GMT')[0] + ']: $ sudo ' + EXEC + ' ' + codepath + ' >> \n\n';

    ps = (EXEC == 'python3')?spawn(EXEC, ['-u', codepath]):spawn(EXEC, [codepath]); // python3/node/sh
    ps.stdout.on('data', function(data){
      record += data.toString();
      io.emit('update', {'record':record});
    });

    ps.stderr.on('data', function(data){
      record += data.toString();
      io.emit('update', {'record':record});
    });

    ps.on('close', function(code){
      // pass
    });
  });
});
