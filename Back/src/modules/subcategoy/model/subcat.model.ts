import mongoose from "mongoose";
import { ISubCategory } from "../../../interfaces/dbinterfaces";

const subcatSchema = new mongoose.Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
