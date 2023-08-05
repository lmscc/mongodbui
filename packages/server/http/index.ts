import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import path from 'path'

import '../utils/expandGlobal'
import loginRouter from './login-router'
import dbRouter from './db-router'
function startServer(PORT) {
  const app = express()

  app.use(
    session({
      name: 'session-id-mongodbui',
      secret: '12345-67890',
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: false
      },
      maxAge: 3 * 24 * 3600 * 1000
    })
  )
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use((req, res, next) => {
    console.log(req.url)
    //  /question -> /
    req.url = req.url.replace(/^\/mongodbui$/, '/')
    //  /question/---  ->/---
    req.url = req.url.replace(/^\/mongodbui/, '')
    next()
  })

  app.use(
    express.static(path.resolve(__dirname, '../client'), {
      maxAge: 10 * 24 * 60 * 60 * 1000
    })
  )

  app.use(loginRouter)

  app.use(dbRouter)

  app.get('*', (req, res) => {
    res.setHeader('Cache-control', 'no-cache')
    res.sendFile(path.resolve(__dirname, '../client/index.html'))
  })

  app.listen(PORT, () => {
    console.log('run in ' + PORT)
  })
}
export default startServer
