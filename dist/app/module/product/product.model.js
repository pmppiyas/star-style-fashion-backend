"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        index: true,
    },
    thumbnail: {
        type: String,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    summary: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    discountPrice: {
        type: Number,
        validate: {
            validator: function (value) {
                if (!value)
                    return true;
                return value < this.price;
            },
            message: 'Discount price should be lower than regular price',
        },
    },
    costPrice: {
        type: Number,
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    subCategoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    brand: {
        type: String,
        default: 'Star Style',
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: 0,
    },
    status: {
        type: String,
        enum: ['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED', 'UPCOMING'],
        default: 'IN_STOCK',
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required'],
    },
    colors: [String],
    sizes: [String],
    material: {
        type: String,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isTodayDeal: {
        type: Boolean,
        default: false,
    },
    ratings: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
    versionKey: false,
});
ProductSchema.index({ name: 'text', description: 'text' });
exports.Product = (0, mongoose_1.model)('Product', ProductSchema);
