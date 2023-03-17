getDbAndCol()

dropDb(name)
addDb(name)

dropCol(dbName,colName)
addCol(dbName,colName)

dropDoc(dbName,colName,query)
addDoc(dbName,colName,item)
updateDoc(dbName,colName,query,item)

serachDoc(dbName,colName)


// @ts-nocheck
import jwt from 'jsonwebtoken'
import express from 'express'

const secret = 'qdwqfqfewfewfe'
const invalidJwtMap = {}
const loginRouter = express.Router()
loginRouter.use((req, res, next) => {
  if (req.headers.hasOwnProperty('token')) {
    req.token = req.headers.token
    if (invalidJwtMap[req.token]) {
      next()
    }
    jwt.verify(req.headers.token, secret, function (err, decoded) {
      if (decoded && decoded.isLogin) {
        req.isLogin = true
      }
      next()
    })
  } else {
    next()
  }
})
loginRouter.post('/logout', (req, res, next) => {
  invalidJwtMap[req.token] = true
  res.send({
    err: null,
    data: 'ok'
  })
})
loginRouter.post('/login', (req, res, next) => {
  if (req.isLogin) {
    res.json({
      err: null,
      data: {
        status: 'isLogin'
      }
    })
    next()
  } else {
    const { psd } = req.body
    if (psd === 'lms156493251') {
      const token = jwt.sign(
        {
          isLogin: 1
        },
        secret,
        {
          expiresIn: '2d'
        }
      )
      res.json({
        err: null,
        data: {
          status: 'ok',
          jwt: token
        }
      })
    } else {
      res.json({
        err: null,
        data: {
          status: 'err'
        }
      })
    }
  }
})
loginRouter.use((req, res, next) => {
  if (!req.isLogin) {
    res.json({
      err: 'token 不存在或已过时',
      data: null
    })
  } else {
    next()
  }
})
export default loginRouter
