import { Router } from "express";
import { adminAuthController } from "../admin/admin.user.controller";
import { authentecation, authorized } from "../controller/user.auth";

const router = Router();

router.post("/admin-register", adminAuthController.sginUp);
router.post("/admin-login", adminAuthController.LogIn);
router.patch(
  "/:id/admin-change-password",
  authentecation,
  authorized("admin"),
  adminAuthController.changePassword
);
router.put(
  "/:id/admin-update-user",
  authentecation,
  authorized("admin"),
  adminAuthController.updateAdmin
);

router.put(
  "/:id/deactivate-user",
  authentecation,
  authorized("admin"),
  adminAuthController.disableUser
);

router.delete(
  "/:id/delete-admin",
  authentecation,
  authorized("admin"),
  adminAuthController.deleteAdmin
);

export default router;
