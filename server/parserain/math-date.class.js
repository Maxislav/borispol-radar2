"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MathDate {
    getCurrentDate() {
        const d = new Date();
        const ss = Math.floor(d.getSeconds() / 30) * 30;
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), ss, 0);
    }
}
exports.MathDate = MathDate;
//# sourceMappingURL=math-date.class.js.map