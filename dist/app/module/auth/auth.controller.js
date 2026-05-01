"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const appError_1 = require("../../error/appError");
const auth_services_1 = require("../../module/auth/auth.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const clearCookie_1 = require("../../utils/clearCookie");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
const userTokem_1 = require("../../utils/userTokem");
const http_status_codes_1 = require("http-status-codes");
const passport_1 = __importDefault(require("passport"));
const credentialLogin = (0, catchAsync_1.default)(async (req, res, next) => {
    passport_1.default.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(new appError_1.AppError(http_status_codes_1.StatusCodes.METHOD_NOT_ALLOWED, info.message));
        }
        if (!user) {
            return next(new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, info.message));
        }
        const token = (0, userTokem_1.createUserToken)(user);
        (0, setCookie_1.setAuthCookie)(res, token);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'User login successfully',
            data: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            },
        });
    })(req, res, next);
});
const logout = (0, catchAsync_1.default)(async (req, res, next) => {
    (0, clearCookie_1.clearAuthCookies)(res);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Logout successfully',
        data: null,
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res, next) => {
    const me = await auth_services_1.AuthServices.getMe(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'My data retreived successfully',
        data: me,
    });
});
exports.AuthController = {
    credentialLogin,
    logout,
    getMe,
};
