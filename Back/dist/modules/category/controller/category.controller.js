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
exports.categoryController = void 0;
const category_model_1 = __importDefault(require("../model/category.model"));
const errorhandler_1 = require("../../../utils/errorhandler");
const api_features_1 = require("../../../utils/api.features");
exports.categoryController = {
    getAll: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const apiProductFeatures = new api_features_1.ApiFeatures(category_model_1.default.find({ deleted: false }), req.query);
        apiProductFeatures.filter().sort().paginate();
        const categories = yield apiProductFeatures.query;
        if (!categories)
            throw new errorhandler_1.AppError("Categories not found", 404);
        res.send(categories);
    })),
    getCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const category = yield category_model_1.default.findOne({
            _id: categoryId,
            deleted: false,
        });
        if (!category)
            throw new errorhandler_1.AppError("Category not found", 404);
        res.status(200).json(category);
    })),
    createCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description, image } = req.body;
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const newCategory = yield category_model_1.default.create({
            name,
            description,
            image,
            createdBy: req.user.id,
        });
        if (!newCategory)
            throw new errorhandler_1.AppError("Something went wrong", 400);
        res.status(201).json({
            message: "Category created successfully",
            category: newCategory,
        });
    })),
    updateCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const { name, description, image } = req.body;
        const category = yield category_model_1.default.findByIdAndUpdate(categoryId, { name, description, image }, {
            new: true,
        }).populate("createdBy");
        if (!category)
            throw new errorhandler_1.AppError("Can't update Category", 400);
        res.status(200).json({
            message: "Category updated successfully",
            category,
        });
    })),
    deactiveCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const category = yield category_model_1.default.findByIdAndUpdate({ _id: categoryId }, { deleted: true, deletedAt: new Date() }, { new: true });
        if (!category)
            throw new errorhandler_1.AppError("Can't delete Category", 400);
        res.status(200).json({
            message: "Category deleted successfully",
            category,
        });
    })),
    getAllCategories: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const apiProductFeatures = new api_features_1.ApiFeatures(category_model_1.default.find({ deleted: false }), req.query);
        apiProductFeatures.filter().sort().paginate();
        const categories = yield apiProductFeatures.query;
        if (!categories)
            throw new errorhandler_1.AppError("Categories not found", 404);
        res.status(200).send(categories);
    })),
    restoreCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const category = yield category_model_1.default.findByIdAndUpdate({ _id: categoryId }, { deleted: false, deletedAt: null }, { new: true });
        if (!category)
            throw new errorhandler_1.AppError("Can't restore Category", 400);
        res.status(200).json({
            message: "Category restored successfully",
            category,
        });
    })),
    deleteCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const category = yield category_model_1.default.findByIdAndDelete({
            _id: categoryId,
        });
        if (!category)
            throw new errorhandler_1.AppError("Can't delete Category", 400);
        res.status(200).json({
            message: "Category deleted successfully",
            category,
        });
    })),
};
