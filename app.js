var http = require('http');
var fs = require('fs');

// Chargement of file index.html displayed for the client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement of socket.io
var io = require('socket.io').listen(server);
io.origins('*:*')

io.sockets.on('connection', function (socket, pseudo) {   
    //when we get the username, we save it in a session var
    socket.on('newbie', function(pseudo) {
        socket.pseudo = pseudo;
        socket.emit('joined', pseudo + ' joined the chat !')
        socket.broadcast.emit('joined', pseudo + ' joined the chat !')
    });

    // When we receive a "message", (click on the button), we write it in the terminal
    socket.on('test', function (message) {

        // We get the username of those who clicked in the session vars
        console.log(socket.pseudo + ' is talking to me ! He says : ' + message);
    }); 
    socket.on('message', function (message) {
        socket.emit('message', {pseudo: socket.pseudo, message: message});
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });     
});


server.listen(8080);