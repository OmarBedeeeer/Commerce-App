import User from "../model/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError, CatchError } from "../../../utils/errorhandler";
import {
  UserRequestBody,
  userChangePasswordBody,
  userLogin,
  userParams,
} from "../../../interfaces/Queryinterfaces";
import { ICart, IUser } from "../../../interfaces/dbinterfaces";
import Cart from "../../cart/cat.model";

export const adminAuthController = {
  sginUp: CatchError(
    async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
      const { email, password, username, phoneNumber, age, address } = req.body;

      const user: IUser | null = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });

      if (user) throw new AppError("User or Phone number already exists.", 400);

      const hashedPassword: string = await bcrypt.hash(
        password,
        Number(process.env.SECRET_ROUNDS)
      );

      const newUser = await User.create({
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        age,
        role: "admin",
        address,
      });

      if (!newUser) throw new AppError("Something went wrong", 400);

      const newCart: ICart = await Cart.create({
        user: newUser._id,
        products: [],
        total: 0,
      });
      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  ),

  LogIn: CatchError(async (req: Request<{}, {}, userLogin>, res: Response) => {
    const { userName, password } = req.body;
    const user: IUser | null = await User.findOne({
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

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token: string = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  }),

  changePassword: CatchError(
    async (
      req: Request<userParams, {}, userChangePasswordBody>,
      res: Response
    ) => {
      const { id } = req.params;

      const { oldPassword, newPassword } = req.body;

      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 404);

      if (user.id != req.user.id) throw new AppError("Unauthorized", 401);

      const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) throw new AppError("Invalid password", 400);

      const hashedPassword: string = await bcrypt.hash(
        newPassword,
        Number(process.env.SECRET_ROUNDS)
      );

      user.password = hashedPassword;

      await user.save();

      return res.status(200).json({
        message: "Password changed successfully",
      });
    }
  ),
  updateAdmin: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { id } = req.params;

      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const { username, phoneNumber, age, address } = req.body;

      if (!req.body)
        throw new AppError("Please provide at least one field", 400);

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 404);

      if (user.id != req.user.id) throw new AppError("Unauthorized", 401);

      const updateUserProfile = await User.findByIdAndUpdate(
        id,
        {
          username,
          phoneNumber,
          age,
          address,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updateUserProfile,
      });
    }
  ),
  deleteAdmin: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { id } = req.params;

      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 404);

      const deleteUser = await User.findByIdAndDelete(id);

      const cart: ICart | null = await Cart.findOneAndUpdate(
        {
          user: id,
        },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );

      return res.status(200).json({
        message: "User deleted successfully",
      });
    }
  ),
  disableUser: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { userId } = req.params;
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(userId);

      if (!user) throw new AppError("User not found", 404);

      const cart: ICart | null = await Cart.findOneAndUpdate(
        {
          user: user.id,
        },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      const disableUser = await User.findByIdAndUpdate(
        userId,
        {
          deleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: "User disabled successfully",
        user: disableUser,
      });
    }
  ),
  enableUser: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { userId } = req.params;
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(userId);

      if (!user) throw new AppError("User not found", 404);

      const enableUser = await User.findByIdAndUpdate(
        userId,
        {
          deleted: false,
          deletedAt: null,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        message: "User enabled successfully",
        user: enableUser,
      });
    }
  ),
  getUser: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { userId } = req.params;
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(userId).populate("cart");

      if (!user) throw new AppError("User not found", 404);

      return res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    }
  ),
};
