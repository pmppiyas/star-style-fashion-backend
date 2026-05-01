"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const appError_1 = require("@app/error/appError");
const category_model_1 = require("@app/module/category/category.model");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const addCategory = async (payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const isCategoryExist = await category_model_1.Category.findOne({
            name: payload.name,
            parentId: payload.parentId,
        }).session(session);
        if (isCategoryExist) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, 'Category already exists in this level!');
        }
        const createdCategories = await category_model_1.Category.create([
            {
                name: payload.name,
                slug: (0, slugify_1.default)(payload.name, {
                    lower: true,
                    strict: true,
                }),
                parentId: payload.parentId,
            },
        ], { session });
        const newCategory = createdCategories[0];
        if (!newCategory) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create category');
        }
        let createdChildren = [];
        if (payload.children?.length) {
            const childrenToCreate = payload.children.map((child) => ({
                name: child.name,
                slug: (0, slugify_1.default)(child.name, {
                    lower: true,
                    strict: true,
                }),
                parentId: newCategory._id,
            }));
            createdChildren = await category_model_1.Category.insertMany(childrenToCreate, {
                session,
            });
        }
        await session.commitTransaction();
        await session.endSession();
        return {
            category: newCategory,
            children: createdChildren,
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        if (error instanceof appError_1.AppError)
            throw error;
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};
const buildCategoryTree = (categories, parentId = null) => {
    const categoryList = [];
    const filteredCategories = parentId === null
        ? categories.filter((cat) => cat.parentId == null)
        : categories.filter((cat) => String(cat.parentId) === String(parentId));
    for (const cat of filteredCategories) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            parentId: cat.parentId,
            children: buildCategoryTree(categories, String(cat._id)),
        });
    }
    return categoryList;
};
const getAllCategories = async () => {
    const categories = await category_model_1.Category.find().lean();
    const categoryTree = buildCategoryTree(categories);
    return categoryTree;
};
const updateCategory = async (payload) => {
    const { name, categoryId, parentId, MODE } = payload;
    if (MODE === 'EDIT') {
        const category = await category_model_1.Category.findByIdAndUpdate(categoryId, { name }, { new: true });
        return category;
    }
    if (MODE === 'MOVE') {
        const category = await category_model_1.Category.findByIdAndUpdate(categoryId, { parentId }, { new: true });
        return category;
    }
};
const deleteCategory = async (categoryId) => {
    const isExist = await category_model_1.Category.findById(categoryId);
    if (!isExist) {
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Targeted category not found!');
    }
    await category_model_1.Category.findByIdAndDelete(categoryId);
    return null;
};
exports.CategoryService = {
    addCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
