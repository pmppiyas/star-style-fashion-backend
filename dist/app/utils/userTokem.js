"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const env_config_1 = __importDefault(require(".././config/env.config"));
const jwt_1 = require(".././utils/jwt");
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        identifier: user.email || user.number,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.default.JWT.ACCESS_SECRET, env_config_1.default.JWT.ACCESS_EXPIRED);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.default.JWT.REFRESH_SECRET, env_config_1.default.JWT.REFRESH_EXPIRED);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserToken = createUserToken;
