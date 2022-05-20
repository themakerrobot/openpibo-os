const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const execSync = require('child_process').execSync;
const spawn = require('child_process').spawn;
const fs = require('fs');

const CODEPATH='/tmp/test.py';
const IMGPATH='/tmp/test.jpg';

const port = process.argc > 2 ? Number(process.argv[2]):50000;

let record = '';
let ps = undefined;

server.listen(port, function(){
  execSync('v4l2-ctl -c vertical_flip=1,horizontal_flip=1,white_balance_auto_preset=3')
  console.log('Server Start: ', port);
});

app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/templates/index.html')
});

io.on('connection', function(socket){
  socket.on('info', function(){
    io.emit('info', {'codepath':CODEPATH, 'imgpath':IMGPATH});
  });

  socket.on('stop', function(){
    execSync('/home/pi/openpibo-tools/development-tool/stop.sh');
    record = '';
    io.emit('update', record);
  });

  socket.on('show', function(){
    fs.readFile(IMGPATH, function(err, data){
      if(!err) io.emit('show', Buffer.from(data).toString('base64'));
      else io.emit('show', null);
    });
  });

  socket.on('compile', function(data){
    execSync('/home/pi/openpibo-tools/development-tool/stop.sh');
    fs.writeFileSync(CODEPATH, data);

    record = '[' + new Date().toString().split(' GMT')[0] + ']: $ sudo python3 ' + CODEPATH + ' >> \n\n';
    io.emit('update', record);
    ps = spawn('python3', ['-u', CODEPATH]);

    ps.stdout.on('data', function(data){
      record += data.toString();
      io.emit('update', record);
    });

    ps.on('close', function(code){
      record += '\n## All programs terminated ##'
      io.emit('update', record);
    });
  });
});
