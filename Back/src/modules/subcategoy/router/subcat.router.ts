import { Router } from "express";
import { authentecation, authorized } from "../../user/controller/user.auth";
import { subcategoryController } from "../controller/subcat.controller";

const router = Router();

router.get("/subcategories", subcategoryController.subCategories);

router.get(
  "/subcategories/:subcategoryId",
  subcategoryController.getSubCategory
);
router.post(
  "/founder/",
  authentecation,
  authorized("admin"),
  subcategoryController.createSubCategory
);

router.patch(
  "/founder/subcategories/:subcategoryId",
  authentecation,
  authorized("admin"),
  subcategoryController.updateSubCategory
);

router.patch(
  "/founder/subcategories/:subcategoryId/deactive",
  authentecation,
  authorized("admin"),
  subcategoryController.deactiveSubCategory
);

router.delete(
  "/founder/subcategories/:subcategoryId/delete-subcategory",
  authentecation,
  authorized("admin"),
  subcategoryController.deleteSubCategory
);

export default router;
