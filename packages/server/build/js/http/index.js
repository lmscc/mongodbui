"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
require("../utils/expandGlobal");
const login_router_1 = __importDefault(require("./login-router"));
const db_router_1 = __importDefault(require("./db-router"));
const app = (0, express_1.default)();
const PORT = 3016;
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
app.use(express_1.default.static(path_1.default.resolve(__dirname, './client'), {
    maxAge: 10 * 24 * 60 * 60 * 1000
}));
app.use(login_router_1.default);
app.use(db_router_1.default);
app.get('*', (req, res) => {
    res.setHeader('Cache-control', 'no-cache');
    res.sendFile(path_1.default.resolve(__dirname, './client/index.html'));
});
app.listen(PORT, () => {
    console.log('run in ' + PORT);
});
//# sourceMappingURL=index.js.map