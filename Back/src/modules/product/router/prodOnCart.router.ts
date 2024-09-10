import { Router } from "express";
import { prodOnCart } from "../controller/prodOnCart.controller";
import { authentecation } from "../../user/controller/user.auth";

const router: Router = Router();

router.get("/", authentecation, prodOnCart.getProductsOnCart);
router.post("/:productId", authentecation, prodOnCart.addProductToCart);

export default router;
