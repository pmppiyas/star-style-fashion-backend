"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = __importDefault(require("../src/app/config/env.config"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_status_codes_1 = require("http-status-codes");
const routes_1 = __importDefault(require("../src/app/routes"));
const globalErrHandler_1 = require("../src/app/middleware/globalErrHandler");
const notFound_1 = require("../src/app/middleware/notFound");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passport.config");
const app = (0, express_1.default)();
const allowedOrigin = [env_config_1.default.FRONTEND_URL1];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigin.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not alloed by CORS'));
        }
    },
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: env_config_1.default.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: env_config_1.default.NODE_ENV === 'production' ? true : false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.set('trust proxy', 1);
app.use('/api/v1', routes_1.default);
app.get('/', async (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send({
        success: true,
        message: 'Hello, Wellcome to Star Style',
    });
});
app.use(globalErrHandler_1.globalErrHandler);
app.use(notFound_1.notFound);
exports.default = app;
