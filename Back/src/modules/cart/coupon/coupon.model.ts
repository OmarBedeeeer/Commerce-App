import mongoose, { Document, Model } from "mongoose";
import { ICoupon } from "../../../interfaces/dbinterfaces";

const couponSchema = new mongoose.Schema<ICoupon>(
  {
    coupon: {
      type: String,
      required: true,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minCartValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscountValue: {
      type: Number,
      default: null,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

couponSchema.methods.applyCoupon = function (cartTotal: number): number {
  if (!this.isActive || this.expiryDate < Date.now()) {
    throw new Error("Coupon is invalid or expired.");
  }

  if (cartTotal < this.minCartValue) {
    throw new Error(
      `Cart total must be at least ${this.minCartValue} to use this coupon.`
    );
  }

  let discount = 0;
  if (this.discountType === "percentage") {
    discount = (this.discountValue / 100) * cartTotal;
    if (this.maxDiscountValue) {
      discount = Math.min(discount, this.maxDiscountValue);
    }
  } else if (this.discountType === "fixed") {
    discount = this.discountValue;
  }

  return Math.max(cartTotal - discount, 0);
};

const Coupon = mongoose.model<ICoupon, Model<ICoupon>>("Coupon", couponSchema);
export default Coupon;
