"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
// const client = new MongoClient('mongodb://116.205.239.59:27017')
function getSize(s) {
    if (s < 1000) {
        return s + 'B';
    }
    else if (s > 1000 && s < 1000 ** 2) {
        return (s / 1000).toFixed(2) + 'KB';
    }
    else if (s > 1000 ** 2 && s < 1000 ** 3) {
        return (s / 1000 ** 2).toFixed(2) + 'MB';
    }
}
class Client {
    connect(uri) {
        return new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect(uri, (err, client) => {
                // 有填用户密码的情况下会有err
                if (err) {
                    reject(err); // authentication fail
                    return;
                }
                // 没有用户密码，会到这里，还是要验证一下才能确定是否连上
                client
                    .db()
                    .admin()
                    .listDatabases()
                    .then((res) => {
                    console.log('in connect', err, 'client');
                    this.client = client;
                    this.admin = client.db().admin();
                    resolve(client);
                })
                    .catch((err) => {
                    // requires authentication
                    reject(err);
                    console.log(err);
                });
                // try {
                //   const res = await client.db().admin().ping()
                //   console.log('res',res);
                // } catch (err) {
                //   console.log('no login',err);
                //   return false
                // }
            });
        });
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
    getDbAndCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbs = yield this.admin.listDatabases();
            const total = {
                totalSize: dbs.totalSize,
                totalSizeMb: dbs.totalSizeMb
            };
            const sendMap = {};
            for (const dbInfo of dbs.databases) {
                const { name: dbName } = dbInfo;
                sendMap[dbName] = {
                    originSize: dbInfo.sizeOnDisk,
                    sizeOnDisk: getSize(dbInfo.sizeOnDisk),
                    collections: []
                };
                const newDb = this.client.db(dbName);
                const cols = yield newDb.collections();
                for (const col of cols) {
                    const stats = yield col.stats();
                    const name = stats.ns.replace(`${dbName}.`, '');
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
                        });
                    }
                }
            }
            return [sendMap, total];
        });
    }
    createDatabase(dbName, colName) {
        return this.createColletion(dbName, colName);
    }
    /*
    boolean
  */
    dropDatabase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.db(dbName).dropDatabase();
        });
    }
    /*
    string
  */
    createColletion(dbName, colName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.db(dbName).createCollection(colName);
            return 'ok';
        });
    }
    /*
    boolean
  */
    dropCollection(dbName, colName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.db(dbName).dropCollection(colName);
        });
    }
    /*
    collection
    */
    findCollection(dbName, colName) {
        return __awaiter(this, void 0, void 0, function* () {
            const cols = yield this.client.db(dbName).collections();
            for (const col of cols) {
                if (col.collectionName === colName) {
                    return col;
                }
            }
            return yield Promise.reject(`${dbName}中无${colName}集合`);
        });
    }
    /*
  {
    acknowledged: boolean,
    insertedCount: number,
    insertedIds: string[]
  }
  */
    addDocument(dbName, colName, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const col = yield this.findCollection(dbName, colName);
            if (Array.isArray(msg)) {
                return yield col.insertMany(msg);
            }
            else {
                return yield col.insertMany([msg]);
            }
        });
    }
    /*
  {
    acknowledged:boolean,
    deletedCount:number
  }
  */
    deleteDocument(dbName, colName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const col = yield this.findCollection(dbName, colName);
            return yield col.deleteOne({
                _id: new mongodb_1.ObjectId(id)
            });
        });
    }
    /*
    doc
  */
    findDocumentById(dbName, colName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const col = yield this.findCollection(dbName, colName);
            return yield col.findOne({
                _id: new mongodb_1.ObjectId(id)
            });
        });
    }
    /*
    {
      count:number,
      arr:doc[]
    }
  */
    findDocumnet(
    // skip是指越过多少条,limit是限制文档条数
    dbName, colName, skip, limit, condition, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            skip = Number(skip);
            limit = Number(limit);
            const col = yield this.findCollection(dbName, colName);
            const cursor = col.find(condition, {
                sort
            });
            const count = yield cursor.count();
            const arr = yield cursor.skip(skip).limit(limit).toArray();
            console.log(count, arr);
            return {
                count,
                arr
            };
        });
    }
    updateDocument(dbName, colName, id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const col = yield this.findCollection(dbName, colName);
            delete update._id;
            const res = yield col.findOneAndReplace({ _id: new mongodb_1.ObjectId(id) }, update);
            return res;
        });
    }
}
exports.default = Client;
//# sourceMappingURL=index.js.map