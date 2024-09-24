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
const product_model_1 = __importDefault(require("../../product/model/product.model"));
const cloudinary_1 = __importDefault(require("../../../middlewares/cloudinary"));
const img_model_1 = __importDefault(require("../../img/model/img.model"));
exports.subcategoryController = {
    subCategories: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const apiProductFeatures = new api_features_1.ApiFeatures(subcat_model_1.default.find({ deleted: false }).populate("image"), req.query);
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
        }).populate("image");
        if (!subCategory)
            throw new errorhandler_1.AppError("Subcategory not found", 404);
        res.status(200).json(subCategory);
    })),
    createSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
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
        const newSubCategory = yield subcat_model_1.default.create({
            name,
            description,
            image: img,
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
        const findSubCate = yield subcat_model_1.default.findOne({
            _id: subCategoryId,
            deleted: false,
        });
        const allSubCateProducts = yield product_model_1.default.find({
            Subcategory: subCategoryId,
            deleted: false,
        });
        if (!findSubCate)
            throw new errorhandler_1.AppError("Sub-Category Not found", 404);
        if (!allSubCateProducts)
            throw new errorhandler_1.AppError("Product Not found", 404);
        yield Promise.all(allSubCateProducts.map((prod) => __awaiter(void 0, void 0, void 0, function* () {
            prod.deleted = true;
            prod.deletedAt = new Date();
            yield prod.save();
        })));
        const deleteSubCate = yield subcat_model_1.default.updateOne({
            _id: findSubCate === null || findSubCate === void 0 ? void 0 : findSubCate.id,
        }, {
            deleted: true,
            deletedAt: new Date(),
        }, {
            new: true,
        });
        yield subcat_model_1.default.findByIdAndUpdate({ _id: subCategoryId }, { modifed_by: req.user.id, deleted: true, deletedAt: new Date() }, { new: true });
        if (!deleteSubCate)
            throw new errorhandler_1.AppError("Can't delete Subcategory", 400);
        res.status(200).json({
            message: "Subcategory deleted successfully",
        });
    })),
    reactiveSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { subCategoryId } = req.params;
        const findSubCate = yield subcat_model_1.default.findOne({
            _id: subCategoryId,
            deleted: true,
        });
        const allSubCateProducts = yield product_model_1.default.find({
            Subcategory: subCategoryId,
            deleted: true,
        });
        if (!findSubCate)
            throw new errorhandler_1.AppError("Sub-Category Not found", 404);
        yield product_model_1.default.updateMany({
            Subcategory: subCategoryId,
            deleted: true,
        }, {
            deleted: false,
            deletedAt: null,
        });
        const reactiveSubCate = yield subcat_model_1.default.updateOne({
            _id: findSubCate === null || findSubCate === void 0 ? void 0 : findSubCate.id,
        }, {
            deleted: false,
            deletedAt: null,
        }, {
            new: true,
        });
        yield subcat_model_1.default.findByIdAndUpdate({ _id: subCategoryId }, { modifed_by: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, deleted: false, deletedAt: null }, { new: true });
        if (!reactiveSubCate)
            throw new errorhandler_1.AppError("Can't delete Subcategory", 400);
        res.status(200).json({
            message: "Subcategory reactivated successfully",
        });
    })),
    deleteSubCategory: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { subCategoryId } = req.params;
        const findSubCate = yield subcat_model_1.default.findOneAndDelete({
            _id: subCategoryId,
            deleted: false,
        });
        if (!findSubCate)
            throw new errorhandler_1.AppError("Sub-Category Not found", 404);
        const products = yield product_model_1.default.deleteMany({
            Subcategory: subCategoryId,
            deleted: false,
        });
        res.status(200).json({
            message: "Subcategory deleted successfully",
        });
    })),
};
