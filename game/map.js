const perlin = require('./perlin.js');
class Map {
    constructor(seed, chnkSize, wrldSize) {
        this.seed = seed;
        this.CHUNKSIZE = chnkSize;
        this.WORLDSIZE = wrldSize;
        this.p = new perlin(seed, chnkSize);
    }
    generateChunk(chnkX, chnkZ) {
        let chunk = {};
        let i = 0;
        for (let z = chnkZ*this.CHUNKSIZE; z < (chnkZ+1)*this.CHUNKSIZE; z++) {
            for (let x = chnkX*this.CHUNKSIZE; x < (chnkX+1)*this.CHUNKSIZE; x++) {
                const height = this.p.noise(x, z) * 40 + 10;
                // console.log(x, z, z * this.CHUNKSIZE + x);
                chunk[z * this.CHUNKSIZE + x] = [];
                for (let y = 0; y < 256; y++) {
                    if (y < height) {
                        chunk[z * this.CHUNKSIZE + x][y] = 1;
                    } else {
                        chunk[z * this.CHUNKSIZE + x][y] = 0;
                    }
                }
            }
        }
        return chunk;
    }
}
module.exports = Map;