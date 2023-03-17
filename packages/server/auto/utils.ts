import fs from "fs"
export function resolveType(tsType) {
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
      return 'object'
    case 'AnyTypeAnnotation':
      return 'any';
    default:
      return 'any'
  }
}
const regExp = /\/\/ ?autoStart([\s\S]*)\/\/ ?autoEnd/
export function replaceFile(filePath,str){
  const template = fs.readFileSync(filePath).toString()
  let match = template.match(regExp)[1]
  str = template.replace(match, str)
  fs.writeFileSync(filePath, str)
}