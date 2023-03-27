import { MongoClient } from 'mongodb'

const client = MongoClient.connect(
  'mongodb://admin:Abc123++@localhost:27017',
  { connectTimeoutMS: 100, socketTimeoutMS: 100 },
  (err, client) => {
    if (err) {
      return err
    }
    const admin = client.db().admin()
    admin
      .listDatabases()
      .then((res) => {
        console.log('res', res)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
)

// const db = client.db('qq')
// db.createCollection('ff1')
//   .then((doc) => {
//     console.log(doc)
//   })
//   .catch((err) => {
//     console.log(err)
//   })
