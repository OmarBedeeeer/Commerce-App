export class AppError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const CatchError = (fn: any) => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
};
