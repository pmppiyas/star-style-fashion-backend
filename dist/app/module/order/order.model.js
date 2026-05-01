"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderItemSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    size: {
        type: String,
        trim: true,
    },
}, {
    _id: false,
});
const customerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    _id: false,
});
const orderSchema = new mongoose_1.Schema({
    customer: {
        type: customerSchema,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery'],
        default: 'cash_on_delivery',
    },
    items: {
        type: [orderItemSchema],
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 0,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING',
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
