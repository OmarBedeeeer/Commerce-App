import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;
export const CatchError = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
};
