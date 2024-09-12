import { Router } from "express";
import { couponController } from "./coupon.controller";
import { authentecation, authorized } from "../../user/controller/user.auth";

const router: Router = Router();

router.post(
  "/create-coupon",
  authentecation,
  authorized("admin"),
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
  couponController.getCoupon
);

router.delete(
  "/:coupon",
  authentecation,
  authorized("admin"),
  couponController.deleteCoupon
);

export default router;
