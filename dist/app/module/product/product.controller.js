"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_constant_1 = require("@app/constant/product.constant");
const product_service_1 = require("@app/module/product/product.service");
const catchAsync_1 = __importDefault(require("@app/utils/catchAsync"));
const queryPick_1 = __importDefault(require("@app/utils/queryPick"));
const sendResponse_1 = __importDefault(require("@app/utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const addProduct = (0, catchAsync_1.default)(async (req, res, next) => {
    const files = req.files;
    const imageUrls = files.map((file) => file.path);
    const payload = {
        ...req.body,
        images: imageUrls,
        thumbnail: imageUrls[0],
    };
    const result = await product_service_1.ProductService.addProduct(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Product added successfully!',
        data: result,
    });
});
const getAllProducts = (0, catchAsync_1.default)(async (req, res, next) => {
    const filters = (0, queryPick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, queryPick_1.default)(req.query, product_constant_1.productOptionFields);
    const result = await product_service_1.ProductService.getAllProducts(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Product added successfully!',
        data: result,
    });
});
const updateProduct = (0, catchAsync_1.default)(async (req, res, next) => {
    const files = req.files;
    const imageUrls = files.map((file) => file.path);
    const payload = {
        ...req.body,
        images: imageUrls,
    };
    const result = await product_service_1.ProductService.updateProduct(req.params.id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Product updated successfully!',
        data: result,
    });
});
const deleteProduct = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await product_service_1.ProductService.deleteProduct(req?.params?.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Product updated successfully!',
        data: result,
    });
});
exports.ProductController = {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
