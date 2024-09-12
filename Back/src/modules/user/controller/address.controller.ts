import User from "../model/user.model";
import { IUser } from "../../../interfaces/dbinterfaces";
import { Request, Response } from "express";
import { CatchError, AppError } from "../../../utils/errorhandler";
import { ParamsIds } from "../../../interfaces/Queryinterfaces";
import { ParamSchema } from "express-validator";

export const addressController = {
  addAddress: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const { address } = req.body;
    const user: IUser | null = await User.findById(req.user!.id);

    if (!user) throw new AppError("User not found", 404);

    const updateUser: IUser | null = await User.findByIdAndUpdate(
      req.user!.id,
      {
        address,
      },
      {
        new: true,
      }
    );
    if (!updateUser) throw new AppError("User not found", 404);
    return res.status(200).json({
      message: "Address added successfully",
      updateUser,
    });
  }),

  getAddresses: CatchError(async (req: Request, res: Response) => {
    const user: IUser | null = await User.findById(req.user!.id);

    if (!user) throw new AppError("User not found", 404);

    return res.status(200).json({
      message: "Addresses loaded successfully",
      addresses: user.address,
    });
  }),

  deleteAddress: CatchError(async (req: Request<ParamsIds>, res: Response) => {
    const { addressId } = req.params;
    const user: IUser | null = await User.findById(req.user!.id);

    if (!user) throw new AppError("User not found", 404);

    const updateUserAddress = await User.findByIdAndUpdate(
      addressId,
      {
        $pull: {
          address: {
            _id: addressId,
          },
        },
      },
      {
        new: true,
      }
    );
    if (!updateUserAddress) throw new AppError("User not found", 404);
    return res.status(200).json({
      message: "Address deleted successfully",
    });
  }),
};
