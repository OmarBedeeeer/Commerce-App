import { RequestHandler } from "express";

import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

export const ProductIdToWishListValidation: RequestHandler[] = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .trim()
    .escape(),
  validatorMiddleware,
];
