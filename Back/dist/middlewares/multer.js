"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const errorhandler_1 = require("../utils/errorhandler");
const getUploadMiddleware = (fieldName) => {
    const multerStorage = multer_1.default.diskStorage({
        destination: (req, filee, cb) => {
            cb(null, "upload/");
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split("/")[1];
            cb(null, `image-${Date.now() - Math.floor(Math.random() * 100)}.${ext}`);
        },
    });
    function multerFilter(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        }
        else {
            cb(new errorhandler_1.AppError("Not an image", 400));
        }
    }
    const upload = (0, multer_1.default)({ storage: multerStorage, fileFilter: multerFilter });
    const uploadMiddleware = upload.single(fieldName);
    return uploadMiddleware;
};
exports.default = getUploadMiddleware;
