import { type Admin, MongoClient, ObjectId, type Collection, type Sort } from 'mongodb'

// const client = new MongoClient('mongodb://116.205.239.59:27017')

function getSize(s: number) {
  if (s < 1000) {
    return s + 'B'
  } else if (s > 1000 && s < 1000 ** 2) {
    return (s / 1000).toFixed(2) + 'KB'
  } else if (s > 1000 ** 2 && s < 1000 ** 3) {
    return (s / 1000 ** 2).toFixed(2) + 'MB'
  }
}
export default class Client {
  admin: Admin
  client: MongoClient
  connect(uri) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, (err, client: MongoClient) => {
        // 有填用户密码的情况下会有err
        if (err) {
          reject(err) // authentication fail
          return
        }
        // 没有用户密码，会到这里，还是要验证一下才能确定是否连上
        client
          .db()
          .admin()
          .listDatabases()
          .then((res) => {
            console.log('in connect', err, 'client')
            this.client = client
            this.admin = client.db().admin()
            resolve(client)
          })
          .catch((err) => {
            // requires authentication
            reject(err)
            console.log(err)
          })
        // try {
        //   const res = await client.db().admin().ping()
        //   console.log('res',res);

        // } catch (err) {
        //   console.log('no login',err);

        //   return false
        // }
      })
    })
  }

  /* 
    [
      dbMap,
      {
        totalSize: number,
        totalSizeMb: number
      }
    ]
*/
  async getDbAndCollections() {
    const dbs = await this.admin.listDatabases()
    const total = {
      totalSize: dbs.totalSize,
      totalSizeMb: dbs.totalSizeMb
    }
    const sendMap: Record<string, any> = {}
    for (const dbInfo of dbs.databases) {
      const { name: dbName } = dbInfo
      sendMap[dbName] = {
        originSize: dbInfo.sizeOnDisk,
        sizeOnDisk: getSize(dbInfo.sizeOnDisk),
        collections: []
      }
      const newDb = this.client.db(dbName)
      const cols = await newDb.collections()
      for (const col of cols) {
        const stats = await col.stats()
        const name = stats.ns.replace(`${dbName}.`, '')
        if (name !== 'system.version') {
          sendMap[dbName].collections.push({
            name: stats.ns.replace(`${dbName}.`, ''),
            count: stats.count,
            storageSize: getSize(stats.storageSize),
            storageSizeOrigin: stats.storageSize,
            totalIndexSize: getSize(stats.totalIndexSize),
            totalIndexSizeOrgin: stats.totalIndexSize,
            avgObjSize: getSize(stats.avgObjSize),
            avgObjSizeOrigin: stats.avgObjSize
          })
        }
      }
    }
    return [sendMap, total]
  }

  createDatabase(dbName: string, colName: string) {
    return this.createColletion(dbName, colName)
  }

  /*
  boolean
*/
  async dropDatabase(dbName: string) {
    return await this.client.db(dbName).dropDatabase()
  }

  /*
  string
*/
  async createColletion(dbName: string, colName: string) {
    await this.client.db(dbName).createCollection(colName)
    return 'ok'
  }

  /*
  boolean
*/
  async dropCollection(dbName: string, colName: string) {
    return await this.client.db(dbName).dropCollection(colName)
  }

  /*
  collection
  */
  async findCollection(dbName: string, colName: string): Promise<Collection> {
    const cols = await this.client.db(dbName).collections()
    for (const col of cols) {
      if (col.collectionName === colName) {
        return col
      }
    }
    return await Promise.reject(`${dbName}中无${colName}集合`)
  }

  /*
{
  acknowledged: boolean,
  insertedCount: number,
  insertedIds: string[]
}
*/
  async addDocument(dbName: string, colName: string, msg: object | any[]) {
    const col = await this.findCollection(dbName, colName)
    if (Array.isArray(msg)) {
      return await col.insertMany(msg)
    } else {
      return await col.insertMany([msg])
    }
  }

  /*
{
  acknowledged:boolean,
  deletedCount:number
}
*/
  async deleteDocument(dbName: string, colName: string, id: string) {
    const col = await this.findCollection(dbName, colName)
    return await col.deleteOne({
      _id: new ObjectId(id)
    })
  }

  /* 
  doc
*/
  async findDocumentById(dbName: string, colName: string, id: string) {
    const col = await this.findCollection(dbName, colName)
    return await col.findOne({
      _id: new ObjectId(id)
    })
  }

  /*
  {
    count:number,
    arr:doc[]
  }
*/
  async findDocumnet(
    // skip是指越过多少条,limit是限制文档条数
    dbName: string,
    colName: string,
    skip: number,
    limit: number,
    condition: object,
    sort: Sort
  ) {
    skip = Number(skip)
    limit = Number(limit)
    const col = await this.findCollection(dbName, colName)
    const cursor = col.find(condition, {
      sort
    })
    const count = await cursor.count()
    const arr = await cursor.skip(skip).limit(limit).toArray()
    console.log(count, arr)
    return {
      count,
      arr
    }
  }

  async updateDocument(dbName: string, colName: string, id: string, update: { _id?: string }) {
    const col = await this.findCollection(dbName, colName)
    delete update._id
    const res = await col.findOneAndReplace({ _id: new ObjectId(id) }, update)
    return res
  }
}
