import { Document } from "mongoose";
export interface ICategory extends Document {
  name: string;
  description: string;
  image: string;
  deleted: boolean;
  deletedAt: Date | null;
  //   createdBy: IUser;
}
export interface IUser {
  username: string;
  password: string;
  email: string;
  role: string;
  deleted: boolean;
  deletedAt: Date | null;
}
