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

export default router;
