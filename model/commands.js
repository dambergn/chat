'use strict';

const EE = require('events');
const ee = new EE();
const cmd = {};

cmd.ee.on('@all', (client, string) => {
    pool.forEach(c => {
        c.socket.write(`${client.nickname}: ${string}`);
    });
});

cmd.ee.on('@dm', (client, string) => {
    var nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();

    pool.forEach(c => {
        if (c.nickname === nickname) {
            c.socket.write(`${client.nickname}: ${message}`);
        }
    });
});

cmd.ee.on('@nickname', (client, string) => {
    let nickname = string.split(' ').shift().trim();
    client.nickname = nickname;
    client.socket.write(`user has changed nickname to ${nickname}\n`);
});

cmd.ee.on('default', (client, string) => {
    client.socket.write('not a command - use an @ symbol\n');
})

module.exports = cmd;
