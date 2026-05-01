"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrHandler = void 0;
const env_config_1 = __importDefault(require("../config/env.config"));
const appError_1 = require("../error/appError");
const errorHelperFunc_1 = require("../helper/errorHelperFunc");
const http_status_codes_1 = require("http-status-codes");
const globalErrHandler = (err, req, res, nest) => {
    let statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    let message = `Something went wrong${err.message}`;
    if (err instanceof appError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    }
    if (err.name === 'ZodError') {
        message = (0, errorHelperFunc_1.handleZodValidationError)(err).message;
        statusCode = http_status_codes_1.StatusCodes.NOT_ACCEPTABLE;
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        err,
        stack: env_config_1.default.NODE_ENV === 'development' ? err.stack : '',
    });
};
exports.globalErrHandler = globalErrHandler;
