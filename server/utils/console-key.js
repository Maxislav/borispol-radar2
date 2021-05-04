"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConsoleKey = void 0;
const getConsoleKey = (key) => {
    const regexp = new RegExp('\-\-'.concat(key).concat('$'));
    const index = process.argv.findIndex(it => !!it.match(regexp));
    if (index == -1)
        return;
    const value = process.argv[index + 1];
    if (!value || value.match(/^\-\-/))
        return;
    return value;
};
exports.getConsoleKey = getConsoleKey;
//# sourceMappingURL=console-key.js.map