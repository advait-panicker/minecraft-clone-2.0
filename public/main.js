let socket = io();
const WORLDSIZE = 400;
const CHUNKSIZE = 16;
const RENDERDISTANCE = 4;
let chunks = {}; 
socket.on('chunk', (chunk) => {
    // console.log(chunk.chnkX, chunk.chnkZ);
    if (chunks[chunk.chnkX +  chunk.chnkZ * WORLDSIZE] == undefined) {
        drawChunk(chunk.data, chunk.chnkX, chunk.chnkZ);
        const cx = Math.floor(dx / CHUNKSIZE), cz = Math.floor(dz / CHUNKSIZE);
        for (let name in scene) {
            const x = name % WORLDSIZE;
            const z = (name - x) / WORLDSIZE;
            if (Math.abs(x - cx) > RENDERDISTANCE || Math.abs(z - cz) > RENDERDISTANCE) {
                delete chunks[name];
                delete scene[name];
            }
        }
    }
});
socket.on('updatePos', players => {
    // const a = players[socket.id].pos;
    // dx = a.x; dy = a.y; dz = a.z;
    const cx = Math.floor(dx / CHUNKSIZE), cz = Math.floor(dz / CHUNKSIZE);
    for (let z = cz-RENDERDISTANCE; z < cz+RENDERDISTANCE+1; z++) {
        for (let x = cx-RENDERDISTANCE; x < cx+RENDERDISTANCE+1; x++) {
            if (chunks[x + z * WORLDSIZE] == undefined && z >= 0 && x >= 0) {
                socket.emit('requestChunk', {x : x, z : z});
            }
        }
    }
});
function drawChunk(chunkData, chnkX, chnkZ) {
    chunks[chnkX + chnkZ * WORLDSIZE] = chunkData;
    let pos = [], tex = [], id = [];
    let i = 0;
    function makeFace(x,y,z,t,b) {
        pos.push(x+t.a.x, y+t.a.y, z+t.a.z);
        pos.push(x+t.b.x, y+t.b.y, z+t.b.z);
        pos.push(x+t.c.x, y+t.c.y, z+t.c.z);
        pos.push(x+t.d.x, y+t.d.y, z+t.d.z);
        const tx = (b-1) / 10, ty = (b-1) / 10;
        tex.push(tx+0.01 , ty+0.099);
        tex.push(tx+0.099, ty+0.099);
        tex.push(tx+0.099, ty+0.01 );
        tex.push(tx+0.01 , ty+0.01 );
        id.push(i, i + 1, i + 2, i, i + 2, i + 3);
        i += 4;
    }
    this.getBlockST = function(x, y, z) { // Just for air and undef
        // const x = xpos % CHUNKSIZE, z = zpos % CHUNKSIZE;
        const cx = Math.floor(x / CHUNKSIZE), cz = Math.floor(z / CHUNKSIZE);
        const chunk = chunks[cx + cz * WORLDSIZE];
        if (chunk == undefined) {
            return 0;
        } else if (chunk[z] == undefined) {
            return 0;
        } else if (chunk[z][x] == undefined) {
            return 0;
        } else if (chunk[z][x][y] == undefined){
            return 0;
        } else {
            return chunk[z][x][y];
        }
    }
    for (let z = chnkZ*CHUNKSIZE; z < (chnkZ+1)*CHUNKSIZE; z++) {
        for (let x = chnkX*CHUNKSIZE; x < (chnkX+1)*CHUNKSIZE; x++) {
            for (let y = 0; y < 256; y++) {
                const b = this.getBlockST(x, y, z);
                if (b != 0) {
                    if (this.getBlockST(x  , y+1, z) == 0) {
                        makeFace  (x  , y  , z, Tile.TOP, b);
                    }
                    if (this.getBlockST(x+1, y  , z) == 0) {
                        makeFace  (x  , y  , z, Tile.XP, b);
                    }
                    if (this.getBlockST(x-1, y  , z) == 0) {
                        makeFace  (x  , y  , z, Tile.XN, b);
                    }
                    if (this.getBlockST(x  , y  , z+1) == 0) {
                        makeFace  (x  , y  , z, Tile.ZP, b);
                    }
                    if (this.getBlockST(x  , y  , z-1) == 0) {
                        makeFace  (x  , y  , z, Tile.ZN, b);
                    }
                }
            }
        }
    }
    addToScene(gl, {positions : pos, textureCoordinates : tex, indices : id}, chnkX + chnkZ * WORLDSIZE);
}
const p = {
    A : {x : 0, y :  0, z : 0},
    B : {x : 0, y :  0, z : 1},
    C : {x : 1, y :  0, z : 1},
    D : {x : 1, y :  0, z : 0},
    E : {x : 0, y : -1, z : 0},
    F : {x : 0, y : -1, z : 1},
    G : {x : 1, y : -1, z : 1},
    H : {x : 1, y : -1, z : 0},
};
const Tile = {
    TOP : {a : p.A, b : p.B, c : p.C, d : p.D},
    XP  : {a : p.G, b : p.H, c : p.D, d : p.C},
    ZP  : {a : p.F, b : p.G, c : p.C, d : p.B},
    ZN  : {a : p.H, b : p.E, c : p.A, d : p.D},
    XN  : {a : p.E, b : p.F, c : p.B, d : p.A},
};

function cubeGeom(a) {
    const pos = [
        // Front face
        -1.0+a, -1.0+a,  1.0+a,
         1.0+a, -1.0+a,  1.0+a,
         1.0+a,  1.0+a,  1.0+a,
        -1.0+a,  1.0+a,  1.0+a,
        
        // Back face
        -1.0+a, -1.0+a, -1.0+a,
        -1.0+a,  1.0+a, -1.0+a,
         1.0+a,  1.0+a, -1.0+a,
         1.0+a, -1.0+a, -1.0+a,
        
        // Top face
        -1.0+a,  1.0+a, -1.0+a,
        -1.0+a,  1.0+a,  1.0+a,
         1.0+a,  1.0+a,  1.0+a,
         1.0+a,  1.0+a, -1.0+a,
        
        // Bottom face
        -1.0+a, -1.0+a, -1.0+a,
         1.0+a, -1.0+a, -1.0+a,
         1.0+a, -1.0+a,  1.0+a,
        -1.0+a, -1.0+a,  1.0+a,
        
        // Right face
         1.0+a, -1.0+a, -1.0+a,
         1.0+a,  1.0+a, -1.0+a,
         1.0+a,  1.0+a,  1.0+a,
         1.0+a, -1.0+a,  1.0+a,
        
        // Left face
        -1.0+a, -1.0+a, -1.0+a,
        -1.0+a, -1.0+a,  1.0+a,
        -1.0+a,  1.0+a,  1.0+a,
        -1.0+a,  1.0+a, -1.0+a,
      ];
    const id = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
    ];
    const tex = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
      ];    
    addToScene(gl, {positions : pos, textureCoordinates : tex, indices : id});
}