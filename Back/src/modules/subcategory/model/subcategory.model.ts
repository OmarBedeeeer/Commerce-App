import mongoose from "mongoose";
import { ISubCategory } from "../../../interfaces/interfaces";
const subCategorySchema: mongoose.Schema = new mongoose.Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date, default: null },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true,
  }
);

const subCategory = mongoose.model<ISubCategory>(
  "SubCategory",
  subCategorySchema
);
export default subCategory;
