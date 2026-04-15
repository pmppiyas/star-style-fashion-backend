"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_services_1 = require("@app/module/category/category.services");
const catchAsync_1 = __importDefault(require("@app/utils/catchAsync"));
const sendResponse_1 = __importDefault(require("@app/utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createCategory = (0, catchAsync_1.default)(async (req, res, next) => {
    const category = await category_services_1.CategoryService.addCategory(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Category created successfully!',
        data: category,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res, next) => {
    const categories = await category_services_1.CategoryService.getAllCategories();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Categories retrieved successfully!',
        data: categories,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await category_services_1.CategoryService.updateCategory(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category updated successfully!',
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res, next) => {
    const categoryId = req.params.id;
    const result = await category_services_1.CategoryService.deleteCategory(categoryId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Category deleted successfully!',
        data: result,
    });
});
exports.CategoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
