import { Router } from "express";
import { orderController } from "./order.controller";
import { authentecation, authorized } from "../../user/controller/user.auth";

const router: Router = Router();

router.get("/", authentecation, orderController.getUserOrders);

router.get(
  "/get-order/:orderId",
  authentecation,
  authorized("admin"),
  orderController.getUserOrders
);

router.put(
  "/update-order/:orderId",
  authentecation,
  authorized("admin"),
  orderController.updateOrder
);

router.delete(
  "/delete-order/:orderId",
  authentecation,
  orderController.deleteOrder
);

export default router;
