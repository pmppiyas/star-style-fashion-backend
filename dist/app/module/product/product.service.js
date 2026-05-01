"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const appError_1 = require("@app/error/appError");
const category_model_1 = require("@app/module/category/category.model");
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
    const parsedColors = typeof payload.colors === 'string'
        ? payload.colors
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : Array.isArray(payload.colors)
            ? payload.colors
            : [];
    const parsedSizes = typeof payload.sizes === 'string'
        ? payload.sizes
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : Array.isArray(payload.sizes)
            ? payload.sizes
            : [];
    const productData = {
        ...payload,
        slug,
        colors: parsedColors,
        sizes: parsedSizes,
        isFeatured: payload.isFeatured ?? false,
        status: payload.status ?? 'IN_STOCK',
    };
    const result = await product_model_1.Product.create(productData);
    return result;
};
const getAllProducts = async (filters, options) => {
    const { page, limit, skip, sortOrder, sortBy } = (0, calculatePagination_1.calculatePagination)(options);
    const { searchTerm, minPrice, maxPrice, categoryId, subCategoryId, category, subcategory, } = filters;
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
    if (category) {
        const foundCategory = await category_model_1.Category.findOne({
            slug: category,
        });
        if (foundCategory) {
            andConditions.push({
                categoryId: foundCategory._id,
            });
            if (subcategory) {
                const foundSubCategory = await category_model_1.Category.findOne({
                    slug: subcategory,
                    parentId: foundCategory._id,
                });
                if (foundSubCategory) {
                    andConditions.push({
                        subCategoryId: foundSubCategory._id,
                    });
                }
            }
        }
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
        .limit(limit)
        .select('brand name slug price discountPrice ratings thumbnail');
    const total = await product_model_1.Product.countDocuments(whereCondition);
    return {
        meta: { page, limit, total },
        products: result,
    };
};
const updateProduct = async (slug, payload) => {
    const isExistProduct = await product_model_1.Product.findById(slug);
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
    const updatedProduct = await product_model_1.Product.findByIdAndUpdate(slug, payload, {
        returnDocument: 'after',
        runValidators: true,
    });
    return updatedProduct;
};
const deleteProduct = async (slug) => {
    const isExistProduct = await product_model_1.Product.findById(slug);
    if (!isExistProduct) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Targeted product not found');
    }
    await product_model_1.Product.findByIdAndUpdate(slug);
    return null;
};
const featuresProducts = async (type, options) => {
    const { limit, skip, sortOrder, sortBy } = (0, calculatePagination_1.calculatePagination)(options);
    let results = [];
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    switch (type) {
        case 'banner':
            results = await product_model_1.Product.find({ isFeatured: true })
                .sort(Object.keys(sortCondition).length ? sortCondition : { createdAt: -1 })
                .limit(limit || 5)
                .select('brand name slug price discountPrice ratings thumbnail');
            break;
        case 'new_arraival':
            results = await product_model_1.Product.find()
                .sort(Object.keys(sortCondition).length ? sortCondition : { createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('brand name slug price discountPrice ratings thumbnail');
            break;
        case 'best_seller':
            results = await product_model_1.Product.find()
                .sort(Object.keys(sortCondition).length
                ? sortCondition
                : { 'ratings.average': -1 })
                .skip(skip)
                .limit(limit)
                .select('brand name slug price discountPrice ratings thumbnail');
            break;
        case 'deal_of_the_day':
            results = await product_model_1.Product.find({ isTodayDeal: true })
                .sort(Object.keys(sortCondition).length ? sortCondition : { updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('brand name slug price discountPrice ratings thumbnail');
            break;
        case 'just_for_you':
            results = await product_model_1.Product.aggregate([
                { $sample: { size: 50 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        brand: 1,
                        name: 1,
                        slug: 1,
                        price: 1,
                        discountPrice: 1,
                        ratings: 1,
                        thumbnail: 1,
                    },
                },
            ]);
            break;
        default:
            results = [];
    }
    return results;
};
const getProductByISlug = async (slugs) => {
    const products = await product_model_1.Product.find({
        slug: { $in: slugs },
    }).populate('categoryId subCategoryId');
    if (!products.length) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'No products found');
    }
    return products;
};
exports.ProductService = {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    featuresProducts,
    getProductByISlug,
};
