import { Router } from "express";
import { productController } from "../controller/product.controller";
import { authentecation, authorized } from "../../user/controller/user.auth";

const router = Router();

router.get("/", productController.getProducts);
router.get("/selected", productController.getProduct);

router.post(
  "/:subCategoryId/create-product",
  authentecation,
  authorized("admin"),
  productController.createProduct
);

router.patch(
  "/:subCategoryId/:productId/update-product",
  authentecation,
  authorized("admin"),
  productController.updateProduct
);

router.patch(
  "/:subCategoryId/:productId/deactive-product",
  authentecation,
  productController.deactiveProduct
);

router.patch(
  "/:subCategoryId/:productId/reactive-product",
  authentecation,
  productController.reactiveProduct
);

router.delete(
  "/:subCategoryId/:productId/delete-product",
  authentecation,
  productController.deleteProduct
);

export default router;
