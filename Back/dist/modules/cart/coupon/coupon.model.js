"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    coupon: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 10,
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    minCartValue: {
        type: Number,
        required: true,
        min: 0,
    },
    maxDiscountValue: {
        type: Number,
        default: null,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
couponSchema.methods.applyCoupon = function (cartTotal) {
    if (!this.isActive || this.expiryDate < Date.now()) {
        throw new Error("Coupon is invalid or expired.");
    }
    if (cartTotal < this.minCartValue) {
        throw new Error(`Cart total must be at least ${this.minCartValue} to use this coupon.`);
    }
    let discount = 0;
    if (this.discountType === "percentage") {
        discount = (this.discountValue / 100) * cartTotal;
        if (this.maxDiscountValue) {
            discount = Math.min(discount, this.maxDiscountValue);
        }
    }
    else if (this.discountType === "fixed") {
        discount = this.discountValue;
    }
    return Math.max(cartTotal - discount, 0);
};
const Coupon = mongoose_1.default.model("Coupon", couponSchema);
exports.default = Coupon;
