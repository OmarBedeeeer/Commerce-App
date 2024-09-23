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
exports.adminAuthController = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorhandler_1 = require("../../../utils/errorhandler");
const cart_model_1 = __importDefault(require("../../cart/cart.model"));
exports.adminAuthController = {
    sginUp: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password, username, phoneNumber, age, address } = req.body;
        const user = yield user_model_1.default.findOne({
            $or: [{ email }, { phoneNumber }],
        });
        if (user)
            throw new errorhandler_1.AppError("User or Phone number already exists.", 400);
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(process.env.SECRET_ROUNDS));
        const newUser = yield user_model_1.default.create({
            username,
            email,
            phoneNumber,
            password: hashedPassword,
            age,
            role: "admin",
            address,
        });
        if (!newUser)
            throw new errorhandler_1.AppError("Something went wrong", 400);
        const newCart = yield cart_model_1.default.create({
            user: newUser._id,
            products: [],
            total: 0,
        });
        return res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    })),
    LogIn: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userName, password } = req.body;
        const user = yield user_model_1.default.findOne({
            deleted: false,
            $or: [{ email: userName }, { phoneNumber: userName }],
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (user.role !== "admin") {
            return res.status(400).json({ message: "forrbidden" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET);
        const newCart = yield cart_model_1.default.create({
            user: user._id,
            products: [],
            total: 0,
        });
        return res.status(200).json({
            message: "User logged in successfully",
            token,
        });
    })),
    changePassword: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { oldPassword, newPassword } = req.body;
        const user = yield user_model_1.default.findById({ _id: req.user.id });
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        if (user.id != req.user.id)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch)
            throw new errorhandler_1.AppError("Invalid password", 400);
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(process.env.SECRET_ROUNDS));
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({
            message: "Password changed successfully",
        });
    })),
    updateAdmin: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, phoneNumber, age } = req.body;
        if (!req.body)
            throw new errorhandler_1.AppError("Please provide at least one field", 400);
        const updateUserProfile = yield user_model_1.default.findByIdAndUpdate({ _id: req.user.id, deleted: false }, {
            username,
            phoneNumber,
            age,
        }, {
            new: true,
        });
        if ((updateUserProfile === null || updateUserProfile === void 0 ? void 0 : updateUserProfile._id.toString()) != req.user.id)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        return res.status(200).json({
            message: "Profile updated successfully",
        });
    })),
    disableUser: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const cart = yield cart_model_1.default.findOneAndUpdate({
            user: user.id,
        }, {
            deleted: true,
            deletedAt: new Date(),
        });
        const disableUser = yield user_model_1.default.findByIdAndUpdate(userId, {
            deleted: true,
            deletedAt: new Date(),
        }, {
            new: true,
        });
        return res.status(200).json({
            message: "User disabled successfully",
            user: disableUser,
        });
    })),
    enableUser: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!req.user) {
            throw new errorhandler_1.AppError("Unauthorized", 401);
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const enableUser = yield user_model_1.default.findByIdAndUpdate(userId, {
            deleted: false,
            deletedAt: null,
        }, {
            new: true,
        });
        return res.status(200).json({
            message: "User enabled successfully",
            user: enableUser,
        });
    })),
    getUser: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        if (!req.user) {
            throw new errorhandler_1.AppError("Unauthorized", 401);
        }
        const user = yield user_model_1.default.findById(userId).populate("cart");
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        return res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    })),
};
