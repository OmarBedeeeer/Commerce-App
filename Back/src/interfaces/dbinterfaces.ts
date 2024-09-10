import { Document, Types } from "mongoose";
export interface ICategory extends Document {
  name: string;
  description: string;
  image: Types.ObjectId | IImage;
  slug: string;
  deleted?: boolean;
  deletedAt?: Date | null;
  createdBy: IUser;
}

export interface IImage extends Document {
  name: string;
  path: string;
}

export interface ISubCategory extends ICategory {
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
  price_offer?: number;
  ratingCount?: number;
  ratingAverage?: number;
  sold?: number;
}

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  address: string;
  role?: string;
  age?: number;
  isVerified?: boolean;
  deleted?: boolean;
  deletedAt?: Date | null;
}
export interface ICart extends Document {
  user: Types.ObjectId | IUser;
  products?: {
    product: Types.ObjectId | IProduct;
    quantity?: number;
  }[];
  total?: number;
  deleted?: boolean;
  deletedAt?: Date | null;
}
