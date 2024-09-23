"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_auth_1 = require("../../user/controller/user.auth");
const category_controller_1 = require("../controller/category.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/category-list", category_controller_1.categoryController.getAll);
router.get("/category-list/:categoryId", category_controller_1.categoryController.getCategory);
router.get("/founder/get-all-categories", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), category_controller_1.categoryController.getAllCategories);
router.post("/founder/create-category", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), category_controller_1.categoryController.createCategory);
router.patch("/founder/:categoryId/update-category", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), category_controller_1.categoryController.updateCategory);
router.patch("/founder/:categoryId/deactive-category", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), category_controller_1.categoryController.deactiveCategory);
router.patch("/founder/:categoryId/recover-category", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), category_controller_1.categoryController.restoreCategory);
router.delete("/founder/:categoryId/delete-category", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), category_controller_1.categoryController.deleteCategory);
exports.default = router;
