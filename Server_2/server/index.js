var express = require('express');
var app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

ArduinoSocketID = null;

// ------------------SERVER TCP ------------------------

var net = require('net'); /* Paquete para TCP */

var tcp_sockets = []; /* para enlistar los clientes TCP*/
var tcp_server = net.createServer(function(socket) {
    tcp_sockets.push(socket);
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    console.log("Se ha conectado: "+socket.name);
    //socket.write("Bienvenido.."); 

    socket.on('end', function() {
        console.log(socket.name + " se desconectó.\n");
        /* remover al cliente TCP de la lista */
        tcp_sockets.splice(tcp_sockets.indexOf(socket), 1);
    });

    socket.on('error', function() {
        console.log("Error -> "+socket.name + " se desconectó.\n");
        /* remover al cliente TCP de la lista */
        tcp_sockets.splice(tcp_sockets.indexOf(socket), 1);
    });
    
    /* Cuando un cliente TCP nos transmite datos */
    socket.on('data',function(data){
        var data = data.toString().trim(); // covertimos a cadena y quitamos espacios extras
        console.log(data);

        /* DESDE TCP ENVIAMOS DATOS A CLIENTES SOCKETIO CONECTADOS */
        var all_connected_io = io.sockets.sockets;
        if(Object.keys(all_connected_io).length > 0){
            io.sockets.emit('comando', data);
        }
        
        /* Para cuando sea necesario enviar mensajes por TCP a los clientes TCP
           conectados */
        /*
        // Si no hay clientes TCP, no hay a quien enviar
        if (tcp_sockets.length === 0) {
            return;
        }
        // Enviar mensajes TCP a los clientes TCP conectados 
        tcp_sockets.forEach(function(socket, index, array){
            socket.write(data);
        });
        */
    });
});
tcp_server.listen(5002);

// ------------------SERVER TCP ------------------------


io.on('connection', function(socket){

    socket.on('soy_arduino',function(data){
        ArduinoSocketID = socket.id;
        //console.log(ArduinoSocketID);
    });

    socket.on('comando',function(data){
        console.log(data);
        socket.broadcast.to(ArduinoSocketID).emit('comando',data);
    });

    socket.on('desde_arduino',function(data){
        console.log(data);
        io.sockets.emit('arduino',data);
        /* se prepara data para enviarlo por TCP 
           se le agregan ceros a la izquierda para 
           enviar siempre cadenas de 6 bytes y leer
           tamaños fijos en Labview */
           data = String(data);
           switch (data.length)
           {
               case 1:
                   data = "000"+data;
                   break;
               case 2:
                   data = "00"+data;
                   break;
               case 3:
                   data = "0"+data;
                   break;
           }
           //console.log(data+" -> "+data.length);
           //console.log("Length:"+tcp_sockets.length);
           /* En caso de tner varios clientes TCP (LabView) 
              se recorre la lista y se le envía data a
              cada uno */
           if (tcp_sockets.length === 0) {
               return;
           }else{
               tcp_sockets.forEach(function(socket, index, array){
                   //console.log(socket.name+" -> "+socket.readyState);
                   if(socket.readyState == 'open'){
                       socket.write(data);
                   }
               });
           }
    });
});


server.listen(5001, function(){
    console.log("Servidor corriendo en el puerto 5001.")
});