import { resolve } from "path"
import fs from "fs"
const regExp = /\/\/ ?autoStart([\s\S]*)\/\/ ?autoEnd/

export default function (arr: arrItem[]) {

  const filePath = resolve(__dirname, '../../client/src/request/index.tsx')
  const template = fs.readFileSync(filePath).toString()
  let match = template.match(regExp)[1]

  let apis = ''
  for (let { fnName, params, method, type } of arr) {
    apis +=
      `
export function ${fnName}(${params.map(p => `${p[0]}:${p[1]}`).join(",")}) {
  return axios.${method}<any,${type}>('/${fnName}', {
      ${params.map(p => p[0]).join(',')}
  })
}
`
  }

  let str = template.replace(match, apis)
  // console.log(str);
  fs.writeFileSync(filePath, str)
  console.log('请求生成');
}