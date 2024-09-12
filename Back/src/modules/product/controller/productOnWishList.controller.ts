import User from "../../user/model/user.model";
import { Request, Response } from "express";
import { CatchError, AppError } from "../../../utils/errorhandler";
import Product from "../model/product.model";
import { IUser } from "../../../interfaces/dbinterfaces";

export const productOnWishList = {
  addProdToWishList: CatchError(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { productId } = req.body;

    const user: IUser | null = await User.findByIdAndUpdate(
      req.user!.id,
      {
        $addToSet: { wishList: productId },
      },
      {
        new: true,
      }
    );

    if (!user) throw new AppError("Please Login first", 404);

    res.status(200).json({
      message: "Product added to wishlist",
      success: true,
      user,
    });
  }),

  getWishList: CatchError(async (req: Request, res: Response) => {
    const user: IUser | null = await User.findById({ _id: req.user?.id });
    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({
      message: "WishList loaded",
      success: true,
      user,
    });
  }),
  removeFromWishList: CatchError(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { productId } = req.body;

    const user: IUser | null = await User.findByIdAndUpdate(
      req.user?.id,
      {
        $pull: { wishList: productId },
      },
      {
        new: true,
      }
    );

    if (!user) throw new AppError("Please Login first", 404);

    res.status(200).json({
      message: "Product removed from wishlist",
      success: true,
      user,
    });
  }),
};
