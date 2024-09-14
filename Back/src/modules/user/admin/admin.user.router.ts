import { Router } from "express";
import { adminAuthController } from "../admin/admin.user.controller";
import { authentecation, authorized } from "../controller/user.auth";
import {
  changePassValidation,
  createUserValidation,
  updateUserValidation,
  userParamControlValidation,
  paramValidation,
  validateLogin,
} from "../../../utils/validation/user.validation";

const router = Router();

router.post(
  "/admin-register",
  createUserValidation,
  adminAuthController.sginUp
);
router.post("/admin-login", validateLogin, adminAuthController.LogIn);

router.patch(
  "/admin-change-password",
  authentecation,
  authorized("admin"),
  changePassValidation,
  adminAuthController.changePassword
);

router.put(
  "/admin-update-user",
  authentecation,
  authorized("admin"),
  updateUserValidation,
  adminAuthController.updateAdmin
);

router.put(
  "/:userId/deactivate-user",
  authentecation,
  authorized("admin"),
  userParamControlValidation,
  adminAuthController.disableUser
);

router.put(
  "/:userId/reactive-User",
  authentecation,
  authorized("admin"),
  userParamControlValidation,
  adminAuthController.enableUser
);

export default router;
