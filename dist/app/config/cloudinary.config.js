"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const env_config_1 = __importDefault(require("./env.config"));
cloudinary_1.v2.config({
    cloud_name: env_config_1.default.CLOUDINARY.CLOUD_NAME,
    api_key: env_config_1.default.CLOUDINARY.API_KEY,
    api_secret: env_config_1.default.CLOUDINARY.API_SECRET,
});
