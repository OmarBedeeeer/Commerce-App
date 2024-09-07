import { RequestHandler } from "express";

import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

export const createUserValidation: RequestHandler[] = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be at least 3 characters long and less than 50")
    .trim()
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters long")
    .trim()
    .escape(),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number")
    .trim()
    .escape(),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 6, max: 500 })
    .withMessage(
      "Address must be at least 10 characters long and less than 500"
    )
    .trim()
    .escape(),
  body("role").isLength({ min: 0, max: 0 }).withMessage("Role isn't required"),
  body("age").optional().isNumeric().withMessage("Age must be a number").trim(),
  validatorMiddleware,
];

export const validateLogin = [
  body("userName")
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
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be at least 6 characters long and less than 12")
    .trim()
    .escape(),
  validatorMiddleware,
];

export const changePassValidation: RequestHandler[] = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage(
      "Old password must be at least 6 characters long and less than 12"
    )
    .trim()
    .escape(),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage(
      "New password must be at least 6 characters long and less than 12"
    )
    .trim()
    .escape(),
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user id")
    .trim(),
  validatorMiddleware,
];

export const updateUserValidation: RequestHandler[] = [
  body("username")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be at least 3 characters long and less than 50")
    .trim()
    .escape(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .trim()
    .escape(),
  body("phoneNumber")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number")
    .trim()
    .escape(),
  body("address")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage(
      "Address must be at least 10 characters long and less than 500"
    )
    .trim()
    .escape(),
  body("age").optional().isNumeric().withMessage("Age must be a number").trim(),
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user id")
    .trim(),
  validatorMiddleware,
];

export const paramValidation: RequestHandler[] = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user id")
    .trim(),
  validatorMiddleware,
];

export const userParamControlValidation: RequestHandler[] = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user id")
    .trim(),

  validatorMiddleware,
];
