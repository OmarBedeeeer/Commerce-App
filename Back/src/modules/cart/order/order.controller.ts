import Order from "./order.model";
import { CatchError, AppError } from "../../../utils/errorhandler";
import User from "../../user/model/user.model";
import { Request, Response } from "express";
import { IOrder, IUser } from "../../../interfaces/dbinterfaces";
import { ParamsIds } from "../../../interfaces/Queryinterfaces";

export const orderController = {
  getUserOrders: CatchError(async (req: Request, res: Response) => {
    //TODO: I can't remember what i did here XD, need to check it back.
    const user: IUser | null = await User.findById({ _id: req.user?.id });

    let orders: IOrder[] | null;

    if (user!.role === "admin") {
      orders = await Order.find().populate("user", "name email");
    } else {
      orders = await Order.find({ user: user!._id })
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
  }),

  updateOrder: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const updateOrder: IOrder | null = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updateOrder) throw new AppError("Order not found", 404);

    res.status(200).json({ updateOrder });
  }),

  deleteOrder: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const { orderId } = req.params;
    const user: IUser | null = await User.findById({ _id: req.user?.id });

    let orders: IOrder[] | null;

    if (user!.role === "admin") {
      orders = await Order.findOneAndDelete({ _id: orderId });
    } else {
      orders = await Order.findOneAndDelete({ user: user!._id });
    }

    if (!orders) throw new AppError("Order not found", 404);

    res.status(200).json({ success: true, orders });
  }),
};
