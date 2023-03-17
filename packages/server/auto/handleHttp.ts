import fs from "fs"
import { resolve } from "path"
const regExp = /\/\/ ?autoStart([\s\S]*)\/\/ ?autoEnd/
export default function (arr: arrItem[]) {
  const filePath = resolve(__dirname, '../http/db-router.ts')
  const template = fs.readFileSync(filePath).toString()
  let apis = ''
  for (let { fnName, params, method } of arr) {
    apis +=
      `
dbRouter.${method}('/${fnName}',(req,res)=>{
  ${params.length ? `const {${params.map(item => item[0]).join(',')}} = req.body` : ''}
  handleResult(DB.${fnName}(${params.map(item => item[0]).join(',')}),res)
})
`
  }
  let match = template.match(regExp)[1]
  let str = template.replace(match, apis)
  // console.log(str);

  fs.writeFileSync(filePath, str)
  console.log("server API 生成");
}