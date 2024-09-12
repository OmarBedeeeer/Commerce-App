import { Router } from "express";
import { authorized, authentecation } from "../../user/controller/user.auth";
import { productOnWishList } from "../controller/productOnWishList.controller";

const router: Router = Router();

router.get("/", authentecation, productOnWishList.getWishList);
router.post("/:productId", authentecation, productOnWishList.addProdToWishList);
router.delete(
  "/:productId",
  authentecation,
  productOnWishList.removeFromWishList
);

export default router;
