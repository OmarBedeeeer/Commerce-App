import Category from "../model/category.model";
import { NextFunction, Request, Response } from "express";
import { AppError, CatchError } from "../../../utils/errorhandler";
import { body, ParamsIds } from "../../../interfaces/Queryinterfaces";
export const categoryController = {
  getAll: CatchError(async (req: Request, res: Response) => {
    const categories = await Category.find({ deleted: false });
    if (!categories) throw new AppError("Categories not found", 404);
    res.send(categories);
  }),

  getCategory: CatchError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id, deleted: false });

    if (!category) throw new AppError("Category not found", 404);
    res.status(200).json(category);
  }),

  createCategory: CatchError(
    async (req: Request<{}, {}, body>, res: Response) => {
      const { name, description, image } = req.body;

      if (!req.user) throw new AppError("Unauthorized", 401);

      const newCategory = await Category.create({
        name,
        description,
        image,
        createdBy: req.user.id,
      });

      if (!newCategory) throw new AppError("Something went wrong", 400);
      res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
      });
    }
  ),

  updateCategory: CatchError(
    async (req: Request<ParamsIds, {}, body>, res: Response) => {
      const { categoryId } = req.params;
      const { name, description, image } = req.body;

      const category = await Category.findByIdAndUpdate(
        categoryId,
        { name, description, image },
        {
          new: true,
        }
      ).populate("createdBy");

      if (!category) throw new AppError("Can't update Category", 400);

      res.status(200).json({
        message: "Category updated successfully",
        category,
      });
    }
  ),

  deactiveCategory: CatchError(async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!category) throw new AppError("Can't delete Category", 400);

    res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  }),

  getAllCategories: CatchError(async (req: Request, res: Response) => {
    const categories = await Category.find();
    if (!categories) throw new AppError("Categories not found", 404);
    res.status(200).send(categories);
  }),

  restoreCategory: CatchError(async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { deleted: false, deletedAt: null },
      { new: true }
    );
    if (!category) throw new AppError("Can't restore Category", 400);

    res.status(200).json({
      message: "Category restored successfully",
      category,
    });
  }),
  deleteCategory: CatchError(async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete({ _id: categoryId });
    if (!category) throw new AppError("Can't delete Category", 400);

    res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  }),
};
