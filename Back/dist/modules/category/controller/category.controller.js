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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.categoryController = {
    getAll: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield category_model_1.default.find({});
        res.status(200).send({ Data: categories });
    })),
    getCategory: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_model_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).send({ message: "Category not found" });
        }
        res.status(200).send({ Data: category });
    })),
    createCategory: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description, image } = req.body;
        const category = yield category_model_1.default.create({
            name,
            description,
            image,
        });
        res.status(200).send({ Data: category });
    })),
    updateCategory: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const { name, description, image } = req.body;
        const category = yield category_model_1.default.findByIdAndUpdate(categoryId, { name, description, image }, { new: true });
        res.status(200).send({ Data: category });
    })),
    deleteCategory: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryId } = req.params;
        const category = yield category_model_1.default.findByIdAndDelete(categoryId);
        res.status(200).send({ message: "Category deleted" });
    })),
};
