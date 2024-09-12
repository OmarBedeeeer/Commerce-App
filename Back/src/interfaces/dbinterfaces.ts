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
  _id: Types.ObjectId;
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
  wishList?: Types.ObjectId[] | IProduct[];
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

export interface ICoupon extends Document {
  coupon: string;
  discountType: "%" | "cost";
  discountValue: number;
  minCartValue: number;
  maxDiscountValue?: number;
  expiryDate: Date;
  isActive: boolean;
  usedCount: number;
  deleted?: boolean;
  deletedAt?: Date | null;
  applyCoupon: (cartTotal: number) => number;
}
export interface IOrder extends Document {
  user: Types.ObjectId | IUser;
  products: Types.ObjectId[] | IProduct[];
  total: number;
  status: "pending" | "completed";
  address: string;
  orderDate: Date;
}
