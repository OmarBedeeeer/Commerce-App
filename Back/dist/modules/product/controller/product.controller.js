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
exports.productController = void 0;
const product_model_1 = __importDefault(require("../model/product.model"));
const img_model_1 = __importDefault(require("../../img/model/img.model"));
const errorhandler_1 = require("../../../utils/errorhandler");
const subcat_model_1 = __importDefault(require("../../subcategoy/model/subcat.model"));
const api_features_1 = require("../../../utils/api.features");
const cloudinary_1 = __importDefault(require("../../../middlewares/cloudinary"));
exports.productController = {
    getProducts: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const apiProductFeatures = new api_features_1.ApiFeatures(product_model_1.default.find({ deleted: false }), req.query);
        apiProductFeatures
            .filter()
            .sort()
            .search(["name", "description"])
            .fields()
            .productPaginate();
        const products = yield apiProductFeatures.query
            .populate({
            path: "Subcategory",
            select: "name image user category",
        })
            .populate({
            path: "image",
            select: "name path",
        });
        if (!products)
            throw new errorhandler_1.AppError("Products not found", 404);
        res.status(200).json({
            products,
        });
    })),
    getProduct: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { product } = req.query;
        const products = yield product_model_1.default.find({
            slug: product,
            deleted: false,
        })
            .populate({
            path: "Subcategory",
            select: "name user category",
        })
            .populate({
            path: "image",
            select: "name path",
        });
        if (!products)
            throw new errorhandler_1.AppError("Products not found", 404);
        res.status(200).json({
            products,
        });
    })),
    createProduct: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { name, description, price, quantity } = req.body;
        const { subCategoryId } = req.params;
        const subCategory = yield subcat_model_1.default.findOne({
            _id: subCategoryId,
            deleted: false,
        });
        if (!subCategory)
            throw new errorhandler_1.AppError("Subcategory not found", 404);
        if (!quantity || quantity < 0)
            throw new errorhandler_1.AppError("Invalid quantity", 400);
        const existingProduct = yield product_model_1.default.findOne({
            name,
            deleted: false,
        });
        if (existingProduct) {
            const updatedProduct = yield product_model_1.default.findOneAndUpdate({ name }, {
                $inc: { quantity: quantity },
            }, { new: true });
            return res.status(200).json({
                message: "Product updated successfully",
                product: updatedProduct,
            });
        }
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
        const newProduct = yield product_model_1.default.create({
            name,
            description,
            image: img,
            price,
            quantity,
            created_by: req.user.id,
            Subcategory: subCategoryId,
            modifed_by: req.user.id,
        });
        return res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });
    })),
    updateProduct: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { productId, subCategoryId } = req.params;
        const { name, description, image, price, quantity } = req.body;
        const subCategory = yield subcat_model_1.default.findById(subCategoryId, {
            deleted: false,
        });
        if (!subCategory)
            throw new errorhandler_1.AppError("Product not found", 404);
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const product = yield product_model_1.default.findById(productId, {
            deleted: false,
        });
        if (!product)
            throw new errorhandler_1.AppError("Product not found", 404);
        if (((_a = product.created_by) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, { name, description, image, price, quantity, modifed_by: req.user.id }, {
            new: true,
        });
        if (!updatedProduct)
            throw new errorhandler_1.AppError("Something went wrong", 400);
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    })),
    deactiveProduct: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { productId } = req.params;
        const product = yield product_model_1.default.findOne({
            _id: productId,
            deleted: false,
        });
        if (!product)
            throw new errorhandler_1.AppError("Product not found", 404);
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        if (((_a = product.created_by) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id &&
            req.user.role !== "admin") {
            throw new errorhandler_1.AppError("Unauthorized", 401);
        }
        const deletedProduct = yield product_model_1.default.findByIdAndUpdate(productId, {
            deleted: true,
            deletedAt: new Date(),
            modifed_by: req.user.id,
        }, {
            new: true,
        });
        if (!deletedProduct)
            throw new errorhandler_1.AppError("Something went wrong", 400);
        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct,
        });
    })),
    reactiveProduct: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { productId } = req.params;
        const product = yield product_model_1.default.findOne({
            _id: productId,
            deleted: true,
        });
        if (!product)
            throw new errorhandler_1.AppError("Product not found", 404);
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        if (((_a = product.created_by) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id &&
            req.user.role !== "admin") {
            throw new errorhandler_1.AppError("Unauthorized", 401);
        }
        const reactiveProduct = yield product_model_1.default.findByIdAndUpdate(productId, {
            deleted: false,
            deletedAt: null,
            modifed_by: req.user.id,
        }, {
            new: true,
        });
        if (!reactiveProduct)
            throw new errorhandler_1.AppError("Something went wrong", 400);
        res.status(200).json({
            message: "Product deleted successfully",
            product: reactiveProduct,
        });
    })),
    deleteProduct: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = req.params;
        if (!req.user)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const findProduct = yield product_model_1.default.findOne({
            _id: productId,
            deleted: false,
        });
        if (!findProduct)
            throw new errorhandler_1.AppError("Product Not found", 404);
        const product = yield product_model_1.default.findByIdAndDelete({
            _id: productId,
        });
        if (!product)
            throw new errorhandler_1.AppError("Can't delete Product", 400);
        res.status(200).json({
            message: "Subcategory deleted successfully",
            product,
        });
    })),
};
