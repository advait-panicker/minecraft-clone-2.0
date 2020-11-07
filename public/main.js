let socket = io();
socket.on('chunks', (chunks) => {
    start(chunks);
});
function main(chunks) {
    let pos = [], tex = [], id = [];
    let i = 0;
    function makeFace(x,y,z) {
        pos.push(x, y, z);
        pos.push(x+1, y, z);
        pos.push(x+1, y, z+1);
        pos.push(x, y, z+1);
        tex.push(0, 0);
        tex.push(1, 0);
        tex.push(1, 1);
        tex.push(0, 1);
        id.push(i, i + 1, i + 2);
        id.push(i, i + 2, i + 3);
        i += 4;
    }
    for (let chnkZ = 0; chnkZ < 1; chnkZ++) {
        for (let chnkX = 0; chnkX < 1; chnkX++) {
            const chunk = chunks[chnkZ * 10 + chnkX];
            for (let z = 0; z < 16; z++) {
                for (let x = 0; x < 16; x++) {
                    const b = z * 16 + x;
                    for (let y = 0; y < 256; y++) {
                        if (chunk[b][y] != 0) {
                            if (chunk[b][y+1] == 0) {
                                makeFace(x, y, z);
                            }
                        }
                    }
                }
            }
        }
    }
    return {positions : pos, textureCoordinates : tex, indices : id};
}
const Tile = {
    TOP : {}
};