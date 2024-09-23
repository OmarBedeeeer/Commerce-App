import { Router } from "express";
import { authorized, authentecation } from "../../user/controller/user.auth";
import { productOnWishList } from "../controller/productOnWishList.controller";
import { ProductIdToWishListValidation } from "../../../utils/validation/wishlist.validation";
const router: Router = Router();

router.get("/", authentecation, productOnWishList.getWishList);
router.post(
  "/:productId",
  authentecation,
  ProductIdToWishListValidation,
  productOnWishList.addProdToWishList
);
router.delete(
  "/:productId",
  authentecation,
  ProductIdToWishListValidation,
  productOnWishList.removeFromWishList
);

export default router;
