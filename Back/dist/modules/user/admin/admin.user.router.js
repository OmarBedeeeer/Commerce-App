"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_user_controller_1 = require("../admin/admin.user.controller");
const user_auth_1 = require("../controller/user.auth");
const user_validation_1 = require("../../../utils/validation/user.validation");
const router = (0, express_1.Router)();
router.post("/admin-register", user_validation_1.createUserValidation, admin_user_controller_1.adminAuthController.sginUp);
router.post("/admin-login", user_validation_1.validateLogin, admin_user_controller_1.adminAuthController.LogIn);
router.patch("/admin-change-password", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), user_validation_1.changePassValidation, admin_user_controller_1.adminAuthController.changePassword);
router.put("/admin-update-user", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), user_validation_1.updateUserValidation, admin_user_controller_1.adminAuthController.updateAdmin);
router.put("/:userId/deactivate-user", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), user_validation_1.userParamControlValidation, admin_user_controller_1.adminAuthController.disableUser);
router.put("/:userId/reactive-User", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), user_validation_1.userParamControlValidation, admin_user_controller_1.adminAuthController.enableUser);
exports.default = router;