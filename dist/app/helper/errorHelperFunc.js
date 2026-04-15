"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodValidationError = exports.errorSources = void 0;
const http_status_codes_1 = require("http-status-codes");
exports.errorSources = [];
let errMode = [];
let missing = [];
const resetState = () => {
    exports.errorSources = [];
    errMode = [];
    missing = [];
};
const handleZodValidationError = (err) => {
    resetState();
    const issues = err.issues || [];
    if (issues.length === 0) {
        return {
            message: err.message || 'Zod validation failed',
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        };
    }
    issues.forEach((issue) => {
        const path = issue.path[issue.path.length - 1];
        exports.errorSources.push({
            path: String(path),
            message: issue.message,
        });
        if (path) {
            missing.push(String(path));
        }
        errMode.push(issue);
    });
    const capitalizedFields = missing
        .map((item) => item ? item.charAt(0).toUpperCase() + item.slice(1) : 'Field')
        .join(', ');
    const prefix = errMode[0]?.received === 'undefined' || errMode[0]?.code === 'invalid_type'
        ? 'Missing'
        : 'Wrong';
    return {
        message: `${capitalizedFields} is ${prefix}`,
        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
    };
};
exports.handleZodValidationError = handleZodValidationError;
