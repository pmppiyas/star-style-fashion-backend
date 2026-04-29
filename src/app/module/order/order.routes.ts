import { OrderController } from '@app/module/order/order.controller';
import { Router } from 'express';

const router = Router();

router.post('/create', OrderController.createOrder);

export const OrderRoutes = router;
