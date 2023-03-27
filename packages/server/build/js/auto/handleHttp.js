"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const regExp = /\/\/ ?autoStart([\s\S]*)\/\/ ?autoEnd/;
function default_1(arr) {
    const filePath = (0, path_1.resolve)(__dirname, '../http/db-router.ts');
    const template = fs_1.default.readFileSync(filePath).toString();
    let apis = '';
    for (let { fnName, params, method } of arr) {
        apis +=
            `
dbRouter.${method}('/${fnName}',(req,res)=>{
  const {id:sessionId} = req.session
  const client = clientMap[sessionId]
  ${params.length ? `const {${params.map(item => item[0]).join(',')}} = req.body` : ''}
  handleResult(client.${fnName}(${params.map(item => item[0]).join(',')}),res)
})
`;
    }
    let match = template.match(regExp)[1];
    let str = template.replace(match, apis);
    // console.log(str);
    fs_1.default.writeFileSync(filePath, str);
    console.log("server API 生成");
}
exports.default = default_1;
//# sourceMappingURL=handleHttp.js.map