"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashGen = void 0;
const getRandom = (min, max, int) => {
    var rand = min + Math.random() * (max - min);
    if (int) {
        rand = Math.round(rand);
    }
    return rand;
};
const hashGen = () => {
    const $possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = '';
    for (let i = 0; i < 32; i++) {
        hash += '' + $possible[getRandom(0, 61, true)];
    }
    return hash;
};
exports.hashGen = hashGen;
//# sourceMappingURL=keygen.js.map