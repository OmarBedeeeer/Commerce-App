"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50,
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 500,
        minlength: 10,
        lowercase: true,
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
    },
    image: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Image",
        },
    ],
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
categorySchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const Category = mongoose_1.default.model("Category", categorySchema);
exports.default = Category;
