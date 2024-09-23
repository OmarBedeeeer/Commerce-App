"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsParamValidation = exports.createReviewValidation = void 0;
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator.middleware"));
exports.createReviewValidation = [
    (0, express_validator_1.param)("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product id")
        .trim()
        .escape(),
    (0, express_validator_1.body)("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5")
        .escape(),
    (0, express_validator_1.body)("comment")
        .notEmpty()
        .withMessage("Comment is required")
        .isLength({ min: 10 })
        .withMessage("Comment must be at least 10 characters long")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
exports.reviewsParamValidation = [
    (0, express_validator_1.param)("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product id")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
