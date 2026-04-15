"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = exports.excludeFilterFields = void 0;
exports.excludeFilterFields = [
    'searchTerm',
    'sort',
    'fields',
    'page',
    'limit',
    'minPrice',
    'maxPrice',
];
class QueryBuilder {
    constructor(modelQuery, query = {}) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const { minPrice, maxPrice, ...rest } = Object.fromEntries(Object.entries(this.query).filter(([key]) => !exports.excludeFilterFields.includes(key)));
        console.log('minPrice:', minPrice);
        console.log('maxPrice:', maxPrice);
        const andConditions = [];
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
    build(populateFields = []) {
        let query = this.modelQuery;
        for (const field of populateFields) {
            query = query.populate(field.path, field.select || '');
        }
        return query;
    }
}
exports.QueryBuilder = QueryBuilder;
