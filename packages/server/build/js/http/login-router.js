"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../db/index"));
const clientMap_1 = __importDefault(require("./clientMap"));
const loginRouter = express_1.default.Router();
loginRouter.post('/login', (req, res, next) => {
    const { session } = req;
    const { isLogin } = session;
    if (isLogin) {
        res.send({
            data: 'isLogin',
            err: null
        });
    }
    else {
        const { uri } = req.body;
        const instance = new index_1.default();
        instance
            .connect(uri)
            .then(() => {
            clientMap_1.default[session.id] = instance;
            session.isLogin = true;
            res.send({
                err: null,
                data: 'isLogin'
            });
        })
            .catch((err) => {
            res.send({
                err: err.message || err,
                data: null
            });
        });
    }
});
loginRouter.post('/logout', (req, res, next) => {
    const { session } = req;
    session.isLogin = false;
    const { id } = session;
    clientMap_1.default[id] = null;
    res.send({
        err: null,
        data: 'logout'
    });
});
loginRouter.use((req, res, next) => {
    if (!req.session.isLogin) {
        res.send({
            err: 'no login'
        });
    }
    else {
        next();
    }
});
exports.default = loginRouter;
//# sourceMappingURL=login-router.js.map