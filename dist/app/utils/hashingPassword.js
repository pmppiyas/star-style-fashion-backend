"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashingPassword = void 0;
const env_config_1 = __importDefault(require(".././config/env.config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashingPassword = async (password) => {
    const saltRound = Number(env_config_1.default.BCRYPT.SALT_ROUND);
    return await bcryptjs_1.default.hash(password, saltRound);
};
exports.hashingPassword = hashingPassword;
