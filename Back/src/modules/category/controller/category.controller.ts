import Category from "../model/category.model";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ICategory } from "../../../interfaces/interfaces";
export const categoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const categories: ICategory[] = await Category.find({});
    res.status(200).send({ Data: categories });
  }),

  getCategory: asyncHandler(async (req: Request, res: Response) => {
    const category: ICategory | null = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).send({ message: "Category not found" });
    }
    res.status(200).send({ Data: category });
  }),

  createCategory: asyncHandler(async (req: Request, res: Response) => {
    const { name, description, image } = req.body;
    const category: ICategory = await Category.create({
      name,
      description,
      image,
    });
    res.status(200).send({ Data: category });
  }),

  updateCategory: asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { name, description, image } = req.body;
    const category: ICategory | null = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, image },
      { new: true }
    );
    res.status(200).send({ Data: category });
  }),

  deleteCategory: asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category: ICategory | null = await Category.findByIdAndDelete(
      categoryId
    );
    res.status(200).send({ message: "Category deleted" });
  }),
};
