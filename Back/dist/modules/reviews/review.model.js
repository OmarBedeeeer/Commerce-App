"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const product_model_1 = __importDefault(require("../product/model/product.model"));
const reviewSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: [true, "Please provide a rating between 1 and 5"],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, "Please add a comment"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.statics.calculateAverageRating = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield this.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: "$product",
                    avgRating: { $avg: "$rating" },
                    numReviews: { $sum: 1 },
                },
            },
        ]);
        if (result.length > 0) {
            yield product_model_1.default.findByIdAndUpdate(productId, {
                averageRating: result[0].avgRating,
                numReviews: result[0].numReviews,
            });
        }
        else {
            yield product_model_1.default.findByIdAndUpdate(productId, {
                averageRating: 0,
                numReviews: 0,
            });
        }
    });
};
reviewSchema.post("save", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.calculateAverageRating(doc.product);
    });
});
reviewSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield Review.calculateAverageRating(doc.product);
        }
    });
});
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
