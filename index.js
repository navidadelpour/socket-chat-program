var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connected_users = []

io.on('connection', function(socket){
  let _user = {username: "", online: false}

  socket.on('user nickname', function(user){
    _user = user
    socket.emit('connected', connected_users)
    io.emit('user connected', _user)
    connected_users.push(_user)
  })

  socket.on('disconnect', function() {
    io.emit('user disconnected', _user)
    connected_users.splice(connected_users.indexOf(_user), 1)
  }) 

  socket.on('user online', function(user) {
    let u = connected_users.find(function(u) {
      return u.username === user.username
    })
    if(u) {
      u.online = true
      io.emit('online', user.username)
    }
  })

  socket.on('user offline', function(user) {
    let u = connected_users.find(function(u) {
      return u.username === user.username
    })
    if(u) {
      u.online = false
      io.emit('offline', user.username)
    }
  })

  socket.on('chat message', function({message, username}){
    socket.broadcast.emit('chat message', {message, username});
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

// Broadcast a message to connected users when someone connects or disconnects.
// Add support for nicknames.
// Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
// Add “{user} is typing” functionality.
// Show who’s online.
// Add private messaging.
// Share your improvements!