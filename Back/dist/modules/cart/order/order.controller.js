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
exports.orderController = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const errorhandler_1 = require("../../../utils/errorhandler");
const user_model_1 = __importDefault(require("../../user/model/user.model"));
exports.orderController = {
    getUserOrders: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield user_model_1.default.findById({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        let orders;
        if (user.role === "admin") {
            orders = yield order_model_1.default.find().populate("user", "name email");
        }
        else {
            orders = yield order_model_1.default.find({ user: user._id })
                .populate({
                path: "user",
                select: "name email",
            })
                .populate({
                path: "products.product",
                select: "name image price",
            });
        }
        if (!orders || orders.length === 0) {
            return res
                .status(200)
                .json({ message: "Your orders list is empty for now" });
        }
        res.status(200).json({ success: true, orders });
    })),
    updateOrder: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { orderId } = req.params;
        const { status } = req.body;
        const updateOrder = yield order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updateOrder)
            throw new errorhandler_1.AppError("Order not found", 404);
        res.status(200).json({ updateOrder });
    })),
    deleteOrder: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { orderId } = req.params;
        const user = yield user_model_1.default.findById({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        let orders;
        if (user.role === "admin") {
            orders = yield order_model_1.default.findOneAndDelete({ _id: orderId });
        }
        else {
            orders = yield order_model_1.default.findOneAndDelete({ user: user._id });
        }
        if (!orders)
            throw new errorhandler_1.AppError("Order not found", 404);
        res.status(200).json({ success: true, orders });
    })),
};
