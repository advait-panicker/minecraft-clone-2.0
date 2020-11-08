const seedrandom = require('seed-random');
class Perlin {
    constructor(seed, chunkSize) {
        // this.vectors = [];
        this.seed = seed;
        this.chunkSize = chunkSize;
    }
    getVector(v_x, v_y) {
        // if (this.vectors[v_y] == undefined){
        //     this.vectors[v_y] = [];
        // }
        // if (this.vectors[v_y][v_x] == undefined) {
        //     let angle = seedrandom(this.seed + v_x + v_y)() * 2 * Math.PI;
        //     this.vectors[v_y][v_x] = [Math.cos(angle), Math.sin(angle)]; 
        // }
        const angle = seedrandom(this.seed + v_x + v_y)() * 2 * Math.PI;
        const v = [Math.cos(angle), Math.sin(angle)]; 
        return v;
    }
    interp(a0, a1, w) {
        const k = 6 * Math.pow(w, 5) - 15 * Math.pow(w, 4) + 10 * Math.pow(w, 3);
        return (1-k)*a0 + k*a1;
    }
    noise(px, py) {
        const x = px / this.chunkSize, y = py / this.chunkSize;
        const c_x = Math.floor(x), c_y = Math.floor(y);
        const s_x = x - c_x, s_y = y - c_y;
        function gradient(p, xoff, yoff) {
            let v = p.getVector(c_x+xoff, c_y+yoff);
            return v[0]*(s_x-xoff) + v[1]*(s_y-yoff);
        }
        const ix0 = this.interp(gradient(this, 0, 0), gradient(this, 1, 0), s_x);
        const ix1 = this.interp(gradient(this, 0, 1), gradient(this, 1, 1), s_x);
        return this.interp(ix0, ix1, s_y);
    }
}
module.exports = Perlin;