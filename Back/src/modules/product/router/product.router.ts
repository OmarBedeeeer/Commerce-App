import { Router } from "express";
import { productController } from "../controller/product.controller";
import { authentecation, authorized } from "../../user/controller/user.auth";
import {
  createProductValidation,
  getSingleProdVali,
  productParamsValidation,
  updateProductValidation,
} from "../../../utils/validation/product.validation";
import { uploadMiddleware } from "../../../middlewares/multer";

const router = Router();

router.get("/", productController.getProducts);
router.get(
  "/selected", //getSingleProdVali,
  productController.getProduct
);

router.post(
  "/:subCategoryId/create-product",
  authentecation,
  authorized("admin"),
  // createProductValidation,
  uploadMiddleware,
  productController.createProduct
);

router.patch(
  "/:subCategoryId/:productId/update-product",
  authentecation,
  authorized("admin"),
  // updateProductValidation,
  productController.updateProduct
);

router.patch(
  "/:subCategoryId/:productId/deactive-product",
  authentecation,
  // productParamsValidation,
  productController.deactiveProduct
);

router.patch(
  "/:subCategoryId/:productId/reactive-product",
  authentecation,
  // productParamsValidation,
  productController.reactiveProduct
);

router.delete(
  "/:subCategoryId/:productId/delete-product",
  authentecation,
  // productParamsValidation,
  productController.deleteProduct
);

export default router;
