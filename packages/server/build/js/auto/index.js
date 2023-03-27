"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const utils_1 = require("./utils");
const handleReq_1 = __importDefault(require("./handleReq"));
const handleHttp_1 = __importDefault(require("./handleHttp"));
const parser = require('@babel/parser');
const types = require('@babel/types');
const sourceCode = fs_1.default.readFileSync((0, path_1.resolve)(__dirname, `..\\db\\index.ts`));
const ast = parser.parse(sourceCode.toString(), {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript']
});
let arr = [];
let excludeArr = ['connect'];
function traverseFn() {
    return {
        visitor: {
            ClassMethod(path) {
                if (!excludeArr.includes(path.node.key.name)) {
                    //@ts-ignore
                    let arrItem = {};
                    arrItem.fnName = path.node.key.name;
                    arrItem.params = path.node.params.map(node => { var _a; return [node.name, (0, utils_1.resolveType)((_a = node === null || node === void 0 ? void 0 : node.typeAnnotation) === null || _a === void 0 ? void 0 : _a.typeAnnotation)]; });
                    let method = arrItem.fnName.match(/.*?(?=[A-Z])/)[0];
                    arrItem.method = (method === 'get' ? 'get' : 'post');
                    arrItem.type = path.node.leadingComments &&
                        path.node.leadingComments[0].value;
                    arr.push(arrItem);
                }
            },
        },
        post() {
            (0, handleReq_1.default)(arr);
            // handleDoc(arr)
            (0, handleHttp_1.default)(arr);
        }
    };
}
(0, core_1.transformFromAstSync)(ast, '', {
    plugins: [
        traverseFn
    ]
});
//# sourceMappingURL=index.js.map