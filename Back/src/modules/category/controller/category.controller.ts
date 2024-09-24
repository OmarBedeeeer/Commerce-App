import Category from "../model/category.model";
import { NextFunction, Request, Response } from "express";
import { AppError, CatchError } from "../../../utils/errorhandler";
import { body, ParamsIds } from "../../../interfaces/Queryinterfaces";
import {
  ICategory,
  IProduct,
  ISubCategory,
} from "../../../interfaces/dbinterfaces";
import { ApiFeatures } from "../../../utils/api.features";
import Subcategory from "../../subcategoy/model/subcat.model";
import Product from "../../product/model/product.model";
import Image from "../../img/model/img.model";
import cloudinary from "../../../middlewares/cloudinary";

export const categoryController = {
  getAll: CatchError(async (req: Request, res: Response) => {
    const apiProductFeatures = new ApiFeatures(
      Category.find({ deleted: false }).populate("image"),
      req.query
    );
    apiProductFeatures.filter().sort().paginate();

    const categories: ICategory[] = await apiProductFeatures.query;

    if (!categories) throw new AppError("Categories not found", 404);
    res.send(categories);
  }),

  getCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { categoryId } = req.params;

      const category: ICategory | null = await Category.findOne({
        _id: categoryId,
        deleted: false,
      });

      if (!category) throw new AppError("Category not found", 404);
      res.status(200).json(category);
    }
  ),

  createCategory: CatchError(
    async (req: Request<{}, {}, body>, res: Response) => {
      const { name, description, image } = req.body;

      if (!req.user) throw new AppError("Unauthorized", 401);

      let uploadResult;
      if (req.file?.path) {
        try {
          uploadResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: req.file.filename,
          });
        } catch (error) {
          throw new AppError("Cloudinary upload failed", 500);
        }
      } else {
        throw new AppError("No file uploaded", 400);
      }

      const img = await Image.create({
        name: req.file?.originalname,
        path: uploadResult?.secure_url || "",
      });

      const newCategory: ICategory | null = await Category.create({
        name,
        description,
        image: img,
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

      const category: ICategory | null = await Category.findByIdAndUpdate(
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

  deactiveCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { categoryId } = req.params;

      const findCategory: ICategory | null = await Category.findOneAndUpdate(
        {
          _id: categoryId,
          deleted: false,
        },
        {
          deleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
        }
      );

      if (!findCategory) throw new AppError("Category Not found", 404);

      const deletedSubCategories: ISubCategory[] | null =
        await Subcategory.find({
          category: findCategory._id,
          deleted: false,
        });

      await Promise.all(
        deletedSubCategories.map(async (prod) => {
          prod.deleted = true;
          prod.deletedAt = new Date();
          await prod.save();
        })
      );

      const subCategoryIds = deletedSubCategories.map((sub) => sub._id);

      await Product.updateMany(
        {
          Subcategory: { $in: subCategoryIds },
          deleted: false,
        },
        { deleted: true, deletedAt: new Date() }
      );

      res.status(200).json({
        message:
          "Category and all related subcategories and products deleted successfully",
      });
    }
  ),

  getAllCategories: CatchError(async (req: Request, res: Response) => {
    const apiProductFeatures = new ApiFeatures(
      Category.find({ deleted: false }),
      req.query
    );
    apiProductFeatures.filter().sort().paginate();

    const categories: ICategory[] = await apiProductFeatures.query;
    if (!categories) throw new AppError("Categories not found", 404);
    res.status(200).send(categories);
  }),

  restoreCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { categoryId } = req.params;

      const findCategory: ICategory | null = await Category.findOneAndUpdate(
        {
          _id: categoryId,
          deleted: true,
        },
        {
          deleted: false,
          deletedAt: null,
        },
        {
          new: true,
        }
      );
      if (!findCategory) throw new AppError("Category Not found", 404);

      const deletedSubCategories: ISubCategory[] | null =
        await Subcategory.find({
          category: findCategory._id,
          deleted: true,
        });

      await Promise.all(
        deletedSubCategories.map(async (prod) => {
          prod.deleted = false;
          prod.deletedAt = null;
          await prod.save();
        })
      );

      const subCategoryIds = deletedSubCategories.map((sub) => sub._id);

      await Product.updateMany(
        { Subcategory: { $in: subCategoryIds }, deleted: true },
        { deleted: false, deletedAt: null }
      );

      res.status(200).json({
        message:
          "Category and all related subcategories and products restored successfully",
      });
    }
  ),
  deleteCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { categoryId } = req.params;

      const findCategory: ICategory | null = await Category.findOneAndDelete({
        _id: categoryId,
        deleted: false,
      });
      if (!findCategory) throw new AppError("Category Not found", 404);

      const deletedSubCategories: ISubCategory[] | null =
        await Subcategory.find({
          category: categoryId,
          deleted: false,
        });

      if (deletedSubCategories.length > 0) {
        const subCategoryIds = deletedSubCategories.map((sub) => sub._id);
        await Subcategory.deleteMany({ _id: { $in: subCategoryIds } });

        await Product.deleteMany({ Subcategory: { $in: subCategoryIds } });
      }

      res.status(200).json({
        message:
          "Category and all related subcategories and products deleted successfully",
      });
    }
  ),
};
