import { Router } from "express";
import { reviewController } from "./review.controller";
import { authentecation, authorized } from "../user/controller/user.auth";
import {
  createReviewValidation,
  reviewsParamValidation,
} from "../../utils/validation/reviews.validation";

const router: Router = Router();

router.post(
  "/:productId/create",
  authentecation,
  createReviewValidation,
  reviewController.create
);

router.get(
  "/:productId",
  authentecation,
  reviewsParamValidation,
  reviewController.getReviews
);

router.delete(
  "/:productId/delete",
  authentecation,
  reviewsParamValidation,
  reviewController.deleteReview
);

export default router;
