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
exports.confirmCartValidation = exports.deleteProductFromCartValidation = exports.addProductsOnCartValidation = void 0;
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator.middleware"));
const product_model_1 = __importDefault(require("../../modules/product/model/product.model"));
exports.addProductsOnCartValidation = [
    (0, express_validator_1.param)("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product id")
        .trim()
        .escape(),
    (0, express_validator_1.body)("quantity")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        const productId = req.params.productId;
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (value > product.quantity) {
            throw new Error(`Requested quantity exceeds available stock. Available: ${product.quantity}`);
        }
        return true;
    }))
        .notEmpty()
        .withMessage("Quantity is required")
        .isNumeric()
        .withMessage("Quantity must be a number")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
exports.deleteProductFromCartValidation = [
    (0, express_validator_1.param)("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product id")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
exports.confirmCartValidation = [
    (0, express_validator_1.body)("address")
        .isObject()
        .withMessage("Address must be an object with street, city, state, and zip"),
    (0, express_validator_1.body)("address.street")
        .notEmpty()
        .withMessage("Street is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("address.city")
        .notEmpty()
        .withMessage("City is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("address.state")
        .notEmpty()
        .withMessage("State is required")
        .trim()
        .escape(),
    (0, express_validator_1.body)("address.zip")
        .optional()
        .isPostalCode("any")
        .withMessage("Must be a valid postal code")
        .trim()
        .escape(),
    (0, express_validator_1.body)("coupon")
        .optional()
        .isString()
        .withMessage("Coupon must be a string")
        .isLength({ min: 3, max: 10 })
        .withMessage("Coupon must be between 3 and 10 characters")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
