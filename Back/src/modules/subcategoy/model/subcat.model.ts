import mongoose from "mongoose";
import { ISubCategory } from "../../../interfaces/dbinterfaces";

const subcatSchema = new mongoose.Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500,
      minlength: 10,
      lowercase: true,
    },
    image: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    modifed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Subcategory = mongoose.model<ISubCategory>("Subcategory", subcatSchema);
export default Subcategory;
