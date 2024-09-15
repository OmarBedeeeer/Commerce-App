import { RequestHandler } from "express";

import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

export const createReviewValidation: RequestHandler[] = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .trim()
    .escape(),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5")
    .escape(),
  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ min: 10 })
    .withMessage("Comment must be at least 10 characters long")
    .trim()
    .escape(),
  validatorMiddleware,
];

export const reviewsParamValidation: RequestHandler[] = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .trim()
    .escape(),
  validatorMiddleware,
];
