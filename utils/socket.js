const socket = require('socket.io');

const io = socket()


var Socket = {
    send: function (data) {
        console.log( data);
        io.sockets.send( data);
    }
};

io.on("connection", function (socket) {
    console.log("Socket connected");
});

exports.Socket = Socket;
exports.io = io;