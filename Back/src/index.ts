import express, { Application, Request, Response, NextFunction } from "express";
import connectToMongoDb from "./db/db.connection";
import dotenv from "dotenv";
import categoryRouter from "./modules/category/router/category.router";
import subcategoryRouter from "./modules/subcategoy/router/subcat.router";
import productRouter from "./modules/product/router/product.router";
import userRouter from "./modules/user/router/user.router";
import addressRouter from "./modules/user/router/address.router";
import adminRouter from "./modules/user/admin/admin.user.router";
import cartRouter from "./modules/product/router/prodOnCart.router";
import couponRouter from "./modules/cart/coupon/coupon.router";
import orderRouter from "./modules/cart/order/order.router";
import wishListRouter from "./modules/product/router/prodOnWishList.router";

import { AppError } from "./utils/errorhandler";
const app: Application = express();
dotenv.config();

app.use(express.json());
app.use(express.static("upload"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", addressRouter);
app.use("/api/v1/founder", adminRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/category", subcategoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/wishlist", wishListRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Can't find this Page");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  } else {
    const message =
      process.env.ENV === "Production"
        ? "Internal Server Error"
        : error.message;

    console.error({ message: error.message, stack: error.stack, error });
    return res.status(500).json({
      message,
    });
  }
});

const port = process.env.PORT;

connectToMongoDb();

app.listen(port, () => {
  console.log(`App listening on port`);
});
