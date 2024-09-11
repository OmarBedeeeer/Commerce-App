import { Router } from "express";
import { prodOnCart } from "../controller/prodOnCart.controller";
import { authentecation } from "../../user/controller/user.auth";

const router: Router = Router();

router.get("/", authentecation, prodOnCart.getProductsOnCart);
router.post("/:productId", authentecation, prodOnCart.addProductToCart);
router.delete("/:productId", authentecation, prodOnCart.deleteProductFromCart);
router.put("/confirm-order/:userId", authentecation, prodOnCart.confirmOrder);

export default router;
