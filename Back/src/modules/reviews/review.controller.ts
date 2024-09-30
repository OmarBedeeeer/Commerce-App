import Review from "./review.model";
import { CatchError, AppError } from "../../utils/errorhandler";
import { Request, Response } from "express";
import Product from "../product/model/product.model";
import { ParamsIds } from "../../interfaces/Queryinterfaces";
import { IProduct, IReview } from "../../interfaces/dbinterfaces";
import { ObjectId } from "mongoose";

export const reviewController = {
  create: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const { user } = req;

    const product: IProduct | null = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    const existingReview = await Review.findOne({
      product: productId,
      user: user!.id,
    });
    if (existingReview)
      throw new AppError("You already submitted a review", 400);

    const review = await Review.create({
      product: productId,
      user: user!.id,
      rating,
      comment,
    });

    product.reviews!.push(review._id);

    await product.save();

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  }),

  getReviews: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    const reviews = await Review.find({ product: productId })
      .select("comment rating")
      .populate({
        path: "user",
        select: "username",
      })
      .populate({
        path: "product",
        select: "name averageRating numReviews",
      });
    res.status(200).json({
      reviews,
    });
  }),

  deleteReview: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    const review = await Review.findOneAndDelete({ user: req.user!.id });

    if (!review) throw new AppError("Review not found", 404);
    res.status(200).json({
      message: "Review deleted successfully",
      review,
    });
  }),
};
