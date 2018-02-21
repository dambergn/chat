'use strict';

//internal modules
const net = require('net');
const EE = require('events');
//npm modules

//created modules
const Client = require('./model/client.js');
// const Commands = require('./model/commands.js');
//internal
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

//send message to whole group
ee.on('@all', (client, string) => {
    pool.forEach( c => {
        c.socket.write(`${client.nickname}: ${string}`);
    });
});

//send direct message
ee.on('@dm', (client, string) => {
    var nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();
  
    pool.forEach( c => {
      if (c.nickname === nickname) {
        c.socket.write(`${client.nickname}: ${message}`);
      }
    });
  });

//change defalut nickname to custom name
ee.on('@nickname', (client, string) => {
    let nickname = string.split(' ').shift().trim();
    client.nickname = nickname;
    client.socket.write(`user has changed nickname to ${nickname}\n`);
});

//not a valid command message
ee.on('default', (client, string) => {
    client.socket.write('not a command - use an @ symbol\n');
})

server.on('connection', (socket) => {
    var client = new Client(socket);
    pool.push(client);

    // console.log(client);
    socket.on('data', (data) => {
        const command = data.toString().split(' ').shift().trim();

        if (command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            // console.log('command: ' + command);
            return;
        }

        ee.emit('default', client, data.toString());
        // console.log('command: ' + command);
    });
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});