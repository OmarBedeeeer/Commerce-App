import { Router } from "express";
import { prodOnCart } from "../controller/prodOnCart.controller";
import { authentecation } from "../../user/controller/user.auth";
import {
  confirmCartValidation,
  deleteProductFromCartValidation,
  addProductsOnCartValidation,
} from "../../../utils/validation/prodOnCart.validation";
const router: Router = Router();

router.get("/", authentecation, prodOnCart.getProductsOnCart);
router.post(
  "/:productId",
  authentecation,
  addProductsOnCartValidation,
  prodOnCart.addProductToCart
);
router.delete(
  "/:productId",
  authentecation,
  deleteProductFromCartValidation,
  prodOnCart.deleteProductFromCart
);
router.put(
  "/confirm-order",
  authentecation,
  confirmCartValidation,
  prodOnCart.confirmOrder
);

export default router;
