import { Router } from 'express';
import { CustomerController } from './customer.controller';

const router = Router();

router.get('/get', CustomerController.getAllCustomers);

export const CustomerRoutes = router;
