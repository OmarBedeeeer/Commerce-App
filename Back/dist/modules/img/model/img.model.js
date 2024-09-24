"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const imgSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
});
imgSchema.post(/find/, (docs, next) => {
    docs.forEach((doc) => (doc.path = doc.path));
    next();
});
const Image = mongoose_1.default.model("Image", imgSchema);
exports.default = Image;
