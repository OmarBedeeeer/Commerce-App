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
exports.prodOnCart = void 0;
const product_model_1 = __importDefault(require("../model/product.model"));
const cart_model_1 = __importDefault(require("../../cart/cart.model"));
const errorhandler_1 = require("../../../utils/errorhandler");
const user_model_1 = __importDefault(require("../../user/model/user.model"));
const coupon_model_1 = __importDefault(require("../../cart/coupon/coupon.model"));
const order_model_1 = __importDefault(require("../../cart/order/order.model"));
exports.prodOnCart = {
    getProductsOnCart: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId } = req.params;
        const user = yield user_model_1.default.findById({
            _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const cart = yield cart_model_1.default.findOne({
            user: user._id,
        })
            .select("total user products")
            .populate({
            path: "products.product",
            model: "Product",
            select: "name price description",
        });
        const total = cart.products.reduce((accumulator, item) => {
            const product = item.product;
            const quantity = item.quantity || 0;
            const price = product.price || 0;
            return accumulator + price * quantity;
        }, 0);
        cart.total = total;
        cart === null || cart === void 0 ? void 0 : cart.save();
        res.status(200).json({ message: "Cart loaded", cart });
    })),
    addProductToCart: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { productId } = req.params;
        const { quantity } = req.body;
        const findProduct = yield product_model_1.default.findById(productId);
        if (!findProduct)
            throw new errorhandler_1.AppError("Can't find Product.", 404);
        if (findProduct.quantity < quantity) {
            throw new errorhandler_1.AppError("Not enough quantity", 400);
        }
        const updateCart = yield cart_model_1.default.findOneAndUpdate({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        }, {
            $addToSet: {
                products: {
                    product: productId,
                    quantity: quantity || 1,
                },
            },
        }, { new: true })
            .select("user products total")
            .populate({
            path: "products.product",
            model: "Product",
            select: "name price description",
        });
        updateCart.total += findProduct.price * quantity;
        yield (updateCart === null || updateCart === void 0 ? void 0 : updateCart.save());
        return res.status(200).json({
            message: "Product added to cart successfully",
            updateCart,
        });
    })),
    deleteProductFromCart: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const { productId } = req.params;
        const cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
            .select("user products total")
            .populate({
            path: "products.product",
            model: "Product",
            select: "name price",
        });
        if (!cart) {
            throw new errorhandler_1.AppError("Cart not found.", 404);
        }
        const productIndex = (_b = cart.products) === null || _b === void 0 ? void 0 : _b.findIndex((p) => p.product._id.toString() === productId);
        if (productIndex === -1) {
            throw new errorhandler_1.AppError("Product not found in cart.", 404);
        }
        const productInCart = cart.products[productIndex];
        const priceReduction = productInCart.product.price * productInCart.quantity;
        cart.total = ((_c = cart.total) !== null && _c !== void 0 ? _c : 0) - priceReduction;
        cart.products.splice(productIndex, 1);
        yield cart.save();
        return res.status(200).json({
            message: "Product instance removed from cart successfully",
            cart,
        });
    })),
    confirmOrder: (0, errorhandler_1.CatchError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { coupon, address } = req.body;
        const user = yield user_model_1.default.findById({
            _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        if (!user)
            throw new errorhandler_1.AppError("User not found", 404);
        const cart = yield cart_model_1.default.findOne({
            user: user._id,
        })
            .select("products total")
            .populate({
            path: "products.product",
            model: "Product",
            select: "name price description",
        });
        if (!cart || ((_b = cart.products) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            throw new errorhandler_1.AppError("Cart is empty", 400);
        }
        let cartTotal = cart.total;
        if (coupon) {
            const couponData = yield coupon_model_1.default.findOne({ coupon, isActive: true });
            if (!couponData || !couponData.isActive) {
                throw new errorhandler_1.AppError("Invalid or expired coupon", 400);
            }
            if (cartTotal < couponData.minCartValue) {
                throw new errorhandler_1.AppError(`Cart total must be at least ${couponData.minCartValue} to apply the coupon`, 400);
            }
            cartTotal = couponData.applyCoupon(cartTotal);
            couponData.usedCount += 1;
            yield couponData.save();
        }
        const order = yield order_model_1.default.create({
            user: user._id,
            products: cart.products,
            total: cartTotal,
            address,
        });
        cart.products = [];
        cart.total = 0;
        yield cart.save();
        for (const cartItem of cart.products) {
            const productId = cartItem.product._id;
            const quantityOrdered = cartItem.quantity;
            const product = yield product_model_1.default.findById(productId);
            if (!product) {
                throw new errorhandler_1.AppError(`Product not found.`, 404);
            }
            if (product.quantity < quantityOrdered) {
                throw new errorhandler_1.AppError(`Insufficient stock for product ${product.name}.`, 400);
            }
            product.quantity -= quantityOrdered;
            yield product.save();
        }
        return res.status(200).json({
            message: "Order placed successfully",
            order,
        });
    })),
};
