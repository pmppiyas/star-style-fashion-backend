"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const env_config_1 = __importDefault(require("../config/env.config"));
const appError_1 = require("../error/appError");
const user_model_1 = require("../module/user/user.model");
const jwt_1 = require("../utils/jwt");
const http_status_codes_1 = require("http-status-codes");
const checkAuth = (...roles) => {
    return async (req, res, next) => {
        try {
            const accessToken = req.cookies['access-token'] || req.headers.authorization?.split(' ')[1];
            if (!accessToken) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, 'No Token Received');
            }
            const decoded = (0, jwt_1.verifyToken)(accessToken, env_config_1.default.JWT.ACCESS_SECRET);
            if (!roles.includes(decoded.role)) {
                throw new appError_1.AppError(403, 'You are not permitted for this route');
            }
            const isUserExist = await user_model_1.User.findOne({
                $or: [{ email: decoded.identifier }, { number: decoded.identifier }],
            });
            if (!isUserExist) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User does not exist');
            }
            if (isUserExist.status === 'SUSPEND') {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is suspended');
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.checkAuth = checkAuth;
