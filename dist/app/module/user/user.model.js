"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const user_interface_1 = require("../../module/user/user.interface");
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        default: () => new mongoose_1.Types.ObjectId(),
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    number: {
        type: String,
    },
    location: {
        type: [String],
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.BUYER,
    },
    status: {
        type: String,
        enum: Object.values(user_interface_1.IStatus),
        default: () => user_interface_1.IStatus.ACTIVE,
    },
    profileImage: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
