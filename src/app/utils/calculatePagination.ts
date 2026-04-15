import {
  IOptions,
  IOptionsResult,
} from '@app/module/product/product.interface';

export const calculatePagination = (options: IOptions = {}): IOptionsResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = Number((page - 1) * limit);

  const sortBy = options.sortBy;
  const sortOrder =
    options.sortOrder === 'asc' || options.sortOrder === 'desc'
      ? options.sortOrder
      : undefined;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
