"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const DB = __importStar(require("../db/index"));
const dbRouter = express_1.default.Router();
function handleResult(p, res) {
    p.then((result) => {
        res.json({
            err: null,
            data: result
        });
    }).catch((result) => {
        console.log('出错了');
        // 我封装的错误对象
        if (typeof result === 'string') {
            res.send({
                err: result,
                data: null
            });
        }
        else {
            if (result.message) {
                res.send({
                    err: result.message,
                    data: null
                });
            }
            else {
                res.send({
                    err: '未知错误',
                    data: null
                });
            }
        }
    });
}
// autoStart
dbRouter.get('/getDbAndCollections', (req, res) => {
    handleResult(DB.getDbAndCollections(), res);
});
dbRouter.post('/createDatabase', (req, res) => {
    const { dbName, colName } = req.body;
    handleResult(DB.createDatabase(dbName, colName), res);
});
dbRouter.post('/dropDatabase', (req, res) => {
    const { dbName } = req.body;
    handleResult(DB.dropDatabase(dbName), res);
});
dbRouter.post('/createColletion', (req, res) => {
    const { dbName, colName } = req.body;
    handleResult(DB.createColletion(dbName, colName), res);
});
dbRouter.post('/dropCollection', (req, res) => {
    const { dbName, colName } = req.body;
    handleResult(DB.dropCollection(dbName, colName), res);
});
dbRouter.post('/addDocument', (req, res) => {
    const { dbName, colName, msg } = req.body;
    handleResult(DB.addDocument(dbName, colName, msg), res);
});
dbRouter.post('/deleteDocument', (req, res) => {
    const { dbName, colName, id } = req.body;
    handleResult(DB.deleteDocument(dbName, colName, id), res);
});
dbRouter.post('/findDocumentById', (req, res) => {
    const { dbName, colName, id } = req.body;
    handleResult(DB.findDocumentById(dbName, colName, id), res);
});
dbRouter.post('/findDocumnet', (req, res) => {
    const { dbName, colName, skip, limit, condition } = req.body;
    handleResult(DB.findDocumnet(dbName, colName, skip, limit, condition), res);
});
dbRouter.post('/updateDocument', (req, res) => {
    const { dbName, colName, id, update } = req.body;
    handleResult(DB.updateDocument(dbName, colName, id, update), res);
});
// autoEnd
exports.default = dbRouter;
//# sourceMappingURL=db-router.js.map