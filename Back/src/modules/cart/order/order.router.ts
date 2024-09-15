import { Router } from "express";
import { orderController } from "./order.controller";
import { authentecation, authorized } from "../../user/controller/user.auth";
import {
  updateOrderValidation,
  deleteOrderValidation,
  getOrderValidation,
} from "../../../utils/validation/order.validation";
const router: Router = Router();

router.get("/", authentecation, orderController.getUserOrders);

router.get(
  "/get-order/:orderId",
  authentecation,
  getOrderValidation,
  orderController.getUserOrders
);

router.put(
  "/update-order/:orderId",
  authentecation,
  authorized("admin"),
  updateOrderValidation,
  orderController.updateOrder
);

router.delete(
  "/delete-order/:orderId",
  authentecation,
  deleteOrderValidation,
  orderController.deleteOrder
);

export default router;
