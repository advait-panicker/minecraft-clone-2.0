let socket = io();
socket.on('chunk', (chunk) => {
    console.log(chunk.chnkX, chunk.chnkZ);
    drawChunk(chunk.data, chunk.chnkX, chunk.chnkZ);
});
const WORLDSIZE = 1;
const CHUNKSIZE = 16;
let chunks = {}; 
function drawChunk(chunk, chnkX, chnkZ) {
    chunks = {...chunks, ...chunk};
    let pos = [], tex = [], id = [];
    let i = 0;
    function makeFace(x,y,z,t) {
        pos.push(x+t.a.x, y+t.a.y, z+t.a.z);
        pos.push(x+t.b.x, y+t.b.y, z+t.b.z);
        pos.push(x+t.c.x, y+t.c.y, z+t.c.z);
        pos.push(x+t.d.x, y+t.d.y, z+t.d.z);
        tex.push(0, 0);
        tex.push(1, 0);
        tex.push(1, 1);
        tex.push(0, 1);
        id.push(i, i + 1, i + 2, i, i + 2, i + 3);
        i += 4;
    }
    function getBlockST(xpos, ypos, zpos) { // Just for air and undef
        // const x = xpos % CHUNKSIZE, y = ypos, z = zpos % CHUNKSIZE;
        const x = xpos, y = ypos, z = zpos;
        const loc = z * CHUNKSIZE + x;
        if (chunks[loc] == undefined) {
            return 0;
        } else if (chunks[loc][y] == undefined) {
            return 0;
        } else {
            return chunks[loc][y];
        }
    }
    for (let z = chnkZ*CHUNKSIZE; z < (chnkZ+1)*CHUNKSIZE; z++) {
        for (let x = chnkX*CHUNKSIZE; x < (chnkX+1)*CHUNKSIZE; x++) {
            for (let y = 0; y < 256; y++) {
                if (getBlockST(x, y, z) != 0) {
                    if (getBlockST(x  , y+1, z) == 0) {
                        makeFace  (x  , y  , z, Tile.TOP);
                    }
                    if (getBlockST(x+1, y  , z) == 0) {
                        makeFace  (x  , y  , z, Tile.XP);
                    }
                    if (getBlockST(x-1, y  , z) == 0) {
                        makeFace  (x  , y  , z, Tile.XN);
                    }
                    if (getBlockST(x  , y  , z+1) == 0) {
                        makeFace  (x  , y  , z, Tile.ZP);
                    }
                    if (getBlockST(x  , y  , z-1) == 0) {
                        makeFace  (x  , y  , z, Tile.ZN);
                    }
                }
            }
        }
    }
    addToScene(gl, {positions : pos, textureCoordinates : tex, indices : id});
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
    return {positions : pos, textureCoordinates : tex, indices : id};
}