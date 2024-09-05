import Subcategory from "../model/subcat.model";
import { Request, Response } from "express";
import { AppError, CatchError } from "../../../utils/errorhandler";
import {
  body,
  subCategoriesId,
  subCatQuery,
} from "../../../interfaces/Queryinterfaces";
import Category from "../../category/model/category.model";
import { ISubCategory } from "../../../interfaces/dbinterfaces";

export const subcategoryController = {
  subCategories: CatchError(async (req: Request, res: Response) => {
    const subCategories: ISubCategory[] = await Subcategory.find({
      deleted: false,
    });
    if (!subCategories) throw new AppError("Subcategories not found", 404);
    res.status(200).json(subCategories);
  }),

  getSubCategory: CatchError(
    async (req: Request<subCategoriesId, {}, {}>, res: Response) => {
      const { subcategoryId } = req.params;

      const subCategory: ISubCategory | null = await Subcategory.findOne({
        _id: subcategoryId,
        deleted: false,
      });

      if (!subCategory) throw new AppError("Subcategory not found", 404);

      res.status(200).json(subCategory);
    }
  ),

  createSubCategory: CatchError(
    async (req: Request<{}, {}, body, subCatQuery>, res: Response) => {
      const { name, description, image } = req.body;
      const { category_name } = req.query;

      if (!category_name) throw new AppError("Category not found", 404);

      const findSub: ISubCategory | null = await Subcategory.findOne({ name });
      if (findSub) throw new AppError("Subcategory already exists", 400);

      const findCategory = await Category.findOne({ name: category_name });

      if (!findCategory) throw new AppError("Category not found", 404);

      const newSubCategory: ISubCategory | null = await Subcategory.create({
        name,
        description,
        image,
        category: findCategory._id,
        created_by: findCategory.createdBy,
      });

      if (!newSubCategory) throw new AppError("Something went wrong", 400);

      res.status(201).json({
        message: "Subcategory created successfully",
        subcategory: newSubCategory,
      });
    }
  ),

  updateSubCategory: CatchError(
    async (req: Request<subCategoriesId, {}, body>, res: Response) => {
      const { subcategoryId } = req.params;
      const { name, description, image } = req.body;

      const findSub: ISubCategory | null = await Subcategory.findOne({ name });
      if (findSub)
        throw new AppError("select different name, already exists", 404);

      if (!req.user) throw new AppError("Unauthorized", 401);

      const subcategory: ISubCategory | null =
        await Subcategory.findByIdAndUpdate(
          subcategoryId,
          { name, description, image, modifed_by: req.user.id },
          {
            new: true,
          }
        );

      if (!subcategory) throw new AppError("Can't update Subcategory", 400);

      res.status(200).json({
        message: "Subcategory updated successfully",
        subcategory,
      });
    }
  ),

  deactiveSubCategory: CatchError(async (req: Request, res: Response) => {
    const { subcategoryId } = req.params;

    if (!req.user) throw new AppError("Unauthorized", 401);

    const subcategory: ISubCategory | null =
      await Subcategory.findByIdAndUpdate(
        { _id: subcategoryId },
        { modifed_by: req.user.id, deleted: true, deletedAt: new Date() },
        { new: true }
      );

    if (!subcategory) throw new AppError("Can't delete Subcategory", 400);

    res.status(200).json({
      message: "Subcategory deleted successfully",
      subcategory,
    });
  }),
  deleteSubCategory: CatchError(async (req: Request, res: Response) => {
    const { subcategoryId } = req.params;

    if (!req.user) throw new AppError("Unauthorized", 401);

    const findSubCate: ISubCategory | null = await Subcategory.findOne({
      _id: subcategoryId,
      deleted: false,
    });

    if (!findSubCate) throw new AppError("Sub-Category Not found", 404);
    const subcategory: ISubCategory | null =
      await Subcategory.findByIdAndDelete({
        _id: subcategoryId,
      });

    if (!subcategory) throw new AppError("Can't delete Subcategory", 400);

    res.status(200).json({
      message: "Subcategory deleted successfully",
      subcategory,
    });
  }),
};
