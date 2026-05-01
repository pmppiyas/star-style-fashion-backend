"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_services_1 = require("../../module/order/order.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await order_services_1.OrderService.createOrder({ payload: req.body });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Order created successfully',
        data: result,
    });
});
const getOrders = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await order_services_1.OrderService.getOrders({
        status: req.query?.status,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Orders retrieved successfully',
        data: result,
    });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await order_services_1.OrderService.updateOrderStatus({
        orderId: req.params.id,
        status: req.body.status,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Order status updated successfully',
        data: result,
    });
});
exports.OrderController = {
    createOrder,
    getOrders,
    updateOrderStatus,
};
