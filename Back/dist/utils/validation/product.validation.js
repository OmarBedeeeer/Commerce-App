"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProdVali = exports.productParamsValidation = exports.updateProductValidation = exports.createProductValidation = void 0;
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator.middleware"));
exports.createProductValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be at least 3 characters long and less than 50")
        .trim()
        .escape(),
    (0, express_validator_1.body)("description")
        .isLength({ min: 10, max: 500 })
        .withMessage("Description is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("price")
        .isNumeric()
        .custom((value) => {
        if (value < 0) {
            throw new Error("Price should be greater than 0");
        }
        return true;
    })
        .withMessage("Price is required")
        .isFloat()
        .trim()
        .escape(),
    (0, express_validator_1.body)("quantity")
        .isNumeric()
        .custom((value) => {
        if (value <= 0) {
            throw new Error("Quantity should be greater than or equal to 0");
        }
        return true;
    })
        .withMessage("Quantity is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("price_offer")
        .optional()
        .isNumeric()
        .custom((value, { req }) => {
        if (value < 0 || value > req.body.price) {
            throw new Error("invalid price offer");
        }
        return true;
    })
        .withMessage("Price is required")
        .isFloat()
        .trim()
        .escape(),
    (0, express_validator_1.param)("subCategoryId")
        .notEmpty()
        .withMessage("Name is required")
        .isMongoId()
        .withMessage("Invalid subcategory id"),
    validator_middleware_1.default,
];
exports.updateProductValidation = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be at least 3 characters long and less than 50")
        .trim()
        .escape(),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage("Description is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("price")
        .optional()
        .isNumeric()
        .custom((value) => {
        if (value < 0) {
            throw new Error("Price should be greater than 0");
        }
        return true;
    })
        .withMessage("Price is should be Number")
        .isFloat()
        .trim()
        .escape(),
    (0, express_validator_1.body)("price_offer")
        .optional()
        .isNumeric()
        .custom((value, { req }) => {
        if (value < 0 || value > req.body.price) {
            throw new Error("invalid price offer");
        }
        return true;
    })
        .withMessage("Price is required")
        .isFloat()
        .trim()
        .escape(),
    (0, express_validator_1.body)("quantity")
        .optional()
        .isNumeric()
        .custom((value) => {
        if (value <= 0) {
            throw new Error("Quantity should be greater than or equal to 0");
        }
        return true;
    })
        .withMessage("Quantity should be greater than or equal to 0")
        .trim()
        .escape(),
    (0, express_validator_1.param)("subCategoryId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid subcategory id"),
    (0, express_validator_1.param)("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product id"),
    validator_middleware_1.default,
];
exports.productParamsValidation = [
    (0, express_validator_1.param)("subCategoryId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product id"),
    (0, express_validator_1.param)("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product id"),
    validator_middleware_1.default,
];
exports.getSingleProdVali = [
    (0, express_validator_1.query)("product")
        .notEmpty()
        .withMessage("Product name is required")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
