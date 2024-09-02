import { subcategoryController } from "../controller/subcategory.controller";
import { Router } from "express";
const router = Router();
router.get("/subcategories", subcategoryController.getAll);
router.get("/subcategories/:subcategoryId", subcategoryController.getCategory);
router.post("/create-subcategory", subcategoryController.createCategory);

router.patch(
  "/subcategories/:subcategoryId",
  subcategoryController.updateCategory
);

router.delete(
  "/:subcategoryId/delete-subcategory",
  subcategoryController.deleteCategory
);

export default router;
