const express = require('express');
const app = express();
app.use(express.static(`${__dirname}/public`));
const serv = require('http').createServer(app);

serv.on('error', (err) => {
    console.error('Server error: ', err);
});

serv.listen(process.env.PORT || 2000, () => {
    console.log('Server Started');
});

const WORLDSIZE = 10;
let Map = new (require('./game/map.js'))('123123', 16, WORLDSIZE);

let chunks = {};

for (let z = 0; z < WORLDSIZE; z++) {
    for (let x = 0; x < WORLDSIZE; x++) {
        chunks[z * WORLDSIZE + x] = Map.generateChunk(x, z);
    }
}
// console.log(chunks);

let PLAYER_LIST = {};

const io = require('socket.io')(serv);
io.sockets.on('connect', function(socket) {
    console.log(`New connection ${socket.id}`);
    PLAYER_LIST[socket.id] = {name : "d"};
    socket.emit('chunks', chunks);
    socket.on('disconnect', () => {
        delete PLAYER_LIST[socket.id];
    });
});