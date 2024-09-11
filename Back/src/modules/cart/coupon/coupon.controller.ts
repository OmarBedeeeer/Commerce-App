import { Request, Response } from "express";
import { AppError, CatchError } from "../../../utils/errorhandler";
import Coupon from "./coupon.model";
import { ICoupon } from "../../../interfaces/dbinterfaces";
import { ParamsIds } from "../../../interfaces/Queryinterfaces";

export const couponController = {
  createCoupon: CatchError(async (req: Request, res: Response) => {
    const {
      code,
      discountType,
      discountValue,
      minCartValue,
      maxDiscountValue,
      expiryDate,
      isActive,
      usageLimit,
    } = req.body;

    const existingCoupon: ICoupon | null = await Coupon.findOne({ code });
    if (existingCoupon) {
      throw new AppError("Coupon already exists", 400);
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minCartValue,
      maxDiscountValue,
      expiryDate,
      isActive,
      usageLimit,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  }),

  getCoupon: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const coupon: ICoupon | null = await Coupon.findOne({
      code: req.params.code,
    });
    if (!coupon) throw new AppError("Coupon not found", 404);

    res.status(200).json({
      success: true,
      data: coupon,
    });
  }),

  getAllCoupons: CatchError(async (req: Request, res: Response) => {
    const coupons: ICoupon[] = await Coupon.find();
    res.status(200).json({
      success: true,
      data: coupons,
    });
  }),

  deleteCoupon: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const coupon: ICoupon | null = await Coupon.findOneAndDelete({
      code: req.params.code,
    });
    if (!coupon) throw new AppError("Coupon not found", 404);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  }),
};
