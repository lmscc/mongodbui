"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// expandGlobal.js
const node_url_1 = __importDefault(require("node:url"));
const node_path_1 = __importDefault(require("node:path"));
const node_module_1 = require("node:module");
Object.defineProperty(global, 'loadJSON', {
    get() {
        return (filepath, importMetaUrl) => {
            const reg = /\S+.json$/g;
            if (reg.test(filepath)) {
                const require = (0, node_module_1.createRequire)(importMetaUrl);
                return require(filepath);
            }
            else {
                throw new Error('loadJSON 的参数必须是一个json文件');
            }
        };
    },
    enumerable: true,
    configurable: false
    // writable: false,
});
Object.defineProperty(global, 'getFileName', {
    get() {
        return (importMetaUrl) => {
            return node_url_1.default.fileURLToPath(importMetaUrl);
        };
    },
    enumerable: true,
    configurable: false
    // writable: false,
});
Object.defineProperty(global, 'getDirName', {
    get() {
        return (importMetaUrl) => {
            return node_path_1.default.dirname(node_url_1.default.fileURLToPath(importMetaUrl));
        };
    },
    enumerable: true,
    configurable: false
    // writable: false,
});
//# sourceMappingURL=expandGlobal.js.map