import { Router } from "express";
import { couponController } from "./coupon.controller";
import { authentecation, authorized } from "../../user/controller/user.auth";
import {
  createCouponValidation,
  getCouponValidation,
  deleteCouponValidation,
} from "../../../utils/validation/coupon.validation";
const router: Router = Router();

router.post(
  "/create-coupon",
  authentecation,
  authorized("admin"),
  createCouponValidation,
  couponController.createCoupon
);

router.get(
  "/list",
  authentecation,
  authorized("admin"),
  couponController.getAllCoupons
);

router.get(
  "/:coupon",
  authentecation,
  authorized("admin"),
  getCouponValidation,
  couponController.getCoupon
);

router.delete(
  "/:coupon",
  authentecation,
  authorized("admin"),
  deleteCouponValidation,
  couponController.deleteCoupon
);

export default router;
