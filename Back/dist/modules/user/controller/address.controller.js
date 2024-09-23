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
exports.addressController = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const errorhandler_1 = require("../../../utils/errorhandler");
exports.addressController = {
    addAddress: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { address } = req.body;
        const user = yield user_model_1.default.findById(req.user.id);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const updateUser = yield user_model_1.default.findByIdAndUpdate(req.user.id, {
            address,
        }, {
            new: true,
        });
        if (!updateUser)
            throw new errorhandler_1.AppError("User not found", 404);
        return res.status(200).json({
            message: "Address added successfully",
            updateUser,
        });
    })),
    getAddresses: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(req.user.id);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        return res.status(200).json({
            message: "Addresses loaded successfully",
            addresses: user.address,
        });
    })),
    deleteAddress: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { addressId } = req.params;
        const user = yield user_model_1.default.findById(req.user.id);
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const updateUserAddress = yield user_model_1.default.findByIdAndUpdate(addressId, {
            $pull: {
                address: {
                    _id: addressId,
                },
            },
        }, {
            new: true,
        });
        if (!updateUserAddress)
            throw new errorhandler_1.AppError("User not found", 404);
        return res.status(200).json({
            message: "Address deleted successfully",
        });
    })),
};
