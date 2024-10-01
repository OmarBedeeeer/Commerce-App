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
router.get("/verify/:token", userAuthController.verfyEmail);
router.post("/reset", userAuthController.forgetPassword);
router.get("/reset/:token", userAuthController.resetPassword);
router.patch(
  "/change-password",
  authentecation,
  changePassValidation,
  userAuthController.changePassword
);
router.patch(
  "/deactivate-user",
  authentecation,
  userAuthController.softDeleteUser
);
router.patch("/reactive-user", authentecation, userAuthController.reactiveUser);
router.put(
  "/update-profile",
  authentecation,
  updateUserValidation,
  userAuthController.updateUser
);
router.delete("/delete-user", authentecation, userAuthController.deleteUser);
export default router;
