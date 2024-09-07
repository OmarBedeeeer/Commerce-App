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
  "/:id/admin-change-password",
  authentecation,
  authorized("admin"),
  changePassValidation,
  adminAuthController.changePassword
);
router.put(
  "/:id/admin-update-user",
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

router.patch(
  "/:userId/enableUser",
  authentecation,
  authorized("admin"),
  userParamControlValidation,
  adminAuthController.enableUser
);

router.delete(
  "/:id/delete-admin",
  authentecation,
  authorized("admin"),
  paramValidation,
  adminAuthController.deleteAdmin
);

export default router;
