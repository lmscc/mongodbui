"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceFile = exports.resolveType = void 0;
const fs_1 = __importDefault(require("fs"));
function resolveType(tsType) {
    if (!tsType) {
        return;
    }
    switch (tsType.type) {
        case 'TSStringKeyword':
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSBooleanKeyword':
            return 'boolean';
        case 'TSObjectKeyword':
            return 'object';
        case 'AnyTypeAnnotation':
            return 'any';
        default:
            return 'any';
    }
}
exports.resolveType = resolveType;
const regExp = /\/\/ ?autoStart([\s\S]*)\/\/ ?autoEnd/;
function replaceFile(filePath, str) {
    const template = fs_1.default.readFileSync(filePath).toString();
    let match = template.match(regExp)[1];
    str = template.replace(match, str);
    fs_1.default.writeFileSync(filePath, str);
}
exports.replaceFile = replaceFile;
//# sourceMappingURL=utils.js.map