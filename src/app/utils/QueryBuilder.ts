import { Query } from 'mongoose';

export const excludeFilterFields = [
  'searchTerm',
  'sort',
  'fields',
  'page',
  'limit',
  'minPrice',
  'maxPrice',
];

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string> = {}) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const { minPrice, maxPrice, ...rest } = Object.fromEntries(
      Object.entries(this.query).filter(
        ([key]) => !excludeFilterFields.includes(key)
      )
    );

    console.log('minPrice:', minPrice);
    console.log('maxPrice:', maxPrice);

    const andConditions: any[] = [];
    if (Object.keys(rest).length) {
      andConditions.push(rest);
    }

    if (minPrice || maxPrice) {
      andConditions.push({
        price: {
          ...(minPrice && { $gte: Number(minPrice) }),
          ...(maxPrice && { $lte: Number(maxPrice) }),
        },
      });
    }

    const finalQuery = andConditions.length ? { $and: andConditions } : {};

    console.log('Filter Query=>', finalQuery);
    this.modelQuery = this.modelQuery.find(finalQuery);

    return this;
  }

  build(
    populateFields: { path: string; select?: string }[] = []
  ): Query<T[], T> {
    let query = this.modelQuery;
    for (const field of populateFields) {
      query = query.populate(field.path, field.select || '');
    }
    return query;
  }
}
