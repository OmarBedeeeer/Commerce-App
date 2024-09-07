import { RequestHandler } from "express";

import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

export const createCategoryValidation: RequestHandler[] = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be at least 3 characters long and less than 50")
    .trim()
    .escape(),
  body("description")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description is required")
    .trim()
    .escape(),
  validatorMiddleware,
];

export const updateCategoryValidation: RequestHandler[] = [
  body("name")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be at least 3 characters long and less than 50")
    .trim()
    .escape(),
  body("description")
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description is required")
    .trim()
    .escape(),
  param("categoryId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid category id"),
  validatorMiddleware,
];

export const paramValidation: RequestHandler[] = [
  param("categoryId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid category id"),
  validatorMiddleware,
];
