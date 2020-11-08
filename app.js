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

const WORLDSIZE = 400;
const CHUNKSIZE = 16;
let Map = new (require('./game/map.js'))('vsdjuftgs', CHUNKSIZE, WORLDSIZE);

let chunks = {};

let PLAYER_LIST = {};

const io = require('socket.io')(serv);
io.sockets.on('connect', function(socket) {
    console.log(`New connection ${socket.id}`);
    PLAYER_LIST[socket.id] = {name : "d", pos : {x: 0, y : 0, z : 0}};
    const p = PLAYER_LIST[socket.id];
    socket.on('move', (pos) => {
        PLAYER_LIST[socket.id].pos = pos;
        io.emit('updatePos', PLAYER_LIST);
    });
    socket.on('requestChunk', (pos) => {
        console.log(pos);
        const chunk = getChunk(pos.x, pos.z);
        if (chunk != undefined) {
            socket.emit('chunk', chunk);
        }
    });
    socket.on('disconnect', () => {
        delete PLAYER_LIST[socket.id];
    });
});

function getChunk(x, z) {
    if (x >= 0 & z >= 0 && x <= WORLDSIZE && z <= WORLDSIZE) {
        if (chunks[z * WORLDSIZE + x] == undefined) {
            chunks[z * WORLDSIZE + x] = Map.generateChunk(x, z);
        }
        return {data : chunks[z * WORLDSIZE + x], chnkX : x, chnkZ : z};
    } else {
        return undefined;
    }
}