"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    image: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true,
});
const Category = mongoose_1.default.model("Category", categorySchema);
exports.default = Category;
