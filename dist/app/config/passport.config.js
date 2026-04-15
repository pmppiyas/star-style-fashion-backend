"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("@app/module/user/user.model");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_config_1 = __importDefault(require("@app/config/env.config"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'identifier',
    passwordField: 'password',
}, async (identifier, password, done) => {
    try {
        const isUserExist = await user_model_1.User.findOne({
            $or: [{ email: identifier }, { number: identifier }],
        });
        if (!isUserExist) {
            return done(null, false, {
                message: 'User not found.',
            });
        }
        if (isUserExist && !isUserExist.password) {
            return done(null, false, {
                message: 'You are joined by Google. First login by google and then set a password.',
            });
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(password, isUserExist.password || '');
        if (!isPasswordMatch) {
            return done(null, false, { message: 'Password is wrong.' });
        }
        return done(null, isUserExist, { message: 'Login successfull.' });
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_config_1.default.GOOGLE.CLIENT_ID,
    clientSecret: env_config_1.default.GOOGLE.CLIENT_SECRET,
    callbackURL: env_config_1.default.GOOGLE.CALLBACK_URL,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const profilePhoto = profile.photos?.[0]?.value;
        if (!email) {
            return done(null, false, {
                message: 'No email found from Google account',
            });
        }
        let isExistUser = await user_model_1.User.findOne({ email });
        if (isExistUser) {
            return done(null, isExistUser);
        }
        const newUser = await user_model_1.User.create({
            name: name,
            email: email,
            profileImage: profilePhoto,
            status: 'ACTIVE',
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
