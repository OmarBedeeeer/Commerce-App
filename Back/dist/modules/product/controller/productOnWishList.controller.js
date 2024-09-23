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
exports.productOnWishList = void 0;
const user_model_1 = __importDefault(require("../../user/model/user.model"));
const errorhandler_1 = require("../../../utils/errorhandler");
const product_model_1 = __importDefault(require("../model/product.model"));
exports.productOnWishList = {
    addProdToWishList: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = req.params;
        let user = yield user_model_1.default.findOne({
            _id: req.user.id,
            deleted: false,
        });
        if (!user)
            throw new errorhandler_1.AppError("Please Login first", 404);
        const product = yield product_model_1.default.findById({
            _id: productId,
            deleted: false,
        });
        if (!product)
            throw new errorhandler_1.AppError("Product not found", 404);
        user = yield user_model_1.default.findByIdAndUpdate(req.user.id, {
            $addToSet: { wishList: productId },
        }, {
            new: true,
        })
            .select("username wishList")
            .populate({
            path: "wishList",
            select: "name price image",
        });
        if (!user)
            throw new errorhandler_1.AppError("Please Login first", 404);
        res.status(200).json({
            message: "Product added to wishlist",
            success: true,
            user,
        });
    })),
    getWishList: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default.findOne({
            _id: req.user.id,
            deleted: false,
        })
            .select("username wishList")
            .populate({
            path: "wishList",
            select: "name price image",
        });
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        res.status(200).json({
            message: "WishList loaded",
            success: true,
            user,
        });
    })),
    removeFromWishList: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = req.params;
        let user = yield user_model_1.default.findOne({
            _id: req.user.id,
            deleted: false,
        });
        if (!user)
            throw new errorhandler_1.AppError("Please Login first", 404);
        user = yield user_model_1.default.findByIdAndUpdate(req.user.id, {
            $pull: { wishList: productId },
        }, {
            new: true,
        })
            .select("username wishList")
            .populate({
            path: "wishList",
            select: "name price image",
        });
        if (!user)
            throw new errorhandler_1.AppError("Please Login first", 404);
        res.status(200).json({
            message: "Product removed from wishlist",
            success: true,
            user,
        });
    })),
};
