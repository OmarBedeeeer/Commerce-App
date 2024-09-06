import { Router } from "express";
import { authentecation, authorized } from "../../user/controller/user.auth";
import { subcategoryController } from "../controller/subcat.controller";
import {
  createSubCategoryValidation,
  updateSubCategoryValidation,
} from "../../../utils/subcategory.validation";
import { paramValidation } from "../../../utils/category.validation";

const router = Router();

router.get("/subcategories", subcategoryController.subCategories);

router.get(
  "/subcategories/:subcategoryId",
  paramValidation,
  subcategoryController.getSubCategory
);
router.post(
  "/founder/",
  authentecation,
  authorized("admin"),
  createSubCategoryValidation,
  subcategoryController.createSubCategory
);

router.patch(
  "/founder/subcategories/:subcategoryId",
  authentecation,
  authorized("admin"),
  updateSubCategoryValidation,
  subcategoryController.updateSubCategory
);

router.patch(
  "/founder/subcategories/:subcategoryId/deactive",
  authentecation,
  authorized("admin"),
  paramValidation,
  subcategoryController.deactiveSubCategory
);

router.delete(
  "/founder/subcategories/:subcategoryId/delete-subcategory",
  authentecation,
  authorized("admin"),
  paramValidation,
  subcategoryController.deleteSubCategory
);

export default router;
