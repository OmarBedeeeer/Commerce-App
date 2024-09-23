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
//worked
router.post("/register", createUserValidation, userAuthController.sginUp);
//worked
router.post("/login", validateLogin, userAuthController.LogIn);
//worked
router.get("/verify/:token", userAuthController.verfyEmail);
//worked
router.post("/reset", userAuthController.forgetPassword);
//worked
router.get("/reset/:token", userAuthController.resetPassword);
//worked
router.patch(
  "/change-password",
  authentecation,
  changePassValidation,
  userAuthController.changePassword
);
//worked
router.patch(
  "/deactivate-user",
  authentecation,
  userAuthController.softDeleteUser
);
//worked
router.patch("/reactive-user", authentecation, userAuthController.reactiveUser);
//worked
router.put(
  "/update-profile",
  authentecation,
  updateUserValidation,
  userAuthController.updateUser
);
//worked
router.delete("/delete-user", authentecation, userAuthController.deleteUser);
export default router;
