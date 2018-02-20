'use strict';

//internal modules
const net = require('net');
const EE = require('events');
//npm modules

//created modules
const Client = require('./model/client.js');
//internal
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

ee.on('default', function(client) {
    client.socket.write('not a command - use an @ symbol\n');
})

ee.on('@all', function(client, string) {
    pool.forEach( c => {
        c.socket.write(`${client.nickname}: ${string}`);
    });
});

ee.on('@dm', function(client, string) {
    var nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();
  
    pool.forEach( c => {
      if (c.nickname === nickname) {
        c.socket.write(`${client.nickname}: ${message}`);
      }
    });
  });

ee.on('@nickName', function(client, string) {
    let nickName = string.split(' ').shift().trim();
    client.nickName = nickName;
    client.socket.write(`user has chnaged nickName to ${nickName}\n`);
});

server.on('connections', function(socket){
    var client = new Client(socket);
    pool.push(client);

    // console.log(client);
    socket.on('data', function (data) {
        const command = data.toString().split(' ').shift().trim();

        if (command.tartsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            // console.log('command: ' + command);
            return;
        }

        ee.emit('default', client);
        // console.log('command: ' + command);
    });
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});