// @ts-nocheck
import express from 'express'

import clientMap from './clientMap'
import Client from '../db/index'
const loginRouter = express.Router()

loginRouter.post('/login', (req, res, next) => {
  const { session } = req
  const { isLogin } = session
  if (isLogin) {
    res.send({
      data: 'isLogin',
      err: null
    })
  } else {
    const { uri } = req.body
    const instance = new Client()
    instance
      .connect(uri)
      .then(() => {
        clientMap[session.id] = instance
        session.isLogin = true
        res.send({
          err: null,
          data: 'isLogin'
        })
      })
      .catch((err) => {
        res.send({
          err: err.message || err,
          data: null
        })
      })
  }
})
loginRouter.post('/logout', (req, res, next) => {
  const { session } = req
  session.isLogin = false
  const { id } = session
  clientMap[id] = null
  res.send({
    err: null,
    data: 'logout'
  })
})
loginRouter.use((req, res, next) => {
  if (!req.session.isLogin) {
    res.send({
      err: 'no login'
    })
  } else {
    next()
  }
})
export default loginRouter
