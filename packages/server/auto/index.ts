// import parser from "@babel/parser"
import traverse from '@babel/traverse'
import type { Visitor } from 'babel-traverse'
import generate from '@babel/generator'
import { transformFromAstSync } from "@babel/core"
import fs from 'fs'
import { resolve } from 'path'
import { resolveType } from "./utils"

import handleReq from "./handleReq"
import handleHttp from "./handleHttp"
import handleDoc from "./handleDoc"
const parser = require('@babel/parser')
const types = require('@babel/types')
const sourceCode = fs.readFileSync(resolve(__dirname, `..\\db\\index.ts`))

const ast = parser.parse(sourceCode.toString(), {
  sourceType: 'unambiguous',
  plugins: ['jsx', 'typescript']
})
let arr = []
let excludeArr = ['connect','findCollection']
function traverseFn() {
  return {
    visitor: {
      ClassMethod(path) {
        if ( !excludeArr.includes(path.node.key.name)) {
          //@ts-ignore
          let arrItem: arrItem = {}
          arrItem.fnName = path.node.key.name
          arrItem.params = path.node.params.map(node =>
            [node.name, resolveType(node?.typeAnnotation?.typeAnnotation)]
          )
          let method = arrItem.fnName.match(/.*?(?=[A-Z])/)[0]
          arrItem.method = (method === 'get' ? 'get' : 'post')
          arrItem.type = path.node.leadingComments &&
            path.node.leadingComments[0].value
          arr.push(arrItem)
        }
      },
    },
    post() {
      // handleReq(arr)
      handleDoc(arr)
      // handleHttp(arr)
    }
  }
}
transformFromAstSync(ast, '', {
  plugins: [
    traverseFn
  ]
})
