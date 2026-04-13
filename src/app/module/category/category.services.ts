import { AppError } from '@app/error/appError';
import { Category } from '@app/module/category/category.model';
import { ICategory } from '@app/module/category/category.interface';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const addCategory = async (payload: {
  name: string;
  children?: { name: string }[];
  parentId?: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isCategoryExist = await Category.findOne({
      name: payload.name,
      parentId: payload.parentId,
    }).session(session);

    if (isCategoryExist) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'Category already exists in this level!'
      );
    }

    const createdCategories = await Category.create(
      [
        {
          name: payload.name,
          parentId: payload.parentId,
        },
      ],
      { session }
    );

    const newCategory = createdCategories[0];

    if (!newCategory) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create category'
      );
    }

    let createdChildren: ICategory[] = [];

    if (!payload.parentId && payload.children && payload.children.length > 0) {
      const childrenToCreate = payload.children.map((child) => ({
        name: child.name,
        parentId: newCategory._id,
      }));

      createdChildren = await Category.create(childrenToCreate, { session });
    }

    await session.commitTransaction();
    await session.endSession();

    return {
      category: newCategory,
      children: createdChildren,
    };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    if (error instanceof AppError) throw error;
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const buildCategoryTree = (
  categories: ICategory[],
  parentId: string | null = null
): ICategory[] => {
  const categoryList: any[] = [];
  let filteredCategories: ICategory[] = [];

  if (parentId === null) {
    filteredCategories = categories.filter((cat) => !cat.parentId);
  } else {
    filteredCategories = categories.filter(
      (cat) => String(cat.parentId) === String(parentId)
    );
  }

  for (const cat of filteredCategories) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      children: buildCategoryTree(categories, String(cat._id)),
    });
  }

  return categoryList;
};

const getAllCategories = async () => {
  const categories = await Category.find().lean();

  const categoryTree = buildCategoryTree(categories);

  return categoryTree;
};

const updateCategory = async (payload: {
  name: string;
  categoryId?: string;
  parentId?: string;
  MODE: 'EDIT' | 'MOVE';
}) => {
  const { name, categoryId, parentId, MODE } = payload;

  if (MODE === 'EDIT') {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );
    return category;
  }

  if (MODE === 'MOVE') {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { parentId },
      { new: true }
    );
    return category;
  }
};

export const CategoryService = {
  addCategory,
  getAllCategories,
  updateCategory,
};
