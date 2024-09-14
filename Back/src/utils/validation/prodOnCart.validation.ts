import { RequestHandler } from "express";

import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";
import Product from "../../modules/product/model/product.model";

export const addProductsOnCartValidation: RequestHandler[] = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .trim()
    .escape(),
  body("quantity")
    .custom(async (value, { req }) => {
      const productId = req.params!.productId;

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      if (value > product.quantity) {
        throw new Error(
          `Requested quantity exceeds available stock. Available: ${product.quantity}`
        );
      }

      return true;
    })
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .trim()
    .escape(),
  validatorMiddleware,
];
export const deleteProductFromCartValidation: RequestHandler[] = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product id")
    .trim()
    .escape(),
  validatorMiddleware,
];

export const confirmCartValidation: RequestHandler[] = [
  body("address")
    .isObject()
    .withMessage("Address must be an object with street, city, state, and zip"),
  body("address.street")
    .notEmpty()
    .withMessage("Street is required")
    .trim()
    .escape(),

  body("address.city")
    .notEmpty()
    .withMessage("City is required")
    .trim()
    .escape(),

  body("address.state")
    .notEmpty()
    .withMessage("State is required")
    .trim()
    .escape(),

  body("address.zip")
    .optional()
    .isPostalCode("any")
    .withMessage("Must be a valid postal code")
    .trim()
    .escape(),

  body("coupon")
    .optional()
    .isString()
    .withMessage("Coupon must be a string")
    .isLength({ min: 3, max: 10 })
    .withMessage("Coupon must be between 3 and 10 characters")
    .trim()
    .escape(),

  validatorMiddleware,
];
