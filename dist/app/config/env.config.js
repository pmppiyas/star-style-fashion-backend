"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const loadEnvVars = () => {
    const requiredEnvVars = [
        'PORT',
        'NODE_ENV',
        'FRONTEND_URL1',
        'DB_URL',
        'SALT_ROUND',
        'EXPRESS_SESSION_SECRET',
        'ACCESS_SECRET',
        'ACCESS_EXPIRED',
        'REFRESH_SECRET',
        'REFRESH_EXPIRED',
        'CLIENT_ID',
        'CLIENT_SECRET',
        'CALLBACK_URL',
        'CLOUD_NAME',
        'API_KEY',
        'API_SECRET',
    ];
    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        FRONTEND_URL1: process.env.FRONTEND_URL1,
        DB_URL: process.env.DB_URL,
        BCRYPT: {
            SALT_ROUND: process.env.SALT_ROUND,
        },
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        JWT: {
            ACCESS_SECRET: process.env.ACCESS_SECRET,
            ACCESS_EXPIRED: process.env.ACCESS_EXPIRED,
            REFRESH_SECRET: process.env.REFRESH_SECRET,
            REFRESH_EXPIRED: process.env.REFRESH_EXPIRED,
        },
        GOOGLE: {
            CLIENT_ID: process.env.CLIENT_ID,
            CLIENT_SECRET: process.env.CLIENT_SECRET,
            CALLBACK_URL: process.env.CALLBACK_URL,
        },
        CLOUDINARY: {
            CLOUD_NAME: process.env.CLOUD_NAME,
            API_KEY: process.env.API_KEY,
            API_SECRET: process.env.API_SECRET,
        },
    };
};
const env = loadEnvVars();
exports.default = env;
