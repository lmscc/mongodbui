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
exports.updateDocument = exports.findDocumnet = exports.findDocumentById = exports.deleteDocument = exports.addDocument = exports.dropCollection = exports.createColletion = exports.dropDatabase = exports.createDatabase = exports.getDbAndCollections = void 0;
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient('mongodb://localhost:27017');
const admin = client.db().admin();
let total;
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
/*
    [
      dbMap,
      {
        totalSize: number,
        totalSizeMb: number
      }
    ]
*/
function getDbAndCollections() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbs = yield admin.listDatabases();
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
            const newDb = client.db(dbName);
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
exports.getDbAndCollections = getDbAndCollections;
function createDatabase(dbName, colName) {
    return createColletion(dbName, colName);
}
exports.createDatabase = createDatabase;
/*
  boolean
*/
function dropDatabase(dbName) {
    return client.db(dbName).dropDatabase();
}
exports.dropDatabase = dropDatabase;
/*
  string
*/
function createColletion(dbName, colName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.db(dbName).createCollection(colName);
        return 'ok';
    });
}
exports.createColletion = createColletion;
/*
  bool
*/
function dropCollection(dbName, colName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.db(dbName).dropCollection(colName);
    });
}
exports.dropCollection = dropCollection;
function findCollection(dbName, colName) {
    return __awaiter(this, void 0, void 0, function* () {
        const cols = yield client.db(dbName).collections();
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
function addDocument(dbName, colName, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const col = yield findCollection(dbName, colName);
        if (Array.isArray(msg)) {
            return yield col.insertMany(msg);
        }
        else {
            return yield col.insertMany([msg]);
        }
    });
}
exports.addDocument = addDocument;
/*
{
  acknowledged:boolean,
  deletedCount:number
}
*/
function deleteDocument(dbName, colName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const col = yield findCollection(dbName, colName);
        return yield col.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
    });
}
exports.deleteDocument = deleteDocument;
/*
  doc
*/
function findDocumentById(dbName, colName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const col = yield findCollection(dbName, colName);
        return yield col.findOne({
            _id: new mongodb_1.ObjectId(id)
        });
    });
}
exports.findDocumentById = findDocumentById;
/*
  {
    count:number,
    arr:doc[]
  }
*/
function findDocumnet(
// skip是指越过多少条,limit是限制文档条数
dbName, colName, skip, limit, condition) {
    return __awaiter(this, void 0, void 0, function* () {
        skip = Number(skip);
        limit = Number(limit);
        const col = yield findCollection(dbName, colName);
        const cursor = col.find(condition);
        const count = yield cursor.count();
        if (skip >= count) {
            return yield Promise.reject(`skip${skip}必须小于文档条数${count}`);
        }
        const arr = yield cursor.skip(skip).limit(limit).toArray();
        console.log(count, arr);
        return {
            count,
            arr
        };
    });
}
exports.findDocumnet = findDocumnet;
function updateDocument(dbName, colName, id, update) {
    return __awaiter(this, void 0, void 0, function* () {
        const col = yield findCollection(dbName, colName);
        delete update._id;
        const res = yield col.findOneAndReplace({ _id: new mongodb_1.ObjectId(id) }, update);
        return res;
    });
}
exports.updateDocument = updateDocument;
//# sourceMappingURL=index.js.map