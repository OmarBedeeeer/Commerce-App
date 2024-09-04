import { Router } from "express";
import { userAuthController } from "../controller/userManage.controller";
import { authentecation } from "../controller/user.auth";

const router = Router();
router.post("/register", userAuthController.sginUp);
router.post("/login", userAuthController.LogIn);
router.patch(
  "/:id/change-password",
  authentecation,
  userAuthController.changePassword
);
router.patch(
  "/:id/deactivate-user",
  authentecation,
  userAuthController.softDeleteUser
);
router.put(
  "/:id/update-profile",
  authentecation,
  userAuthController.updateUser
);
router.delete(
  "/:id/delete-user",
  authentecation,
  userAuthController.deleteUser
);
export default router;
