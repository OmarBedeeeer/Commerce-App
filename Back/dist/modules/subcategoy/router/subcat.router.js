"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_auth_1 = require("../../user/controller/user.auth");
const subcat_controller_1 = require("../controller/subcat.controller");
const subcategory_validation_1 = require("../../../utils/validation/subcategory.validation");
const multer_1 = __importDefault(require("../../../middlewares/multer"));
const router = (0, express_1.Router)();
router.get("/subcategories", subcat_controller_1.subcategoryController.subCategories);
router.get("/subcategories/:subCategoryId", subcategory_validation_1.paramValidation, subcat_controller_1.subcategoryController.getSubCategory);
router.post("/founder", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), (0, multer_1.default)("img"), subcategory_validation_1.createSubCategoryValidation, subcat_controller_1.subcategoryController.createSubCategory);
router.patch("/founder/subcategories/:subCategoryId", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), subcategory_validation_1.updateSubCategoryValidation, subcat_controller_1.subcategoryController.updateSubCategory);
router.patch("/founder/subcategories/:subCategoryId/deactive", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), subcategory_validation_1.paramValidation, subcat_controller_1.subcategoryController.deactiveSubCategory);
router.patch("/founder/subcategories/:subCategoryId/reactive", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), subcategory_validation_1.paramValidation, subcat_controller_1.subcategoryController.reactiveSubCategory);
router.delete("/founder/subcategories/:subCategoryId/delete-subcategory", user_auth_1.authentecation, (0, user_auth_1.authorized)("admin"), subcategory_validation_1.paramValidation, subcat_controller_1.subcategoryController.deleteSubCategory);
exports.default = router;