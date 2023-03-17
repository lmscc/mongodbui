"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const secret = 'qdwqfqfewfewfe';
const invalidJwtMap = {};
const loginRouter = express_1.default.Router();
loginRouter.use((req, res, next) => {
    if (req.headers.hasOwnProperty('token')) {
        req.token = req.headers.token;
        if (invalidJwtMap[req.token]) {
            next();
        }
        jsonwebtoken_1.default.verify(req.headers.token, secret, function (err, decoded) {
            if (decoded && decoded.isLogin) {
                req.isLogin = true;
            }
            next();
        });
    }
    else {
        next();
    }
});
loginRouter.post('/logout', (req, res, next) => {
    invalidJwtMap[req.token] = true;
    res.send({
        err: null,
        data: 'ok'
    });
});
loginRouter.post('/login', (req, res, next) => {
    if (req.isLogin) {
        res.json({
            err: null,
            data: {
                status: 'isLogin'
            }
        });
        next();
    }
    else {
        const { psd } = req.body;
        if (psd === 'lms156493251') {
            const token = jsonwebtoken_1.default.sign({
                isLogin: 1
            }, secret, {
                expiresIn: '2d'
            });
            res.json({
                err: null,
                data: {
                    status: 'ok',
                    jwt: token
                }
            });
        }
        else {
            res.json({
                err: null,
                data: {
                    status: 'err'
                }
            });
        }
    }
});
loginRouter.use((req, res, next) => {
    if (!req.isLogin) {
        res.json({
            err: 'token 不存在或已过时',
            data: null
        });
    }
    else {
        next();
    }
});
exports.default = loginRouter;
//# sourceMappingURL=login-router.js.map