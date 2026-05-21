"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const order_model_1 = require("./order.model");
const product_model_1 = require("../../module/product/product.model");
const appError_1 = require("../../error/appError");
const http_status_codes_1 = require("http-status-codes");
const customer_model_1 = require("../customer/customer.model");
const createOrder = async ({ payload }) => {
    const { items, customer, paymentMethod, shippingFee } = payload;
    if (!items.length) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No items provided');
    }
    let subtotal = 0;
    const verifiedItems = [];
    for (const item of items) {
        const product = await product_model_1.Product.findOne({
            slug: item.slug,
        });
        if (!product) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, `Product not found: ${item.slug}`);
        }
        if (product.stock < item.quantity) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, `${product.name} has insufficient stock`);
        }
        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;
        verifiedItems.push({
            slug: item.slug,
            quantity: item.quantity,
            size: item.size,
        });
        product.stock -= item.quantity;
        product.solded += item.quantity;
        await product.save();
    }
    const grandTotal = subtotal + shippingFee;
    let existingCustomer = await customer_model_1.Customer.findOne({
        phone: customer.phone,
    });
    if (!existingCustomer) {
        existingCustomer = await customer_model_1.Customer.create({
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            totalOrders: 0,
            totalSpent: 0,
            orders: [],
        });
    }
    const order = await order_model_1.Order.create({
        customer,
        customerId: existingCustomer._id,
        paymentMethod,
        items: verifiedItems,
        subtotal,
        shippingFee,
        grandTotal,
        status: 'PENDING',
    });
    existingCustomer.orders.push(order._id);
    existingCustomer.totalOrders += 1;
    existingCustomer.totalSpent += grandTotal;
    existingCustomer.averageOrderValue =
        existingCustomer.totalSpent / existingCustomer.totalOrders;
    existingCustomer.lastOrderAt = new Date();
    await existingCustomer.save();
    return order;
};
const getOrders = async ({ status }) => {
    const query = {};
    if (status) {
        query.status = status.toLocaleUpperCase();
    }
    const orders = await order_model_1.Order.find(query).sort({ createdAt: -1 });
    return orders;
};
const updateOrderStatus = async ({ orderId, status, }) => {
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
    }
    else {
        order.status = status.toLocaleUpperCase();
        await order.save();
        return order;
    }
};
exports.OrderService = {
    createOrder,
    getOrders,
    updateOrderStatus,
};
