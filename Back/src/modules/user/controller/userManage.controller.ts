import User from "../model/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AppError, CatchError } from "../../../utils/errorhandler";
import {
  UserRequestBody,
  userChangePasswordBody,
  userParams,
  userLogin,
} from "../../../interfaces/Queryinterfaces";
import { ICart, IUser } from "../../../interfaces/dbinterfaces";
import sendmail from "../../../utils/nodemailer";
import Cart from "../../cart/cart.model";

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

      const token: string = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "10min",
      });

      const newUser: IUser = await User.create({
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        age,
        address,
      });

      if (!newUser) throw new AppError("Something went wrong", 400);

      const createLink = `${process.env.BACKEND_URL}/users/verify/${token}`;

      const newCart: ICart = await Cart.create({
        user: newUser._id,
        products: [],
        total: 0,
      });

      const message = await sendmail({
        to: email,
        subject: "Verify your account",
        text: `Please copy the link to Your URL incase it is not Clickble :
         ${createLink}`,
      });

      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  ),

  verfyEmail: CatchError(async (req, res) => {
    const { token } = req.params;

    const { email } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await User.findOne(email);

    if (!user) throw new AppError("User not found", 404);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (updatedUser) return res.status(200).json({ message: "Email verified" });

    throw new AppError("Something went wrong", 500);
  }),

  forgetPassword: CatchError(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne(email);

    if (!user) throw new AppError("User not found", 404);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10min",
    });
    const forgetPasswordLink = `${process.env.BACKEND_URL}/users/reset/${token}`;
    const sendmailer = await sendmail({
      to: email,
      subject: "Reset your password",
      text: `Please copy the link to Your URL incase it is not Clickble :
       ${forgetPasswordLink}`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  }),

  resetPassword: CatchError(async (req, res) => {
    const { token } = req.params;

    const { email } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const { newPassword } = req.body;

    const user = await User.findOne(email);

    if (!user) throw new AppError("User not found", 404);

    const hashedPassword = await bcrypt.hash(
      newPassword,
      process.env.SECRET_ROUNDS
    );

    const updatePassword = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "Password reset successfully" });
  }),
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

    const token: string = jwt.sign(
      {
        id: user._id,
        role: user.role,
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

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 400);

      if (user.id != req.user?.id) throw new AppError("Unauthorized", 401);

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

      const user: IUser | null = await User.findById(id);

      if (!user) throw new AppError("User not found", 404);

      if (user.id != req.user?.id) throw new AppError("Unauthorized", 401);

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
        deleteUser,
      });
    }
  ),
  deleteUser: CatchError(
    async (req: Request<userParams, {}, UserRequestBody>, res: Response) => {
      const { id } = req.params;

      const user: IUser | null = await User.findById(id, {
        deleted: false,
      });

      if (!user) throw new AppError("User not found", 404);

      if (user.id != req.user?.id) throw new AppError("Unauthorized", 401);

      const deleteUser: IUser | null = await User.findByIdAndDelete(id);

      const cart: ICart | null = await Cart.findOneAndDelete({
        user: id,
      });

      return res.status(200).json({
        message: "User deleted successfully",
      });
    }
  ),
};
