import { Document, Types } from "mongoose";
export interface ICategory extends Document {
  name: string;
  description: string;
  image: string;
  deleted?: boolean;
  deletedAt?: Date | null;
  createdBy: IUser;
}

export interface ISubCategory extends ICategory, Document {
  category: Types.ObjectId | ICategory;
  created_by: Types.ObjectId | IUser;
  modifed_by: Types.ObjectId | IUser;
}

export interface IProduct extends ICategory {
  Subcategory: Types.ObjectId | ISubCategory;
  created_by: Types.ObjectId | IUser;
  modifed_by: Types.ObjectId | IUser;
  quantity: number;
  price: number;
  sold: number;
}

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  address: string;
  role?: string;
  age?: number;
  deleted?: boolean;
  deletedAt?: Date | null;
}
