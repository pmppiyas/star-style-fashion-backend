"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_router_1 = require("@app/module/auth/auth.router");
const category_routes_1 = require("@app/module/category/category.routes");
const order_routes_1 = require("@app/module/order/order.routes");
const product_routes_1 = require("@app/module/product/product.routes");
const user_routes_1 = require("@app/module/user/user.routes");
const express_1 = require("express");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_router_1.AuthRoutes,
    },
    {
        path: '/category',
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: '/product',
        route: product_routes_1.ProductRoutes,
    },
    {
        path: '/order',
        route: order_routes_1.OrderRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
