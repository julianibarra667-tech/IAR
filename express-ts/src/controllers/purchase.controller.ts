import { Request, Response } from 'express';
import { PurchaseRequestDTO } from '../dto/purchase.dto.js';
import { PurchaseNotFoundError } from '../services/purchase.service.js';
import { IPurchaseService } from '../services/interface/purchase.service.interface.js';

const isPurchaseRequest = (body: unknown): body is PurchaseRequestDTO => {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const purchase = body as Record<string, unknown>;
  return typeof purchase.userId === 'string'
    && isUuid(purchase.userId.trim())
    && typeof purchase.productId === 'string'
    && isUuid(purchase.productId.trim());
};

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export class PurchaseController {
  constructor(private purchaseService: IPurchaseService) {}

  makePurchase = async (
    req: Request<{}, {}, unknown>,
    res: Response
  ): Promise<void> => {
    if (!isPurchaseRequest(req.body)) {
      res.status(400).json({
        message: 'userId and productId must be valid UUIDs.',
        code: 400,
      });
      return;
    }

    try {
      const result = await this.purchaseService.makePurchase({
        userId: req.body.userId.trim(),
        productId: req.body.productId.trim(),
      });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof PurchaseNotFoundError) {
        res.status(404).json({ message: error.message, code: 404 });
        return;
      }

      console.error('Failed to make purchase:', error);
      res.status(500).json({
        message: 'No se pudo completar la compra.',
        code: 500,
      });
    }
  };
}
