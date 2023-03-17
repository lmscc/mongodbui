import doc from "./docTemplate.json"
import fs from "fs"
const hostName = "localhost"
const port = 3016
function getObj(name, parmas, method) {
  let str = ""
  for (let i = 0; i < parmas.length; i++) {
    if (i === parmas.length - 1) {
      str += `"${parmas[i][0]}":""\n`
    } else {
      str += `"${parmas[i][0]}":"",\n`
    }
  }
  str = "{\n" + str + "}"

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
  }
}
export default function (arr: arrItem[]) {
  let a = []
  for (let { fnName, params, method } of arr) {
    a.push(getObj(fnName, params, method))
  }
  doc.item = a
  fs.writeFileSync("doc.json", JSON.stringify(doc))
  fs.writeFileSync("D:\\桌面\\doc.json", JSON.stringify(doc))
  console.log("文档生成");
}