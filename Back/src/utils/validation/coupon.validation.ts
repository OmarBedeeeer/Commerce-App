import { RequestHandler } from "express";
import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

export const createCouponValidation: RequestHandler[] = [
  body("coupon")
    .notEmpty()
    .withMessage("Coupon is required")
    .isLength({ min: 3, max: 10 })
    .withMessage("Coupon must be at least 3 characters long and less than 50")
    .trim()
    .escape(),
  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required")
    .isIn(["percentage", "fixed"])
    .withMessage("Invalid discount type")
    .trim()
    .escape(),
  body("discountValue")
    .notEmpty()
    .withMessage("Discount value is required")
    .isNumeric()
    .withMessage("Discount value must be a number")
    .trim()
    .escape(),
  body("minCartValue")
    .isNumeric()
    .withMessage("Minimum cart value must be a number")
    .trim()
    .escape(),
  body("maxDiscountValue")
    .optional()
    .isNumeric()
    .withMessage("Maximum discount value must be a number")
    .trim()
    .escape(),
  body("expiryDate")
    .notEmpty()
    .withMessage("Expiry date is required")
    .isISO8601()
    .withMessage("Invalid expiry date")
    .trim()
    .escape(),

  body("usageLimit")
    .optional()
    .isNumeric()
    .withMessage("Invalid usage limit")
    .trim()
    .escape(),

  validatorMiddleware,
];

export const getCouponValidation: RequestHandler[] = [
  param("coupon")
    .notEmpty()
    .withMessage("Coupon is required")
    .isMongoId()
    .withMessage("Invalid coupon id"),
  validatorMiddleware,
];

export const deleteCouponValidation: RequestHandler[] = [
  param("coupon")
    .notEmpty()
    .withMessage("Coupon is required")
    .isMongoId()
    .withMessage("Invalid coupon id"),
  validatorMiddleware,
];
