var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {   
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
        socket.emit('joined', pseudo + ' joined the chat !')
        socket.broadcast.emit('joined', pseudo + ' joined the chat !')
    });

    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('test', function (message) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
    }); 
    socket.on('message', function (message) {
        socket.emit('message', {pseudo: socket.pseudo, message: message});
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });     
});


server.listen(8080);