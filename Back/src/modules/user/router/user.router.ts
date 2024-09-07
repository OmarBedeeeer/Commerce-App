import { Router } from "express";
import { userAuthController } from "../controller/userManage.controller";
import { authentecation } from "../controller/user.auth";
import {
  changePassValidation,
  createUserValidation,
  paramValidation,
  updateUserValidation,
  validateLogin,
} from "../../../utils/validation/user.validation";

const router = Router();
router.post("/register", createUserValidation, userAuthController.sginUp);
router.post("/login", validateLogin, userAuthController.LogIn);
router.patch(
  "/:id/change-password",
  authentecation,
  changePassValidation,
  userAuthController.changePassword
);
router.patch(
  "/:id/deactivate-user",
  authentecation,
  paramValidation,
  userAuthController.softDeleteUser
);
router.put(
  "/:id/update-profile",
  authentecation,
  updateUserValidation,
  userAuthController.updateUser
);
router.delete(
  "/:id/delete-user",
  authentecation,
  paramValidation,
  userAuthController.deleteUser
);
export default router;
