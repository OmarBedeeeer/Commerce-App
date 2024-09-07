import {
  createCategoryValidation,
  paramValidation,
  updateCategoryValidation,
} from "../../../utils/validation/category.validation";
import { authentecation, authorized } from "../../user/controller/user.auth";
import { categoryController } from "../controller/category.controller";
import { Router } from "express";
const router = Router();
router.get("/category-list", categoryController.getAll);

router.get(
  "/category-list/:categoryId",
  paramValidation,
  categoryController.getCategory
);

router.get(
  "/founder/get-all-categories",
  authentecation,
  authorized("admin"),
  categoryController.getAllCategories
);

router.post(
  "/founder/create-category",
  authentecation,
  authorized("admin"),
  createCategoryValidation,
  categoryController.createCategory
);

router.patch(
  "/founder/:categoryId/update-category",
  authentecation,
  authorized("admin"),
  updateCategoryValidation,
  categoryController.updateCategory
);

router.patch(
  "/founder/:categoryId/deactive-category",
  authentecation,
  authorized("admin"),
  paramValidation,
  categoryController.deactiveCategory
);

router.patch(
  "/founder/:categoryId/recover-category",
  authentecation,
  authorized("admin"),
  paramValidation,
  categoryController.restoreCategory
);

router.delete(
  "/founder/:categoryId/delete-category",
  authentecation,
  authorized("admin"),
  paramValidation,
  categoryController.deleteCategory
);

export default router;
