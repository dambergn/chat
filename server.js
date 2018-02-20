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

const pool = [];

server.on('connections', function(socket){
    var client = new Client(socket);
    pool.push(client);

    console.log(client.nickName);
})

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});