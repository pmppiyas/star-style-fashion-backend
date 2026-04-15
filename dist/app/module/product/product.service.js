"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const appError_1 = require("@app/error/appError");
const product_model_1 = require("@app/module/product/product.model");
const calculatePagination_1 = require("@app/utils/calculatePagination");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const addProduct = async (payload) => {
    const baseSlug = (0, slugify_1.default)(payload.name, {
        lower: true,
        strict: true,
    });
    const existingProducts = await product_model_1.Product.find({
        slug: { $regex: `^${baseSlug}` },
    }).select('slug');
    const serial = String(existingProducts.length + 1).padStart(3, '0');
    const slug = `${baseSlug}-${serial}`;
    if (payload.discountPrice && payload.discountPrice >= payload.price) {
        throw new Error('Discount price must be less than price');
    }
    const productData = {
        ...payload,
        slug,
        isFeatured: payload.isFeatured ?? false,
        status: payload.status ?? 'IN_STOCK',
    };
    const result = await product_model_1.Product.create(productData);
    return result;
};
const getAllProducts = async (filters, options) => {
    const { page, limit, skip, sortOrder, sortBy } = (0, calculatePagination_1.calculatePagination)(options);
    const { searchTerm, minPrice, maxPrice, categoryId, subCategoryId, ...rest } = filters;
    const andConditions = [];
    if (categoryId) {
        andConditions.push({
            categoryId: new mongoose_1.Types.ObjectId(categoryId),
        });
    }
    if (subCategoryId) {
        andConditions.push({
            subCategoryId: new mongoose_1.Types.ObjectId(subCategoryId),
        });
    }
    if (searchTerm) {
        const cleanSearch = searchTerm.trim();
        andConditions.push({
            $or: [
                { name: { $regex: new RegExp(cleanSearch, 'i') } },
                { brand: { $regex: new RegExp(cleanSearch, 'i') } },
                { description: { $regex: new RegExp(cleanSearch, 'i') } },
            ],
        });
    }
    if (minPrice || maxPrice) {
        andConditions.push({
            price: {
                ...(minPrice && { $gte: Number(minPrice) }),
                ...(maxPrice && { $lte: Number(maxPrice) }),
            },
        });
    }
    const whereCondition = andConditions.length ? { $and: andConditions } : {};
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    const result = await product_model_1.Product.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = await product_model_1.Product.countDocuments(whereCondition);
    return {
        meta: { page, limit, total },
        products: result,
    };
};
const updateProduct = async (productId, payload) => {
    const isExistProduct = await product_model_1.Product.findById(productId);
    if (!isExistProduct) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Targeted product not found');
    }
    const existingImages = isExistProduct.images || [];
    if (payload.images && payload.images.length > 0) {
        payload.images = [...existingImages, ...payload.images];
    }
    if (!isExistProduct.thumbnail) {
        payload.thumbnail = payload?.images?.[0];
    }
    if (payload.categoryId) {
        payload.categoryId = new mongoose_1.Types.ObjectId(payload.categoryId);
    }
    if (payload.subCategoryId) {
        payload.subCategoryId = new mongoose_1.Types.ObjectId(payload.subCategoryId);
    }
    if (payload.price &&
        payload.discountPrice &&
        payload.discountPrice >= payload.price) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Discount price must be less than regular price');
    }
    const updatedProduct = await product_model_1.Product.findByIdAndUpdate(productId, payload, {
        returnDocument: 'after',
        runValidators: true,
    });
    return updatedProduct;
};
const deleteProduct = async (productId) => {
    const isExistProduct = await product_model_1.Product.findById(productId);
    if (!isExistProduct) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Targeted product not found');
    }
    await product_model_1.Product.findByIdAndUpdate(productId);
    return null;
};
exports.ProductService = {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
