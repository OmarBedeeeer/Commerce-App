import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../../../utils/category.validation";
import { authentecation, authorized } from "../../user/controller/user.auth";
import { categoryController } from "../controller/category.controller";
import { Router } from "express";
const router = Router();
router.get("/category-list", categoryController.getAll);

router.get("/category-list/:id", categoryController.getCategory);

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
  categoryController.deactiveCategory
);

router.patch(
  "/founder/:categoryId/recover-category",
  authentecation,
  authorized("admin"),
  categoryController.restoreCategory
);

router.delete(
  "/founder/:categoryId/delete-category",
  authentecation,
  authorized("admin"),
  categoryController.deleteCategory
);

export default router;
