import Subcategory from "../model/subcat.model";
import { Request, Response } from "express";
import { AppError, CatchError } from "../../../utils/errorhandler";
import { body, ParamsIds, Query } from "../../../interfaces/Queryinterfaces";
import Category from "../../category/model/category.model";
import { IProduct, ISubCategory } from "../../../interfaces/dbinterfaces";
import { ApiFeatures } from "../../../utils/api.features";
import Product from "../../product/model/product.model";

export const subcategoryController = {
  subCategories: CatchError(async (req: Request, res: Response) => {
    const apiProductFeatures = new ApiFeatures(
      Subcategory.find({ deleted: false }),
      req.query
    );
    apiProductFeatures.filter().sort().paginate();

    const subCategories: ISubCategory[] = await apiProductFeatures.query;

    if (!subCategories) throw new AppError("Subcategories not found", 404);
    res.status(200).json(subCategories);
  }),

  getSubCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { subCategoryId } = req.params;

      const subCategory: ISubCategory | null = await Subcategory.findOne({
        _id: subCategoryId,
        deleted: false,
      });

      if (!subCategory) throw new AppError("Subcategory not found", 404);

      res.status(200).json(subCategory);
    }
  ),

  createSubCategory: CatchError(
    async (req: Request<{}, {}, body, Query>, res: Response) => {
      const { name, description, image } = req.body;
      const { category_name } = req.query;

      if (!category_name) throw new AppError("Category not found", 404);

      const findSub: ISubCategory | null = await Subcategory.findOne({ name });
      if (findSub) throw new AppError("Subcategory already exists", 400);

      const findCategory = await Category.findOne({ slug: category_name });

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
    async (req: Request<ParamsIds, {}, body>, res: Response) => {
      const { subCategoryId } = req.params;
      const { name, description, image } = req.body;

      const findSub: ISubCategory | null = await Subcategory.findOne({ name });
      if (findSub)
        throw new AppError("select different name, already exists", 404);

      if (!req.user) throw new AppError("Unauthorized", 401);

      const subcategory: ISubCategory | null =
        await Subcategory.findByIdAndUpdate(
          subCategoryId,
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

  deactiveSubCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { subCategoryId } = req.params;

      if (!req.user) throw new AppError("Unauthorized", 401);

      const findSubCate: ISubCategory | null = await Subcategory.findOne({
        _id: subCategoryId,
        deleted: false,
      });

      const allSubCateProducts: IProduct[] | null = await Product.find({
        Subcategory: subCategoryId,
        deleted: false,
      });

      if (!findSubCate) throw new AppError("Sub-Category Not found", 404);
      if (!allSubCateProducts) throw new AppError("Product Not found", 404);

      await Promise.all(
        allSubCateProducts.map(async (prod) => {
          prod.deleted = true;
          prod.deletedAt = new Date();
          await prod.save();
        })
      );

      const deleteSubCate = await Subcategory.updateOne(
        {
          _id: findSubCate?.id,
        },
        {
          deleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
        }
      );

      // const subcategory: ISubCategory | null =
      await Subcategory.findByIdAndUpdate(
        { _id: subCategoryId },
        { modifed_by: req.user.id, deleted: true, deletedAt: new Date() },
        { new: true }
      );

      //TODO: deactive all product belong to this subcategory

      if (!deleteSubCate) throw new AppError("Can't delete Subcategory", 400);

      res.status(200).json({
        message: "Subcategory deleted successfully",
        deleteSubCate,
      });
    }
  ),

  reactiveSubCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { subCategoryId } = req.params;

      if (!req.user) throw new AppError("Unauthorized", 401);

      const subcategory: ISubCategory | null =
        await Subcategory.findByIdAndUpdate(
          { _id: subCategoryId },
          { modifed_by: req.user.id, deleted: false, deletedAt: null },
          { new: true }
        );

      //TODO: reactive all product belong to this subcategory

      if (!subcategory) throw new AppError("Can't delete Subcategory", 400);

      res.status(200).json({
        message: "Subcategory deleted successfully",
        subcategory,
      });
    }
  ),

  deleteSubCategory: CatchError(
    async (req: Request<ParamsIds, {}, {}>, res: Response) => {
      const { subCategoryId } = req.params;

      if (!req.user) throw new AppError("Unauthorized", 401);

      const findSubCate: ISubCategory | null = await Subcategory.findOne({
        _id: subCategoryId,
        deleted: false,
      });

      if (!findSubCate) throw new AppError("Sub-Category Not found", 404);
      const subcategory: ISubCategory | null =
        await Subcategory.findByIdAndDelete({
          _id: subCategoryId,
        });

      //TODO: Delete all product belong to this subcategory

      if (!subcategory) throw new AppError("Can't delete Subcategory", 400);

      res.status(200).json({
        message: "Subcategory deleted successfully",
        subcategory,
      });
    }
  ),
};
