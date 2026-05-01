import { OrderController } from '../../module/order/order.controller';
import { Router } from 'express';

const router = Router();

router.post('/create', OrderController.createOrder);

router.get('/list', OrderController.getOrders);

router.patch('/update-status/:id', OrderController.updateOrderStatus);

export const OrderRoutes = router;
