"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const regExp = /\/\/ ?autoStart([\s\S]*)\/\/ ?autoEnd/;
function default_1(arr) {
    const filePath = (0, path_1.resolve)(__dirname, '../../client/src/request/index.tsx');
    const template = fs_1.default.readFileSync(filePath).toString();
    let match = template.match(regExp)[1];
    let apis = '';
    for (let { fnName, params, method, type } of arr) {
        apis +=
            `
export function ${fnName}(${params.map(p => `${p[0]}:${p[1]}`).join(",")}) {
  return axios.${method}<any,${type}>('/${fnName}', {
      ${params.map(p => p[0]).join(',')}
  })
}
`;
    }
    let str = template.replace(match, apis);
    // console.log(str);
    fs_1.default.writeFileSync(filePath, str);
    console.log('请求生成');
}
exports.default = default_1;
//# sourceMappingURL=handleReq.js.map