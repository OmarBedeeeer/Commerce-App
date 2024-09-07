import mongoose from "mongoose";
import { ISubCategory } from "../../../interfaces/dbinterfaces";
import slugify from "slugify";

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
    slug: {
      type: String,
      trim: true,
      unique: true,
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

subcatSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Subcategory = mongoose.model<ISubCategory>("Subcategory", subcatSchema);
export default Subcategory;
