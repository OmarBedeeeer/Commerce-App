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
const admin_user_router_1 = __importDefault(require("./modules/user/admin/admin.user.router"));
const errorhandler_1 = require("./utils/errorhandler");
const app = (0, express_1.default)();
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
app.use(express_1.default.json());
app.use(express_1.default.static("upload"));
app.use("/api/v1/user", user_router_1.default);
app.use("/api/v1/founder", admin_user_router_1.default);
app.use("/api/v1/category", category_router_1.default);
app.use("/api/v1/category", subcat_router_1.default);
app.use("/api/v1/product", product_router_1.default);
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
