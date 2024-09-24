"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCouponValidation = exports.getCouponValidation = exports.createCouponValidation = void 0;
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator.middleware"));
exports.createCouponValidation = [
    (0, express_validator_1.body)("coupon")
        .notEmpty()
        .withMessage("Coupon is required")
        .isLength({ min: 3, max: 10 })
        .withMessage("Coupon must be at least 3 characters long and less than 50")
        .trim()
        .escape(),
    (0, express_validator_1.body)("discountType")
        .notEmpty()
        .withMessage("Discount type is required")
        .isIn(["percentage", "fixed"])
        .withMessage("Invalid discount type")
        .trim()
        .escape(),
    (0, express_validator_1.body)("discountValue")
        .notEmpty()
        .withMessage("Discount value is required")
        .isNumeric()
        .withMessage("Discount value must be a number")
        .trim()
        .escape(),
    (0, express_validator_1.body)("minCartValue")
        .isNumeric()
        .withMessage("Minimum cart value must be a number")
        .trim()
        .escape(),
    (0, express_validator_1.body)("maxDiscountValue")
        .optional()
        .isNumeric()
        .withMessage("Maximum discount value must be a number")
        .trim()
        .escape(),
    (0, express_validator_1.body)("expiryDate")
        .notEmpty()
        .withMessage("Expiry date is required")
        .isISO8601()
        .withMessage("Invalid expiry date")
        .trim()
        .escape(),
    (0, express_validator_1.body)("usageLimit")
        .optional()
        .isNumeric()
        .withMessage("Invalid usage limit")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
exports.getCouponValidation = [
    (0, express_validator_1.param)("coupon")
        .notEmpty()
        .withMessage("Coupon is required")
        .isMongoId()
        .withMessage("Invalid coupon id"),
    validator_middleware_1.default,
];
exports.deleteCouponValidation = [
    (0, express_validator_1.param)("coupon")
        .notEmpty()
        .withMessage("Coupon is required")
        .isMongoId()
        .withMessage("Invalid coupon id"),
    validator_middleware_1.default,
];
