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
const subcat_model_1 = __importDefault(require("../../subcategoy/model/subcat.model"));
const product_model_1 = __importDefault(require("../../product/model/product.model"));
const img_model_1 = __importDefault(require("../../img/model/img.model"));
const cloudinary_1 = __importDefault(require("../../../middlewares/cloudinary"));
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
        var _a, _b;
        const { name, description, image } = req.body;
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        let uploadResult;
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
            try {
                uploadResult = yield cloudinary_1.default.uploader.upload(req.file.path, {
                    public_id: req.file.filename,
                });
            }
            catch (error) {
                throw new errorhandler_1.AppError("Cloudinary upload failed", 500);
            }
        }
        else {
            throw new errorhandler_1.AppError("No file uploaded", 400);
        }
        const img = yield img_model_1.default.create({
            name: (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname,
            path: (uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url) || "",
        });
        const newCategory = yield category_model_1.default.create({
            name,
            description,
            image: img,
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
        const findCategory = yield category_model_1.default.findOneAndUpdate({
            _id: categoryId,
            deleted: false,
        }, {
            deleted: true,
            deletedAt: new Date(),
        }, {
            new: true,
        });
        if (!findCategory)
            throw new errorhandler_1.AppError("Category Not found", 404);
        const deletedSubCategories = yield subcat_model_1.default.find({
            category: findCategory._id,
            deleted: false,
        });
        yield Promise.all(deletedSubCategories.map((prod) => __awaiter(void 0, void 0, void 0, function* () {
            prod.deleted = true;
            prod.deletedAt = new Date();
            yield prod.save();
        })));
        const subCategoryIds = deletedSubCategories.map((sub) => sub._id);
        yield product_model_1.default.updateMany({
            Subcategory: { $in: subCategoryIds },
            deleted: false,
        }, { deleted: true, deletedAt: new Date() });
        res.status(200).json({
            message: "Category and all related subcategories and products deleted successfully",
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
        const findCategory = yield category_model_1.default.findOneAndUpdate({
            _id: categoryId,
            deleted: true,
        }, {
            deleted: false,
            deletedAt: null,
        }, {
            new: true,
        });
        if (!findCategory)
            throw new errorhandler_1.AppError("Category Not found", 404);
        const deletedSubCategories = yield subcat_model_1.default.find({
            category: findCategory._id,
            deleted: true,
        });
        yield Promise.all(deletedSubCategories.map((prod) => __awaiter(void 0, void 0, void 0, function* () {
            prod.deleted = false;
            prod.deletedAt = null;
            yield prod.save();
        })));
        const subCategoryIds = deletedSubCategories.map((sub) => sub._id);
        yield product_model_1.default.updateMany({ Subcategory: { $in: subCategoryIds }, deleted: true }, { deleted: false, deletedAt: null });
        res.status(200).json({
            message: "Category and all related subcategories and products restored successfully",
        });
    })),
    deleteCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const findCategory = yield category_model_1.default.findOneAndDelete({
            _id: categoryId,
            deleted: false,
        });
        if (!findCategory)
            throw new errorhandler_1.AppError("Category Not found", 404);
        const deletedSubCategories = yield subcat_model_1.default.find({
            category: categoryId,
            deleted: false,
        });
        if (deletedSubCategories.length > 0) {
            const subCategoryIds = deletedSubCategories.map((sub) => sub._id);
            yield subcat_model_1.default.deleteMany({ _id: { $in: subCategoryIds } });
            yield product_model_1.default.deleteMany({ Subcategory: { $in: subCategoryIds } });
        }
        res.status(200).json({
            message: "Category and all related subcategories and products deleted successfully",
        });
    })),
};
