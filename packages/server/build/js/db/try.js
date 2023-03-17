"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient('mongodb://localhost:27017');
const db = client.db('qq');
db.createCollection('ff1')
    .then((doc) => {
    console.log(doc);
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=try.js.map