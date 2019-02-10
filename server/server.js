import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 4000;
const portSocket = 4200;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', ((req, res) => {
  res.render('index');
}));

let id = 0;
let users = [];

io.on('connection', socket => {
  console.log('User connected');
  users.push({
    id,
    name: `user-${id}`
  });
  id += 1;
  io.emit('broadcast', users )
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  });

  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg);
  });
});

app.use(express.static(path.join(__dirname, '../public')));
app.listen(port, () => console.log(`started and listening on port ${port}!`));
server.listen(portSocket, () => console.log(`started and listening on port ${portSocket}!`));

