// Configure server

const app = require('express')();
const server = require('http').Server(app);
const socketIo = require('socket.io')(server);

const port = 3000;

server.listen(port, () => {
    console.log(`Now the server is listening on port: ${port}`);
});


// Configure routes

// Here '/' refer to localhost 3000
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // __dirname gives the current directory
});


// Implement events for incoming sockets (in this app are the messages)

const tech = socketIo.of('/tech');

// connection event which listener for a socket coming fro our client (in our case the clinet is index.html)
tech.on('connection', (socket) => {

    // join event when a user join in any of tech room
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room`);
    });

    // message event when a message is sent in any of tech room
    socket.on('message', (data) => {
        console.log('message received: ' + data);
        tech.in(data.room).emit('message', data.msg);
    });

    // disconnect event when an disconnected occurs in any tech room
    socketIo.on('disconnect', () => {
        console.log('User disconnected');
        tech.emit('message', 'User Disconnected');

    });


});

