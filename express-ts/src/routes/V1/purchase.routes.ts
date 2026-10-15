import { Router } from 'express';
import { container } from '../../config/container.js';
import { PurchaseController } from '../../controllers/purchase.controller.js';

const router = Router();

router.post('/', (req, res) => {
  const purchaseController = container.resolve<PurchaseController>('purchaseController');
  return purchaseController.makePurchase(req, res);
});

export default router;
