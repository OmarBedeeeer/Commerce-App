"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderValidation = exports.updateOrderValidation = exports.getOrderValidation = void 0;
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator.middleware"));
exports.getOrderValidation = [
    (0, express_validator_1.param)("orderId")
        .notEmpty()
        .withMessage("Order id is required")
        .isMongoId()
        .withMessage("Invalid order id")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
exports.updateOrderValidation = [
    (0, express_validator_1.param)("orderId")
        .notEmpty()
        .withMessage("Order id is required")
        .isMongoId()
        .withMessage("Invalid order id")
        .trim()
        .escape(),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["pending", "shipped", "delivered", "cancelled"])
        .withMessage("Invalid status")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
exports.deleteOrderValidation = [
    (0, express_validator_1.param)("orderId")
        .notEmpty()
        .withMessage("Order id is required")
        .isMongoId()
        .withMessage("Invalid order id")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
