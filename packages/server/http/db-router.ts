// @ts-nocheck
import express from 'express'
import * as DB from '../db/index'
const dbRouter = express.Router()

function handleResult(p, res) {
  p.then((result) => {
    res.json({
      err: null,
      data: result
    })
  }).catch((result) => {
    console.log('出错了')
    // 我封装的错误对象
    if (typeof result === 'string') {
      res.send({
        err: result,
        data: null
      })
    } else {
      if (result.message) {
        res.send({
          err: result.message,
          data: null
        })
      } else {
        res.send({
          err: '未知错误',
          data: null
        })
      }
    }
  })
}

// autoStart
dbRouter.get('/getDbAndCollections', (req, res) => {
  handleResult(DB.getDbAndCollections(), res)
})

dbRouter.post('/createDatabase', (req, res) => {
  const { dbName, colName } = req.body
  handleResult(DB.createDatabase(dbName, colName), res)
})

dbRouter.post('/dropDatabase', (req, res) => {
  const { dbName } = req.body
  handleResult(DB.dropDatabase(dbName), res)
})

dbRouter.post('/createColletion', (req, res) => {
  const { dbName, colName } = req.body
  handleResult(DB.createColletion(dbName, colName), res)
})

dbRouter.post('/dropCollection', (req, res) => {
  const { dbName, colName } = req.body
  handleResult(DB.dropCollection(dbName, colName), res)
})

dbRouter.post('/addDocument', (req, res) => {
  const { dbName, colName, msg } = req.body
  handleResult(DB.addDocument(dbName, colName, msg), res)
})

dbRouter.post('/deleteDocument', (req, res) => {
  const { dbName, colName, id } = req.body
  handleResult(DB.deleteDocument(dbName, colName, id), res)
})

dbRouter.post('/findDocumentById', (req, res) => {
  const { dbName, colName, id } = req.body
  handleResult(DB.findDocumentById(dbName, colName, id), res)
})

dbRouter.post('/findDocumnet', (req, res) => {
  const { dbName, colName, skip, limit, condition } = req.body
  handleResult(DB.findDocumnet(dbName, colName, skip, limit, condition), res)
})

dbRouter.post('/updateDocument', (req, res) => {
  const { dbName, colName, id, update } = req.body
  handleResult(DB.updateDocument(dbName, colName, id, update), res)
})
// autoEnd
export default dbRouter
