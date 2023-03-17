import { MongoClient, ObjectId } from 'mongodb'
import { type Collection } from 'mongodb'
interface dbTotal {
  totalSize: number | undefined
  totalSizeMb: number | undefined
}
const client = new MongoClient('mongodb://localhost:27017')

const admin = client.db().admin()
let total: dbTotal
function getSize(s: number) {
  if (s < 1000) {
    return s + 'B'
  } else if (s > 1000 && s < 1000 ** 2) {
    return (s / 1000).toFixed(2) + 'KB'
  } else if (s > 1000 ** 2 && s < 1000 ** 3) {
    return (s / 1000 ** 2).toFixed(2) + 'MB'
  }
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
export async function getDbAndCollections() {
  const dbs = await admin.listDatabases()
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
    const newDb = client.db(dbName)
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

export function createDatabase(dbName: string, colName: string) {
  return createColletion(dbName, colName)
}
/*
  boolean
*/
export function dropDatabase(dbName: string) {
  return client.db(dbName).dropDatabase()
}
/*
  string
*/
export async function createColletion(dbName: string, colName: string) {
  await client.db(dbName).createCollection(colName)
  return 'ok'
}
/*
  bool
*/
export async function dropCollection(dbName: string, colName: string) {
  return await client.db(dbName).dropCollection(colName)
}

async function findCollection(dbName: string, colName: string): Promise<Collection> {
  const cols = await client.db(dbName).collections()
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
export async function addDocument(dbName: string, colName: string, msg: object | any[]) {
  const col = await findCollection(dbName, colName)
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
export async function deleteDocument(dbName: string, colName: string, id: string) {
  const col = await findCollection(dbName, colName)
  return await col.deleteOne({
    _id: new ObjectId(id)
  })
}
/* 
  doc
*/
export async function findDocumentById(dbName: string, colName: string, id: string) {
  const col = await findCollection(dbName, colName)
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
export async function findDocumnet(
  // skip是指越过多少条,limit是限制文档条数
  dbName: string,
  colName: string,
  skip: number,
  limit: number,
  condition: object
) {
  skip = Number(skip)
  limit = Number(limit)
  const col = await findCollection(dbName, colName)
  const cursor = col.find(condition)
  const count = await cursor.count()
  if (skip >= count) {
    return await Promise.reject(`skip${skip}必须小于文档条数${count}`)
  }
  const arr = await cursor.skip(skip).limit(limit).toArray()
  console.log(count, arr)
  return {
    count,
    arr
  }
}

export async function updateDocument(dbName: string, colName: string, id: string, update: { _id?: string }) {
  const col = await findCollection(dbName, colName)
  delete update._id
  const res = await col.findOneAndReplace({ _id: new ObjectId(id) }, update)
  return res
}
