"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const user_auth_1 = require("../../user/controller/user.auth");
const product_validation_1 = require("../../../utils/validation/product.validation");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const router = (0, express_1.Router)();
router.get("/", product_controller_1.productController.getProducts);
router.get("/selected", product_controller_1.productController.getProduct);
router.post("/:subCategoryId/create-product", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), (0, multer_1.default)("img"), product_validation_1.createProductValidation, product_controller_1.productController.createProduct);
router.patch("/:subCategoryId/:productId/update-product", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), product_validation_1.updateProductValidation, product_controller_1.productController.updateProduct);
router.patch("/:subCategoryId/:productId/deactive-product", user_auth_1.authentecation, product_validation_1.productParamsValidation, product_controller_1.productController.deactiveProduct);
router.patch("/:subCategoryId/:productId/reactive-product", user_auth_1.authentecation, product_validation_1.productParamsValidation, product_controller_1.productController.reactiveProduct);
router.delete("/:subCategoryId/:productId/delete-product", user_auth_1.authentecation, product_validation_1.productParamsValidation, product_controller_1.productController.deleteProduct);
exports.default = router;
