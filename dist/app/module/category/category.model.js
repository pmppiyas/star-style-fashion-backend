"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Types.ObjectId,
        default: () => new mongoose_1.Types.ObjectId(),
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    parentId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Category',
    },
}, {
    versionKey: false,
});
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
