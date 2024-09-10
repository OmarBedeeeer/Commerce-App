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
      }).populate("products.product");
      //TODO: Complete the logic for get all products in cart
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
      });

      if (!updateCart) throw new AppError("Cart not found", 404);

      updateCart.products?.push({
        product: findProduct._id as mongoose.Types.ObjectId,
        quantity: quantity,
      });

      await updateCart.save();
      return res.status(200).json({
        message: "Product added to cart successfully",
        updateCart,
      });
    }
  ),

  deleteProductFromCart: CatchError(
    async (req: Request<ParamsIds>, res: Response) => {
      const updateCart: ICart | null = await Cart.findOne({
        user: req.user?.id,
      });
      if (!updateCart) throw new AppError("Cart not found", 404);

      await Cart.updateOne(
        { user: req.user?.id },
        { $pull: { products: { product: req.params.productId } } }
      );

      const updatedCart = await Cart.findOne({ user: req.user?.id });

      res.status(200).json({
        status: "success",
        message: "Product removed from cart successfully.",
        data: updatedCart,
      });
    }
  ),
};
