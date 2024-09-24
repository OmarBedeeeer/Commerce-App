"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDb = () => {
    mongoose_1.default
        .connect(process.env.DBCONNECTION, {
        serverSelectionTimeoutMS: 30000,
    })
        .then(() => console.log("Connected to DB successfully..."))
        .catch((error) => console.error("Error connecting to DB:", error));
};
exports.default = connectToMongoDb;
