import Product from "../model/product.model";
import { Request, Response } from "express";
import Cart from "../../cart/cart.model";
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
import Coupon from "../../cart/coupon/coupon.model";
import Order from "../../cart/order/order.model";
import { CLIENT_RENEG_LIMIT } from "tls";

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

      const updateCart: ICart | null = await Cart.findOneAndUpdate(
        {
          user: req.user?.id,
        },
        {
          $addToSet: {
            products: {
              product: productId as unknown as mongoose.Types.ObjectId,
              quantity: quantity || 1,
            },
          },
        },
        { new: true }
      )
        .select("user products total")
        .populate({
          path: "products.product",
          model: "Product",
          select: "name price description",
        });

      updateCart!.total! += findProduct.price * quantity!;
      await updateCart?.save();
      return res.status(200).json({
        message: "Product added to cart successfully",
        updateCart,
      });
    }
  ),

  // deleteProductFromCart: CatchError(
  //   async (req: Request<ParamsIds>, res: Response) => {
  //     const { productId } = req.params;

  //     const findProduct: IProduct | null = await Product.findById(productId);
  //     if (!findProduct) throw new AppError("Can't find Product.", 404);

  //     const updateCart: ICart | null = await Cart.findOne({
  //       user: req.user?.id,
  //     }).populate({
  //       path: "products.product",
  //       model: "Product",
  //       select: "price",
  //     });

  //     if (!updateCart) throw new AppError("Cart not found", 404);

  //     const productEntry = updateCart!.products?.find(
  //       (item) => item.product._id.toString() === productId
  //     );
  //     const product = productEntry!.product as IProduct;
  //     const amountToSubtract = product.price * productEntry!.quantity!;

  //     await Cart.updateOne(
  //       { user: req.user?.id },
  //       { $pull: { products: { product: req.params.productId } } }
  //     );

  //     updateCart.total! -= amountToSubtract;
  //     await updateCart.save();

  //     res.status(200).json({
  //       status: "success",
  //       message: "Product removed from cart successfully.",
  //     });
  //   }
  // ),
  deleteProductFromCart: CatchError(
    async (req: Request<ParamsIds, {}, body>, res: Response) => {
      const { productId } = req.params;

      // Find the cart for the current user
      const cart: ICart | null = await Cart.findOne({ user: req.user?.id })
        .select("user products total")
        .populate({
          path: "products.product",
          model: "Product",
          select: "name price",
        });

      if (!cart) {
        throw new AppError("Cart not found.", 404);
      }

      const productIndex = cart.products?.findIndex(
        (p) => p.product._id.toString() === productId
      );

      if (productIndex === -1) {
        throw new AppError("Product not found in cart.", 404);
      }

      const productInCart = cart.products![productIndex!];

      const priceReduction =
        (productInCart.product as IProduct).price * productInCart.quantity!;

      cart.total = (cart.total ?? 0) - priceReduction;

      cart.products!.splice(productIndex!, 1);

      await cart.save();

      return res.status(200).json({
        message: "Product instance removed from cart successfully",
        cart,
      });
    }
  ),

  confirmOrder: CatchError(
    async (req: Request<userParams, {}, body, Query>, res: Response) => {
      const { coupon, address } = req.body;
      const user: IUser | null = await User.findById({
        _id: req.user?.id,
      });

      if (!user) throw new AppError("User not found", 404);
      const cart: ICart | null = await Cart.findOne({
        user: user._id,
      })
        .select("products total")
        .populate({
          path: "products.product",
          model: "Product",
          select: "name price description",
        });

      if (!cart || cart.products?.length === 0) {
        throw new AppError("Cart is empty", 400);
      }
      let cartTotal = cart.total;

      if (coupon) {
        const couponData = await Coupon.findOne({ coupon, isActive: true });
        if (!couponData || !couponData.isActive) {
          throw new AppError("Invalid or expired coupon", 400);
        }

        if (cartTotal! < couponData.minCartValue!) {
          throw new AppError(
            `Cart total must be at least ${couponData.minCartValue} to apply the coupon`,
            400
          );
        }

        cartTotal = couponData.applyCoupon(cartTotal!);

        couponData.usedCount += 1;
        await couponData.save();
      }

      const order = await Order.create({
        user: user._id,
        products: cart.products,
        total: cartTotal,
        address,
      });

      cart.products = [];
      cart.total = 0;
      await cart.save();

      for (const cartItem of cart.products!) {
        const productId = cartItem.product._id;
        const quantityOrdered: number | undefined = cartItem.quantity;

        const product = await Product.findById(productId);
        if (!product) {
          throw new AppError(`Product not found.`, 404);
        }
        if (product.quantity < quantityOrdered!) {
          throw new AppError(
            `Insufficient stock for product ${product.name}.`,
            400
          );
        }

        product.quantity -= quantityOrdered!;

        await product.save();
      }

      return res.status(200).json({
        message: "Order placed successfully",
        order,
      });
    }
  ),
};
