var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connected_users = []

io.on('connection', function(socket){
  let username = ""
  socket.on('user nickname', function(name){
    socket.emit('connected', connected_users)
    io.emit('user connected', name)
    connected_users.push(name)
    username = name
  })
  socket.on('disconnect', function() {
    io.emit('user disconnected', username)
    connected_users.splice(connected_users.indexOf(username), 1)
  }) 

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
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