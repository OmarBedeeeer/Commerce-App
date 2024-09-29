"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadImgMiddleware = exports.getUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const errorhandler_1 = require("../utils/errorhandler");
const getUploadMiddleware = (fieldName, maxCount) => {
    const multerStorage = multer_1.default.diskStorage({
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
    const uploadMiddleware = upload.array(fieldName, maxCount);
    return uploadMiddleware;
};
exports.getUploadMiddleware = getUploadMiddleware;
const getUploadImgMiddleware = (fieldName) => {
    const multerStorage = multer_1.default.diskStorage({
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
exports.getUploadImgMiddleware = getUploadImgMiddleware;
