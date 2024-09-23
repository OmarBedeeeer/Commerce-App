import mongoose, { Schema, Types } from "mongoose";
import { IReview, ReviewModel } from "../../interfaces/dbinterfaces";
import Product from "../product/model/product.model";

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.statics.calculateAverageRating = async function (
  productId: Types.ObjectId
) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: result[0].avgRating,
      numReviews: result[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0,
    });
  }
};

reviewSchema.post("save", async function (doc) {
  await (this.constructor as ReviewModel).calculateAverageRating(doc.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.calculateAverageRating(doc.product);
  }
});
const Review = mongoose.model<IReview, ReviewModel>("Review", reviewSchema);

export default Review;
