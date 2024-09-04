import User from "../model/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import cartModel from "../../cart/model/cart.model";
import { AppError, CatchError } from "../../../utils/errorhandler";
import {
  UserRequestBody,
  userChangePasswordBody,
  userParams,
  userLogin,
} from "../../../interfaces/Queryinterfaces";
import { IUser } from "../../../interfaces/dbinterfaces";

export const userAuthController = {
  sginUp: CatchError(
    async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
      const { email, password, phoneNumber, age, address, username } = req.body;

      if (req.body.role === "admin") throw new AppError("Forbidden", 403);

      const user: IUser | null = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });

      if (user) throw new AppError("User or Phone number already exists.", 400);

      const hashedPassword: string = await bcrypt.hash(
        password,
        Number(process.env.SECRET_ROUNDS)
      );
      console.log(hashedPassword);
      const newUser: IUser = await User.create({
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        age,
        address,
      });

      if (!newUser) throw new AppError("Something went wrong", 400);

      // const newCart = await cartModel.create({
      //   user: newUser._id,
      //   products: [],
      //   total: 0,
      // });

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
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password or Username",
      });
    }

    // const cart = await cartModel.findOne({
    //   user: user?._id,
    //   deleted: false,
    // });

    // if (!cart) {
    //   await cartModel.create({
    //     user: user?._id,
    //     products: [],
    //   });
    // }

    const token: string = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
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
      const { oldPassword, newPassword } = req.body;

      const { id } = req.params;

      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 400);

      if (user.id != req.user.id) throw new AppError("Unauthorized", 401);

      const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

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
  updateUser: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { id } = req.params;

      if (!req.user) {
        throw new AppError("Please Login first!", 400);
      }

      const { username, phoneNumber, age, address } = req.body;

      if (!req.body)
        throw new AppError("Please provide at least one field", 400);

      if (req.body.role === "admin") throw new AppError("Forbidden", 403);

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 404);

      if (user.id != req.user.id) throw new AppError("Unauthorized", 401);

      const updateUserProfile: IUser | null = await User.findByIdAndUpdate(
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
        message: "User updated successfully",
        updateUserProfile,
      });
    }
  ),
  softDeleteUser: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { id } = req.params;

      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 404);

      if (user.id != req.user.id) throw new AppError("Unauthorized", 401);

      const deleteUser: IUser | null = await User.findByIdAndUpdate(
        id,
        {
          deleted: true,
          deletedAt: new Date(),
        },
        {
          new: true,
        }
      );

      // const cart = await cartModel.findOneAndUpdate(
      //   {
      //     user: id,
      //   },
      //   {
      //     deleted: true,
      //     deletedAt: new Date(),
      //   }
      // );

      return res.status(200).json({
        message: "User deleted successfully",
        deleteUser,
      });
    }
  ),
  deleteUser: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { id } = req.params;

      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      const user: IUser | null = await User.findById(id, {
        deleted: false,
      });

      if (!user) throw new AppError("User not found", 404);

      if (user.id != req.user.id) throw new AppError("Unauthorized", 401);

      const deleteUser: IUser | null = await User.findByIdAndDelete(id);

      // const cart = await cartModel.findOneAndUpdate(
      //   {
      //     user: id,
      //   },
      //   {
      //     deleted: true,
      //     deletedAt: new Date(),
      //   }
      // );

      return res.status(200).json({
        message: "User deleted successfully",
        deleteUser,
      });
    }
  ),
};
