import Product from "../model/product.model";
import { Request, Response } from "express";
import Cart from "../../cart/cat.model";
import { CatchError, AppError } from "../../../utils/errorhandler";
import { IUser, ICart, IProduct } from "../../../interfaces/dbinterfaces";
import User from "../../user/model/user.model";
import {
  ParamsIds,
  Query,
  body,
  userParams,
} from "../../../interfaces/Queryinterfaces";
import mongoose from "mongoose";

export const prodOnCart = {
  getProductsOnCart: CatchError(
    async (req: Request<userParams>, res: Response) => {
      const { userId } = req.params;
      const user: IUser | null = await User.findById({
        _id: req.user?.id,
      });
      if (!user) throw new AppError("User not found", 404);

      const cart: ICart | null = await Cart.findOne({
        user: user._id,
      })
        .select("total user products")
        .populate({
          path: "products.product",
          model: "Product",
          select: "name price description",
        });

      const total = cart!.products!.reduce((accumulator, item) => {
        const product = item.product as IProduct;
        const quantity = item.quantity || 0;
        const price = product.price || 0;

        return accumulator + price * quantity;
      }, 0);

      cart!.total = total;

      cart?.save();

      res.status(200).json({ message: "Cart loaded", cart });
    }
  ),

  addProductToCart: CatchError(
    async (req: Request<ParamsIds, {}, body>, res: Response) => {
      const { productId } = req.params;
      const { quantity } = req.body;

      const findProduct: IProduct | null = await Product.findById(productId);
      if (!findProduct) throw new AppError("Can't find Product.", 404);

      if (findProduct.quantity < quantity!) {
        throw new AppError("Not enough quantity", 400);
      }
      const updateCart: ICart | null = await Cart.findOne({
        user: req.user?.id,
      })
        .select("user products total")
        .populate({
          path: "products.product",
          model: "Product",
          select: "name price description",
        });

      const productEntry = updateCart!.products!.find((entry) => {
        return (entry.product as IProduct)._id.toString() === productId;
      });

      if (!productEntry) {
        updateCart?.products?.push({
          product: productId as unknown as mongoose.Types.ObjectId,
          quantity: quantity || 1,
        });
      } else {
        productEntry.quantity! += quantity!;
      }

      if (!productEntry) updateCart?.products?.push();

      updateCart!.total! += findProduct.price * quantity!;
      await updateCart?.save();
      return res.status(200).json({
        message: "Product added to cart successfully",
        updateCart,
      });
    }
  ),

  deleteProductFromCart: CatchError(
    async (req: Request<ParamsIds>, res: Response) => {
      const { productId } = req.params;

      const findProduct: IProduct | null = await Product.findById(productId);
      if (!findProduct) throw new AppError("Can't find Product.", 404);

      const updateCart: ICart | null = await Cart.findOne({
        user: req.user?.id,
      }).populate({
        path: "products.product",
        model: "Product",
        select: "price",
      });

      if (!updateCart) throw new AppError("Cart not found", 404);

      const productEntry = updateCart!.products?.find(
        (item) => item.product._id.toString() === productId
      );
      const product = productEntry!.product as IProduct;
      const amountToSubtract = product.price * productEntry!.quantity!;

      await Cart.updateOne(
        { user: req.user?.id },
        { $pull: { products: { product: req.params.productId } } }
      );

      updateCart.total! -= amountToSubtract;
      await updateCart.save();

      res.status(200).json({
        status: "success",
        message: "Product removed from cart successfully.",
      });
    }
  ),
};
