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
exports.couponController = void 0;
const errorhandler_1 = require("../../../utils/errorhandler");
const coupon_model_1 = __importDefault(require("./coupon.model"));
exports.couponController = {
    createCoupon: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { coupon, discountType, discountValue, minCartValue, maxDiscountValue, expiryDate, isActive, usageLimit, } = req.body;
        const existingCoupon = yield coupon_model_1.default.findOne({ coupon });
        if (existingCoupon) {
            throw new errorhandler_1.AppError("Coupon already exists", 400);
        }
        const createCoupon = yield coupon_model_1.default.create({
            coupon,
            discountType,
            discountValue,
            minCartValue,
            maxDiscountValue,
            expiryDate,
            isActive,
            usageLimit,
        });
        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: createCoupon,
        });
    })),
    getCoupon: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield coupon_model_1.default.findOne({
            _id: req.params.coupon,
        });
        if (!coupon)
            throw new errorhandler_1.AppError("Coupon not found", 404);
        res.status(200).json({
            success: true,
            data: coupon,
        });
    })),
    getAllCoupons: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const coupons = yield coupon_model_1.default.find();
        res.status(200).json({
            success: true,
            data: coupons,
        });
    })),
    deleteCoupon: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const coupon = yield coupon_model_1.default.findOneAndDelete({
            _id: req.params.coupon,
        });
        if (!coupon)
            throw new errorhandler_1.AppError("Coupon not found", 404);
        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    })),
};
