import { categoryController } from "../controller/category.controller";
import { Router } from "express";
const router = Router();
router.get("/category-list", categoryController.getAll);
router.get("/category-list/:id", categoryController.getCategory);
router.post("/create-category", categoryController.createCategory);

router.patch("/:categoryId/update-category", categoryController.updateCategory);

router.delete(
  "/:categoryId/delete-category",
  categoryController.deleteCategory
);

export default router;
