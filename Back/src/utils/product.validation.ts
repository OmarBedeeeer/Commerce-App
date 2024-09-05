import { RequestHandler } from "express";

import { body, param, query } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";

export const createProductValidation: RequestHandler[] = [
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
  body("price").isNumeric().withMessage("Price is required").trim().escape(),
  body("quantity")
    .isNumeric()
    .withMessage("Quantity is required")
    .trim()
    .escape(),
  param("subCategoryId")
    .notEmpty()
    .withMessage("Name is required")
    .isMongoId()
    .withMessage("Invalid subcategory id"),
  validatorMiddleware,
];

export const updateProductValidation: RequestHandler[] = [
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
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price is should be Number")
    .trim()
    .escape(),
  body("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity should be greater than or equal to 0")
    .trim()
    .escape(),
  param("subCategoryId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid subcategory id"),
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id"),
  validatorMiddleware,
];

export const productParamsValidation: RequestHandler[] = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id"),
  validatorMiddleware,
];

export const getSingleProdVali = [
  query("product")
    .notEmpty()
    .withMessage("Product name is required")
    .trim()
    .escape(),
  validatorMiddleware,
];
