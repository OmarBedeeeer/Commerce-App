"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_connection_1 = __importDefault(require("./db/db.connection"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.get("/", (req, res, next) => {
    res.send("Hello World");
});
app.all("*", (req, res, next) => {
    res.status(404).send("Can't find this Page");
});
const port = process.env.PORT;
(0, db_connection_1.default)();
app.listen(port, () => {
    console.log(`App listening on port`);
});
