"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subCategorySchema = new mongoose_1.default.Schema({
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
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
    },
}, {
    timestamps: true,
});
const subCategory = mongoose_1.default.model("SubCategory", subCategorySchema);
exports.default = subCategory;
