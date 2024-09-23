"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userParamControlValidation = exports.paramValidation = exports.updateUserValidation = exports.changePassValidation = exports.validateLogin = exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
const validator_middleware_1 = __importDefault(require("../../middlewares/validator.middleware"));
exports.createUserValidation = [
    (0, express_validator_1.body)("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be at least 3 characters long and less than 50")
        .trim()
        .escape(),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email")
        .trim()
        .escape(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be between 6 and 12 characters long")
        .trim()
        .escape(),
    (0, express_validator_1.body)("phoneNumber")
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("ar-EG")
        .withMessage("Invalid phone number")
        .trim()
        .escape(),
    (0, express_validator_1.body)("address")
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 6, max: 500 })
        .withMessage("Address must be at least 10 characters long and less than 500")
        .trim()
        .escape(),
    (0, express_validator_1.body)("role").isLength({ min: 0, max: 0 }).withMessage("Role isn't required"),
    (0, express_validator_1.body)("age").optional().isNumeric().withMessage("Age must be a number").trim(),
    validator_middleware_1.default,
];
exports.validateLogin = [
    (0, express_validator_1.body)("userName")
        .notEmpty()
        .withMessage("Username is required")
        .custom((value) => {
        if (!/^\S+@\S+\.\S+$/.test(value) && !/^\+?\d{10,15}$/.test(value)) {
            throw new Error("Username must be a valid email or phone number");
        }
        return true;
    })
        .trim()
        .escape(),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 12 })
        .withMessage("Password must be at least 6 characters long and less than 12")
        .trim()
        .escape(),
    validator_middleware_1.default,
];
exports.changePassValidation = [
    (0, express_validator_1.body)("oldPassword")
        .notEmpty()
        .withMessage("Old password is required")
        .isLength({ min: 6, max: 12 })
        .withMessage("Old password must be at least 6 characters long and less than 12")
        .trim()
        .escape(),
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6, max: 12 })
        .withMessage("New password must be at least 6 characters long and less than 12")
        .trim()
        .escape(),
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user id")
        .trim(),
    validator_middleware_1.default,
];
exports.updateUserValidation = [
    (0, express_validator_1.body)("username")
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be at least 3 characters long and less than 50")
        .trim()
        .escape(),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email")
        .trim()
        .escape(),
    (0, express_validator_1.body)("phoneNumber")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("Invalid phone number")
        .trim()
        .escape(),
    (0, express_validator_1.body)("address")
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage("Address must be at least 10 characters long and less than 500")
        .trim()
        .escape(),
    (0, express_validator_1.body)("age").optional().isNumeric().withMessage("Age must be a number").trim(),
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user id")
        .trim(),
    validator_middleware_1.default,
];
exports.paramValidation = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user id")
        .trim(),
    validator_middleware_1.default,
];
exports.userParamControlValidation = [
    (0, express_validator_1.param)("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user id")
        .trim(),
    validator_middleware_1.default,
];
