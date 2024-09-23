"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.AppError = AppError;
const CatchError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};
exports.CatchError = CatchError;
