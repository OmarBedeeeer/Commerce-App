"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const subcatSchema = new mongoose_1.default.Schema({
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
        trim: true,
        unique: true,
    },
    image: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Image",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
    modifed_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    created_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
    },
}, {
    timestamps: true,
});
subcatSchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const Subcategory = mongoose_1.default.model("Subcategory", subcatSchema);
exports.default = Subcategory;
