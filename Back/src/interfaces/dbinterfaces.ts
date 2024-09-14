import mongoose, { Document, Model, Types } from "mongoose";
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
  averageRating?: number;
  totalRatings?: number;
  sold?: number;
  reviews?: Types.ObjectId[] | IReview[];
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  address: UserAddress[];
  role?: string;
  age?: number;
  isVerified?: boolean;
  wishList?: Types.ObjectId[] | IProduct[];
  deleted?: boolean;
  deletedAt?: Date | null;
}
type UserAddress = {
  street: string;
  city: string;
  state: string;
  zip: number;
};
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

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface ReviewModel extends Model<IReview> {
  calculateAverageRating(productId: mongoose.Types.ObjectId): Promise<void>;
}
