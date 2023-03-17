"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const docTemplate_json_1 = __importDefault(require("./docTemplate.json"));
const fs_1 = __importDefault(require("fs"));
const hostName = "localhost";
const port = 3016;
function getObj(name, parmas, method) {
    let str = "";
    for (let i = 0; i < parmas.length; i++) {
        if (i === parmas.length - 1) {
            str += `"${parmas[i][0]}":""\n`;
        }
        else {
            str += `"${parmas[i][0]}":"",\n`;
        }
    }
    str = "{\n" + str + "}";
    return {
        "name": name,
        "request": {
            "method": method,
            "header": [],
            "body": {
                "mode": "raw",
                "raw": str,
                "options": {
                    "raw": {
                        "language": "json"
                    }
                }
            },
            "url": {
                "raw": `http://${hostName}:${port}/${name}`,
                "protocol": "http",
                "host": [
                    hostName
                ],
                "port": port,
                "path": [
                    name
                ]
            }
        },
        "response": []
    };
}
function default_1(arr) {
    let a = [];
    for (let { fnName, params, method } of arr) {
        a.push(getObj(fnName, params, method));
    }
    docTemplate_json_1.default.item = a;
    fs_1.default.writeFileSync("doc.json", JSON.stringify(docTemplate_json_1.default));
    fs_1.default.writeFileSync("D:\\桌面\\doc.json", JSON.stringify(docTemplate_json_1.default));
    console.log("文档生成");
}
exports.default = default_1;
//# sourceMappingURL=handleDoc.js.map