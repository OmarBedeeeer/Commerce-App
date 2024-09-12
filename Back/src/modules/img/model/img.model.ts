import mongoose from "mongoose";
import { IImage } from "../../../interfaces/dbinterfaces";

const imgSchema = new mongoose.Schema<IImage>({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

imgSchema.post(/find/, (docs, next) => {
  docs.forEach(
    (doc: IImage) => (doc.path = process.env.BACKEND_URL + doc.path)
  );

  next();
});

const Image = mongoose.model<IImage>("Image", imgSchema);

export default Image;
