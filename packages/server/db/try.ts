import { MongoClient } from 'mongodb'
const client = new MongoClient('mongodb://localhost:27017')
const db = client.db('qq')
db.createCollection('ff1')
  .then((doc) => {
    console.log(doc)
  })
  .catch((err) => {
    console.log(err)
  })
