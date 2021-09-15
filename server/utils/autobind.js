"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autobind = void 0;
const autobind = () => {
    return (target, key, descriptor) => {
        let fn = descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
        let definingProperty = false;
        return {
            configurable: true,
            get() {
                const boundFn = fn.bind(this);
                Object.defineProperty(this, key, {
                    configurable: true,
                    get() {
                        return boundFn;
                    },
                    set(value) {
                        fn = value;
                        delete this[key];
                    },
                });
                definingProperty = false;
                return boundFn;
            },
            set(value) {
                fn = value;
            },
        };
    };
};
exports.autobind = autobind;
//# sourceMappingURL=autobind.js.map