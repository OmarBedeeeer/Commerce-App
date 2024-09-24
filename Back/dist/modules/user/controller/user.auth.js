"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorized = exports.authentecation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorhandler_1 = require("../../../utils/errorhandler");
const authentecation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.header("token");
        if (!token)
            throw new errorhandler_1.AppError("UnAuthorized", 401);
        if (!token.startsWith("Bearer "))
            throw new errorhandler_1.AppError("Invalid token", 401);
        let splitedToken = token.split("Bearer ");
        const payload = jsonwebtoken_1.default.verify(splitedToken[1], process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).send("invaled token");
        console.log(error);
    }
});
exports.authentecation = authentecation;
const authorized = (role) => {
    return (req, res, next) => {
        const { role: userRole } = req.user;
        if (role !== userRole)
            throw new errorhandler_1.AppError("Forbidden", 403);
        next();
    };
};
exports.authorized = authorized;
