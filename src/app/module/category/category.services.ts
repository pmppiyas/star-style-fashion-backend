import { AppError } from '@app/error/appError';
import { Category } from '@app/module/category/category.model';
import { ICategory } from '@app/module/category/category.utils';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const addCategory = async (payload: {
  name: string;
  children?: { name: string }[];
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isCategoryExist = await Category.findOne({
      name: payload.name,
      parentId: null,
    }).session(session);

    if (isCategoryExist) {
      throw new AppError(StatusCodes.CONFLICT, 'Category already exists!');
    }

    const [parentCategory] = await Category.create([{ name: payload.name }], {
      session,
    });

    if (!parentCategory) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create parent category'
      );
    }

    let createdChildren: ICategory[] = [];

    if (payload.children && payload.children.length > 0) {
      const childrenToCreate = payload.children.map((child) => ({
        name: child.name,
        parentId: parentCategory._id,
      }));

      createdChildren = await Category.create(childrenToCreate, { session });
    }

    await session.commitTransaction();
    await session.endSession();

    return {
      parent: parentCategory,
      children: createdChildren,
    };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    if (error instanceof AppError) throw error;

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Failed to create category'
    );
  }
};

export const CategoryService = {
  addCategory,
};
