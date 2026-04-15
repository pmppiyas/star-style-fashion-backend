"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = exports.signup = void 0;
const appError_1 = require("@app/error/appError");
const user_model_1 = require("@app/module/user/user.model");
const hashingPassword_1 = require("@app/utils/hashingPassword");
const http_status_codes_1 = require("http-status-codes");
const signup = async (payload) => {
    const { password, number, ...rest } = payload;
    let hashPassword = '';
    const isExist = await user_model_1.User.findOne({
        number,
    });
    if (isExist) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, 'Account already exist by this number.');
    }
    if (password) {
        hashPassword = await (0, hashingPassword_1.hashingPassword)(password);
    }
    const user = await user_model_1.User.create({
        password: hashPassword,
        number,
        ...rest,
    });
    const userObj = user.toObject();
    const { password: pass, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};
exports.signup = signup;
exports.UserServices = {
    signup: exports.signup,
};
