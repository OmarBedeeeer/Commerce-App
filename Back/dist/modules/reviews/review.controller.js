"use strict";
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
exports.reviewController = void 0;
const review_model_1 = __importDefault(require("./review.model"));
const errorhandler_1 = require("../../utils/errorhandler");
const product_model_1 = __importDefault(require("../product/model/product.model"));
exports.reviewController = {
    create: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const { user } = req;
        const product = yield product_model_1.default.findById(productId);
        if (!product)
            throw new errorhandler_1.AppError("Product not found", 404);
        const existingReview = yield review_model_1.default.findOne({
            product: productId,
            user: user.id,
        });
        if (existingReview)
            throw new errorhandler_1.AppError("You already submitted a review", 400);
        const review = yield review_model_1.default.create({
            product: productId,
            user: user.id,
            rating,
            comment,
        });
        res.status(201).json({
            message: "Review created successfully",
            review,
        });
    })),
    getReviews: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = req.params;
        const product = yield product_model_1.default.findById(productId);
        if (!product)
            throw new errorhandler_1.AppError("Product not found", 404);
        const reviews = yield review_model_1.default.find({ product: productId })
            .select("comment rating")
            .populate({
            path: "user",
            select: "username",
        })
            .populate({
            path: "product",
            select: "name averageRating numReviews",
        });
        res.status(200).json({
            reviews,
        });
    })),
    deleteReview: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = req.params;
        const product = yield product_model_1.default.findById(productId);
        if (!product)
            throw new errorhandler_1.AppError("Product not found", 404);
        const review = yield review_model_1.default.findOneAndDelete({ user: req.user.id });
        if (!review)
            throw new errorhandler_1.AppError("Review not found", 404);
        res.status(200).json({
            message: "Review deleted successfully",
            review,
        });
    })),
};
