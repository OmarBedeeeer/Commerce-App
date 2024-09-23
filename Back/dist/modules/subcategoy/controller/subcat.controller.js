"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcategoryController = void 0;
const subcat_model_1 = __importDefault(require("../model/subcat.model"));
const errorhandler_1 = require("../../../utils/errorhandler");
const category_model_1 = __importDefault(require("../../category/model/category.model"));
const api_features_1 = require("../../../utils/api.features");
exports.subcategoryController = {
    subCategories: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const apiProductFeatures = new api_features_1.ApiFeatures(subcat_model_1.default.find({ deleted: false }), req.query);
        apiProductFeatures.filter().sort().paginate();
        const subCategories = yield apiProductFeatures.query;
        if (!subCategories)
            throw new errorhandler_1.AppError("Subcategories not found", 404);
        res.status(200).json(subCategories);
    })),
    getSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { subCategoryId } = req.params;
        const subCategory = yield subcat_model_1.default.findOne({
            _id: subCategoryId,
            deleted: false,
        });
        if (!subCategory)
            throw new errorhandler_1.AppError("Subcategory not found", 404);
        res.status(200).json(subCategory);
    })),
    createSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description, image } = req.body;
        const { category_name } = req.query;
        if (!category_name)
            throw new errorhandler_1.AppError("Category not found", 404);
        const findSub = yield subcat_model_1.default.findOne({ name });
        if (findSub)
            throw new errorhandler_1.AppError("Subcategory already exists", 400);
        const findCategory = yield category_model_1.default.findOne({ slug: category_name });
        if (!findCategory)
            throw new errorhandler_1.AppError("Category not found", 404);
        const newSubCategory = yield subcat_model_1.default.create({
            name,
            description,
            image,
            category: findCategory._id,
            created_by: findCategory.createdBy,
        });
        if (!newSubCategory)
            throw new errorhandler_1.AppError("Something went wrong", 400);
        res.status(201).json({
            message: "Subcategory created successfully",
            subcategory: newSubCategory,
        });
    })),
    updateSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { subCategoryId } = req.params;
        const { name, description, image } = req.body;
        const findSub = yield subcat_model_1.default.findOne({ name });
        if (findSub)
            throw new errorhandler_1.AppError("select different name, already exists", 404);
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const subcategory = yield subcat_model_1.default.findByIdAndUpdate(subCategoryId, { name, description, image, modifed_by: req.user.id }, {
            new: true,
        });
        if (!subcategory)
            throw new errorhandler_1.AppError("Can't update Subcategory", 400);
        res.status(200).json({
            message: "Subcategory updated successfully",
            subcategory,
        });
    })),
    deactiveSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { subCategoryId } = req.params;
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const subcategory = yield subcat_model_1.default.findByIdAndUpdate({ _id: subCategoryId }, { modifed_by: req.user.id, deleted: true, deletedAt: new Date() }, { new: true });
        if (!subcategory)
            throw new errorhandler_1.AppError("Can't delete Subcategory", 400);
        res.status(200).json({
            message: "Subcategory deleted successfully",
            subcategory,
        });
    })),
    reactiveSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { subCategoryId } = req.params;
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const subcategory = yield subcat_model_1.default.findByIdAndUpdate({ _id: subCategoryId }, { modifed_by: req.user.id, deleted: false, deletedAt: null }, { new: true });
        if (!subcategory)
            throw new errorhandler_1.AppError("Can't delete Subcategory", 400);
        res.status(200).json({
            message: "Subcategory deleted successfully",
            subcategory,
        });
    })),
    deleteSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { subCategoryId } = req.params;
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const findSubCate = yield subcat_model_1.default.findOne({
            _id: subCategoryId,
            deleted: false,
        });
        if (!findSubCate)
            throw new errorhandler_1.AppError("Sub-Category Not found", 404);
        const subcategory = yield subcat_model_1.default.findByIdAndDelete({
            _id: subCategoryId,
        });
        if (!subcategory)
            throw new errorhandler_1.AppError("Can't delete Subcategory", 400);
        res.status(200).json({
            message: "Subcategory deleted successfully",
            subcategory,
        });
    })),
};
