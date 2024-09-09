import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../utils/errorhandler";
import { Response, Request, NextFunction } from "express";
import { BlobOptions } from "buffer";

interface DecodedToken {
  id: string;
  email: string;
  expiresIn: number;
  role: string;
  username: string;
  phoneNumber: string;
  address: string;
  isVerified: Boolean;
}

export const authentecation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined = req.header("token");

    if (!token) throw new AppError("UnAuthorized", 401);
    // TODO: Refreshtoken
    if (!token.startsWith("Bearer ")) throw new AppError("Invalid token", 401);
    let splitedToken: string[] = token.split("Bearer ");
    const payload = jwt.verify(
      splitedToken[1] as string,
      process.env.JWT_SECRET as string
    );
    req.user = payload as Payload;
    next();
  } catch (error) {
    res.status(401).send("invaled token");
    console.log(error);
  }
};

export const authorized = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role: userRole } = req.user as Payload;
    if (role !== userRole) throw new AppError("Forbidden", 403);
    next();
  };
};
