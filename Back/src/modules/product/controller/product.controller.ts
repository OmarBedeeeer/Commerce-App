import Product from "../model/product.model";
import { Request, Response } from "express";
import { AppError, CatchError } from "../../../utils/errorhandler";
import Subcategory from "../../subcategoy/model/subcat.model";
import { body, ParamsIds } from "../../../interfaces/Queryinterfaces";

export const productController = {
  getProducts: CatchError(async (req: Request, res: Response) => {
    const products = await Product.find({ deleted: false }).populate({
      path: "Subcategory",
      select: "name image user category",
    });
    if (!products) throw new AppError("Products not found", 404);
    res.status(200).json({
      products,
    });
  }),

  getProduct: CatchError(async (req: Request, res: Response) => {
    const { product } = req.query;

    const products = await Product.find({
      name: product,
      deleted: false,
    }).populate({
      path: "Subcategory",
      select: "name image user category",
    });

    if (!products) throw new AppError("Products not found", 404);

    res.status(200).json({
      products,
    });
  }),

  createProduct: CatchError(
    async (req: Request<ParamsIds, {}, body>, res: Response) => {
      const { name, description, image, price, quantity } = req.body;
      const { subCategoryId } = req.params;

      const subCategory = await Subcategory.findOne({
        _id: subCategoryId,
        deleted: false,
      });

      if (!subCategory) throw new AppError("Subcategory not found", 404);

      if (!req.user) throw new AppError("Unauthorized", 401);

      if (!quantity || quantity <= 0)
        throw new AppError("Invalid quantity", 400);

      const existingProduct = await Product.findOne({
        name,
        deleted: false,
      });

      if (existingProduct) {
        const updatedProduct = await Product.findOneAndUpdate(
          { name },
          {
            $inc: { quantity: quantity },
          },
          { new: true }
        );

        return res.status(200).json({
          message: "Product updated successfully",
          product: updatedProduct,
        });
      }
      const newProduct = await Product.create({
        name,
        description,
        image,
        price,
        quantity,
        created_by: req.user.id,
        subcategory: subCategoryId,
      });

      return res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    }
  ),

  updateProduct: CatchError(
    async (req: Request<ParamsIds, {}, body>, res: Response) => {
      const { productId, subCategoryId } = req.params;
      const { name, description, image, price, quantity } = req.body;

      const subCategory = await Subcategory.findById(subCategoryId, {
        deleted: false,
      });

      if (!subCategory) throw new AppError("Product not found", 404);

      if (!req.user) throw new AppError("Unauthorized", 401);
      const product = await Product.findById(productId, {
        deleted: false,
      });

      if (!product) throw new AppError("Product not found", 404);

      if ((product.created_by?.toString() as string) !== req.user.id)
        throw new AppError("Unauthorized", 401);

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, image, price, quantity, modifed_by: req.user.id },
        {
          new: true,
        }
      );

      if (!updatedProduct) throw new AppError("Something went wrong", 400);

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    }
  ),

  deactiveProduct: CatchError(async (req: Request, res: Response) => {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      deleted: false,
    });

    if (!product) throw new AppError("Product not found", 404);

    if (!req.user) throw new AppError("Unauthorized", 401);
    if (
      (product.created_by?.toString() as string) !== req.user.id &&
      req.user.role !== "admin"
    ) {
      throw new AppError("Unauthorized", 401);
    }
    const deletedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        deleted: true,
        deletedAt: new Date(),
        modifed_by: req.user.id,
      },
      {
        new: true,
      }
    );

    if (!deletedProduct) throw new AppError("Something went wrong", 400);

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  }),

  reactiveProduct: CatchError(async (req: Request, res: Response) => {
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      deleted: true,
    });

    if (!product) throw new AppError("Product not found", 404);

    if (!req.user) throw new AppError("Unauthorized", 401);
    if (
      (product.created_by?.toString() as string) !== req.user.id &&
      req.user.role !== "admin"
    ) {
      throw new AppError("Unauthorized", 401);
    }
    const reactiveProduct = await Product.findByIdAndUpdate(
      productId,
      {
        deleted: false,
        deletedAt: null,
        modifed_by: req.user.id,
      },
      {
        new: true,
      }
    );

    if (!reactiveProduct) throw new AppError("Something went wrong", 400);

    res.status(200).json({
      message: "Product deleted successfully",
      product: reactiveProduct,
    });
  }),

  deleteProduct: CatchError(async (req: Request, res: Response) => {
    const { productId } = req.params;

    if (!req.user) throw new AppError("Unauthorized", 401);

    const findProduct = await Product.findOne({
      _id: productId,
      deleted: false,
    });

    if (!findProduct) throw new AppError("Product Not found", 404);
    const product = await Product.findByIdAndDelete({
      _id: productId,
    });

    if (!product) throw new AppError("Can't delete Product", 400);

    res.status(200).json({
      message: "Subcategory deleted successfully",
      product,
    });
  }),
};