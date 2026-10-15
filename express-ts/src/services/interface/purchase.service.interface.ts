import { PurchaseRequestDTO } from '../../dto/purchase.dto.js';

export interface PurchaseResult {
  message: string;
  earnedExp: number;
  user: {
    id: string;
    points: number;
    level: string;
  };
  purchase: {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
  };
}

export interface IPurchaseService {
  makePurchase(data: PurchaseRequestDTO): Promise<PurchaseResult>;
}
