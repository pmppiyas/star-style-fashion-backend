"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const checkAuth_1 = require("../../middleware/checkAuth");
const auth_controller_1 = require("../../module/auth/auth.controller");
const user_interface_1 = require("../../module/user/user.interface");
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post('/signin', auth_controller_1.AuthController.credentialLogin);
router.post('/logout', auth_controller_1.AuthController.logout);
router.get('/google', async (req, res, next) => {
    const redirect = req.query.redirect || '/';
    passport_1.default.authenticate('google', {
        scope: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/user.phonenumbers.read',
        ],
        prompt: 'consent',
        state: redirect,
    })(req, res, next);
});
router.get('/me', (0, checkAuth_1.checkAuth)(...Object.keys(user_interface_1.Role)), auth_controller_1.AuthController.getMe);
exports.AuthRoutes = router;
