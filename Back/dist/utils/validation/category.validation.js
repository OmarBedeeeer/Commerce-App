"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramValidation = exports.updateCategoryValidation = exports.createCategoryValidation = void 0;
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator.middleware"));
exports.createCategoryValidation = [
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
    validator_middleware_1.default,
];
exports.updateCategoryValidation = [
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
    (0, express_validator_1.param)("categoryId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid category id"),
    validator_middleware_1.default,
];
exports.paramValidation = [
    (0, express_validator_1.param)("categoryId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid category id"),
    validator_middleware_1.default,
];
