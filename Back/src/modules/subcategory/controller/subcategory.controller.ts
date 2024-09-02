import subCategorySchema from "../model/subcategory.model";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ISubCategory } from "../../../interfaces/interfaces";
export const subcategoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const subCategory: ISubCategory[] = await subCategorySchema.find({});
    res.status(200).send({ Data: subCategory });
  }),

  getCategory: asyncHandler(async (req: Request, res: Response) => {
    const category: ISubCategory | null = await subCategorySchema.findById(
      req.params.subcategoryId
    );
    if (!category) {
      res.status(404).send({ message: "Category not found" });
    }
    res.status(200).send({ Data: category });
  }),

  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const { name, description, image } = req.body;
    const subCategory: ISubCategory = await subCategorySchema.create({
      name,
      description,
      image,
    });
    res.status(200).send({ Data: subCategory });
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const { subcategoryId } = req.params;
    const { name, description, image } = req.body;
    const subCategory: ISubCategory | null =
      await subCategorySchema.findByIdAndUpdate(
        subcategoryId,
        { name, description, image },
        { new: true }
      );
    res.status(200).send({ Data: subCategory });
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const { subcategoryId } = req.params;
    const subCategory: ISubCategory | null =
      await subCategorySchema.findByIdAndDelete(subcategoryId);
    res.status(200).send({ message: "Category deleted" });
  }),
};
