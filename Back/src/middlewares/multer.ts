import { Request } from "express";
import multer, { Multer } from "multer";
import { AppError } from "../utils/errorhandler";
import path from "path";

const getUploadMiddleware = (fieldName: string) => {
  const multerStorage = multer.diskStorage({
    destination: (req, filee, cb) => {
      cb(null, "upload/");
    },
    filename: (req: Request, file, cb) => {
      const ext: string = file.mimetype.split("/")[1];
      cb(null, `image-${Date.now() - Math.floor(Math.random() * 100)}.${ext}`);
    },
  });

  function multerFilter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image", 400));
    }
  }

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  const uploadMiddleware = upload.single(fieldName);
  return uploadMiddleware;
};

export default getUploadMiddleware;

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../storage"));
//   },
//   filename: (req: Request, file, cb) => {
//     const ext: string = file.mimetype.split("/")[1];
//     cb(null, `image-${Date.now() - Math.floor(Math.random() * 100)}.${ext}`);
//   },
// });

// function multerFilter(
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image", 400));
//   }
// }
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// export const uploadMiddleware = upload.single("img");
