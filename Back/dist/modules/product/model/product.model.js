"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50,
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 500,
    },
    slug: {
        type: String,
        unique: true,
    },
    image: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Image",
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
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
    Subcategory: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Subcategory",
    },
}, {
    timestamps: true,
});
productSchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
