import { RequestHandler } from "express";

import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

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
  body("price")
    .isNumeric()
    .custom((value: number) => {
      if (value < 0) {
        throw new Error("Price should be greater than 0");
      }
      return true;
    })
    .withMessage("Price is required")
    .isFloat()
    .trim()
    .escape(),
  body("quantity")
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
  body("price_offer")
    .optional()
    .isNumeric()
    .custom((value: number, { req }) => {
      if (value < 0 || value > req.body.price) {
        throw new Error("invalid price offer");
      }
      return true;
    })
    .withMessage("Price is required")
    .isFloat()
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
    .custom((value: number) => {
      if (value < 0) {
        throw new Error("Price should be greater than 0");
      }
      return true;
    })
    .withMessage("Price is should be Number")
    .isFloat()
    .trim()
    .escape(),
  body("price_offer")
    .optional()
    .isNumeric()
    .custom((value: number, { req }) => {
      if (value < 0 || value > req.body.price) {
        throw new Error("invalid price offer");
      }
      return true;
    })
    .withMessage("Price is required")
    .isFloat()
    .trim()
    .escape(),
  body("quantity")
    .optional()
    .isNumeric()
    .custom((value: number) => {
      if (value <= 0) {
        throw new Error("Quantity should be greater than or equal to 0");
      }
      return true;
    })
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
  param("subCategoryId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id"),
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
