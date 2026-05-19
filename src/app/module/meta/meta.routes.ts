import { Router } from 'express';
import { MetaController } from './meta.controller';

const router = Router();

router.get('/admin', MetaController.getAdminMeta);

export const MetaRoutes = router;
