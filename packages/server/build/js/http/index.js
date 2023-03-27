"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
require("../utils/expandGlobal");
const login_router_1 = __importDefault(require("./login-router"));
const db_router_1 = __importDefault(require("./db-router"));
function startServer(PORT) {
    const app = (0, express_1.default)();
    app.use((0, express_session_1.default)({
        name: 'session-id-mongodbui',
        secret: '12345-67890',
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: false
        },
        maxAge: 3 * 24 * 3600 * 1000
    }));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use((req, res, next) => {
        console.log(req.url);
        //  /question -> /
        req.url = req.url.replace(/^\/mongodbui$/, '/');
        //  /question/---  ->/---
        req.url = req.url.replace(/^\/mongodbui/, '');
        next();
    });
    app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client'), {
        maxAge: 10 * 24 * 60 * 60 * 1000
    }));
    app.use(login_router_1.default);
    app.use(db_router_1.default);
    app.get('*', (req, res) => {
        res.setHeader('Cache-control', 'no-cache');
        res.sendFile(path_1.default.resolve(__dirname, '../client/index.html'));
    });
    app.listen(PORT, () => {
        console.log('run in ' + PORT);
    });
}
exports.default = startServer;
//# sourceMappingURL=index.js.map