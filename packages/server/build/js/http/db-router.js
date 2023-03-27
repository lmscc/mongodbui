"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const clientMap_1 = __importDefault(require("./clientMap"));
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
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    handleResult(client.getDbAndCollections(), res);
});
dbRouter.post('/createDatabase', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName } = req.body;
    handleResult(client.createDatabase(dbName, colName), res);
});
dbRouter.post('/dropDatabase', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName } = req.body;
    handleResult(client.dropDatabase(dbName), res);
});
dbRouter.post('/createColletion', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName } = req.body;
    handleResult(client.createColletion(dbName, colName), res);
});
dbRouter.post('/dropCollection', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName } = req.body;
    handleResult(client.dropCollection(dbName, colName), res);
});
dbRouter.post('/findCollection', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName } = req.body;
    handleResult(client.findCollection(dbName, colName), res);
});
dbRouter.post('/addDocument', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName, msg } = req.body;
    handleResult(client.addDocument(dbName, colName, msg), res);
});
dbRouter.post('/deleteDocument', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName, id } = req.body;
    handleResult(client.deleteDocument(dbName, colName, id), res);
});
dbRouter.post('/findDocumentById', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName, id } = req.body;
    handleResult(client.findDocumentById(dbName, colName, id), res);
});
dbRouter.post('/findDocumnet', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName, skip, limit, condition, sort } = req.body;
    handleResult(client.findDocumnet(dbName, colName, skip, limit, condition, sort), res);
});
dbRouter.post('/updateDocument', (req, res) => {
    const { id: sessionId } = req.session;
    const client = clientMap_1.default[sessionId];
    const { dbName, colName, id, update } = req.body;
    handleResult(client.updateDocument(dbName, colName, id, update), res);
});
// autoEnd
exports.default = dbRouter;
//# sourceMappingURL=db-router.js.map