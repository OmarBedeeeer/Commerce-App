"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_connection_1 = __importDefault(require("./db/db.connection"));
const dotenv_1 = __importDefault(require("dotenv"));
const category_router_1 = __importDefault(require("./modules/category/router/category.router"));
const subcat_router_1 = __importDefault(require("./modules/subcategoy/router/subcat.router"));
const product_router_1 = __importDefault(require("./modules/product/router/product.router"));
const user_router_1 = __importDefault(require("./modules/user/router/user.router"));
const address_router_1 = __importDefault(require("./modules/user/router/address.router"));
const admin_user_router_1 = __importDefault(require("./modules/user/admin/admin.user.router"));
const prodOnCart_router_1 = __importDefault(require("./modules/product/router/prodOnCart.router"));
const coupon_router_1 = __importDefault(require("./modules/cart/coupon/coupon.router"));
const order_router_1 = __importDefault(require("./modules/cart/order/order.router"));
const prodOnWishList_router_1 = __importDefault(require("./modules/product/router/prodOnWishList.router"));
const review_router_1 = __importDefault(require("./modules/reviews/review.router"));
const errorhandler_1 = require("./utils/errorhandler");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.static("upload"));
app.use("/api/v1/user", user_router_1.default);
app.use("/api/v1/user", address_router_1.default);
app.use("/api/v1/founder", admin_user_router_1.default);
app.use("/api/v1/category", category_router_1.default);
app.use("/api/v1/category", subcat_router_1.default);
app.use("/api/v1/product", product_router_1.default);
app.use("/api/v1/cart", prodOnCart_router_1.default);
app.use("/api/v1/coupon", coupon_router_1.default);
app.use("/api/v1/orders", order_router_1.default);
app.use("/api/v1/wishlist", prodOnWishList_router_1.default);
app.use("/api/v1/reviews", review_router_1.default);
app.all("*", (req, res, next) => {
    res.status(404).send("Can't find this Page");
});
app.use((error, req, res, next) => {
    if (error instanceof errorhandler_1.AppError) {
        return res.status(error.status).json({
            message: error.message,
        });
    }
    else {
        const message = process.env.ENV === "Production"
            ? "Internal Server Error"
            : error.message;
        console.error({ message: error.message, stack: error.stack, error });
        return res.status(500).json({
            message,
        });
    }
});
const port = process.env.PORT;
(0, db_connection_1.default)();
app.listen(port, () => {
    console.log(`App listening on port`);
});
