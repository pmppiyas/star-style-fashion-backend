"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => async (req, res, next) => {
    try {
        const raw = req.body?.body || req.body?.data || req.body;
        if (typeof raw === 'string') {
            req.body = JSON.parse(raw);
        }
        else {
            req.body = raw;
        }
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateRequest = validateRequest;
