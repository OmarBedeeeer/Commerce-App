import { RequestHandler } from "express";

import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

export const createSubCategoryValidation: RequestHandler[] = [
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

  query("category_name")
    .notEmpty()
    .isString()
    .withMessage("Category ID is required")
    .trim()
    .escape(),
  validatorMiddleware,
];

export const updateSubCategoryValidation: RequestHandler[] = [
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
  param("subCategoryId")
    .notEmpty()
    .withMessage("Subcategory ID is required")
    .isMongoId()
    .withMessage("Invalid subcategory id")
    .trim(),
  validatorMiddleware,
];

export const paramValidation: RequestHandler[] = [
  param("subCategoryId")
    .notEmpty()
    .withMessage("Subcategory ID is required")
    .isMongoId()
    .withMessage("Invalid subcategory id")
    .trim(),
  validatorMiddleware,
];
