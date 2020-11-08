const perlin = require('./perlin.js');
class Map {
    constructor(seed, chnkSize, wrldSize) {
        this.seed = seed;
        this.CHUNKSIZE = chnkSize;
        this.WORLDSIZE = wrldSize;
        this.p = new perlin(seed, chnkSize);
    }
    generateChunk(chnkX, chnkZ) {
        let chunk = [];
        for (let z = chnkZ*this.CHUNKSIZE; z < (chnkZ+1)*this.CHUNKSIZE; z++) {
            chunk[z] = [];            
            for (let x = chnkX*this.CHUNKSIZE; x < (chnkX+1)*this.CHUNKSIZE; x++) {
                chunk[z][x] = [];
                const height = this.p.noise(x, z) * 20 + 10;
                for (let y = 0; y < 256; y++) {
                    if (y < height) {
                        chunk[z][x][y] = 1;
                    } else {
                        chunk[z][x][y] = 0;
                    }
                }
            }
        }
        return chunk;
    }
}
module.exports = Map;