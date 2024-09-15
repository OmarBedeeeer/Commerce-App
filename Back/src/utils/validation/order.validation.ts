import { RequestHandler } from "express";
import { body, param, query } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware";

export const getOrderValidation: RequestHandler[] = [
  param("orderId")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id")
    .trim()
    .escape(),

  validatorMiddleware,
];

export const updateOrderValidation: RequestHandler[] = [
  param("orderId")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id")
    .trim()
    .escape(),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid status")
    .trim()
    .escape(),
  validatorMiddleware,
];

export const deleteOrderValidation: RequestHandler[] = [
  param("orderId")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id")
    .trim()
    .escape(),
  validatorMiddleware,
];
