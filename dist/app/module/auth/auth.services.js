"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const user_model_1 = require("../../module/user/user.model");
const getMe = async (payload) => {
    const user = await user_model_1.User.findById(payload.userId);
    return user;
};
exports.AuthServices = {
    getMe,
};
