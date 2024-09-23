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
exports.userAuthController = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorhandler_1 = require("../../../utils/errorhandler");
const nodemailer_1 = __importDefault(require("../../../utils/nodemailer"));
exports.userAuthController = {
    sginUp: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password, phoneNumber, age, address, username } = req.body;
        if (req.body.role === "admin")
            throw new errorhandler_1.AppError("Forbidden", 403);
        const user = yield user_model_1.default.findOne({
            $or: [{ email }, { phoneNumber }],
        });
        if (user)
            throw new errorhandler_1.AppError("User or Phone number already exists.", 400);
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(process.env.SECRET_ROUNDS));
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "10min",
        });
        const newUser = yield user_model_1.default.create({
            username,
            email,
            phoneNumber,
            password: hashedPassword,
            age,
            address,
        });
        if (!newUser)
            throw new errorhandler_1.AppError("Something went wrong", 400);
        const createLink = `${process.env.BACKEND_URL}/users/verify/${token}`;
        const message = yield (0, nodemailer_1.default)({
            to: email,
            subject: "Verify your account",
            text: `Please copy the link to Your URL incase it is not Clickble :
         ${createLink}`,
        });
        return res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    })),
    verfyEmail: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.params;
        const { email } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield user_model_1.default.findOne(email);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const updatedUser = yield user_model_1.default.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        if (updatedUser)
            return res.status(200).json({ message: "Email verified" });
        throw new errorhandler_1.AppError("Something went wrong", 500);
    })),
    forgetPassword: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        const user = yield user_model_1.default.findOne(email);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "10min",
        });
        const forgetPasswordLink = `${process.env.BACKEND_URL}/users/reset/${token}`;
        const sendmailer = yield (0, nodemailer_1.default)({
            to: email,
            subject: "Reset your password",
            text: `Please copy the link to Your URL incase it is not Clickble :
       ${forgetPasswordLink}`,
        });
        res.status(200).json({ message: "Email sent successfully" });
    })),
    resetPassword: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.params;
        const { email } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { newPassword } = req.body;
        const user = yield user_model_1.default.findOne(email);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, process.env.SECRET_ROUNDS);
        const updatePassword = yield user_model_1.default.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
        res.status(200).json({ message: "Password reset successfully" });
    })),
    LogIn: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userName, password } = req.body;
        const user = yield user_model_1.default.findOne({
            deleted: false,
            $or: [{ email: userName }, { phoneNumber: userName }],
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password or Username",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).json({
            message: "User logged in successfully",
            token,
        });
    })),
    changePassword: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.params;
        if (!req.user) {
            throw new errorhandler_1.AppError("Unauthorized", 401);
        }
        const user = yield user_model_1.default.findById(id);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 400);
        if (user.id != req.user.id)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(process.env.SECRET_ROUNDS));
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({
            message: "Password changed successfully",
        });
    })),
    updateUser: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        if (!req.user) {
            throw new errorhandler_1.AppError("Please Login first!", 400);
        }
        const { username, phoneNumber, age, address } = req.body;
        if (!req.body)
            throw new errorhandler_1.AppError("Please provide at least one field", 400);
        if (req.body.role === "admin")
            throw new errorhandler_1.AppError("Forbidden", 403);
        const user = yield user_model_1.default.findById(id);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        if (user.id != req.user.id)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const updateUserProfile = yield user_model_1.default.findByIdAndUpdate(id, {
            username,
            phoneNumber,
            age,
            address,
        }, {
            new: true,
        });
        return res.status(200).json({
            message: "User updated successfully",
            updateUserProfile,
        });
    })),
    softDeleteUser: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        if (!req.user) {
            throw new errorhandler_1.AppError("Unauthorized", 401);
        }
        const user = yield user_model_1.default.findById(id);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        if (user.id != req.user.id)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const deleteUser = yield user_model_1.default.findByIdAndUpdate(id, {
            deleted: true,
            deletedAt: new Date(),
        }, {
            new: true,
        });
        return res.status(200).json({
            message: "User deleted successfully",
            deleteUser,
        });
    })),
    deleteUser: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        if (!req.user) {
            throw new errorhandler_1.AppError("Unauthorized", 401);
        }
        const user = yield user_model_1.default.findById(id, {
            deleted: false,
        });
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        if (user.id != req.user.id)
            throw new errorhandler_1.AppError("Unauthorized", 401);
        const deleteUser = yield user_model_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            message: "User deleted successfully",
        });
    })),
};
