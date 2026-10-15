import { PrismaClient } from '@prisma/client';
import { PurchaseRequestDTO } from '../dto/purchase.dto.js';
import { calculateLevel } from '../utils/levelCalculator.js';
import { IPurchaseService, PurchaseResult } from './interface/purchase.service.interface.js';

export class PurchaseNotFoundError extends Error {}

export class PurchaseService implements IPurchaseService {
  constructor(private prisma: PrismaClient) {}

  async makePurchase(data: PurchaseRequestDTO): Promise<PurchaseResult> {
    return this.prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id: data.userId },
      });
      if (!user) {
        throw new PurchaseNotFoundError('Usuario no encontrado.');
      }

      const product = await transaction.product.findUnique({
        where: { id: data.productId },
      });
      if (!product || !product.status) {
        throw new PurchaseNotFoundError('Producto no encontrado.');
      }

      const purchase = await transaction.purchase.create({
        data: {
          userId: user.id,
          productId: product.id,
        },
      });

      const earnedExp = Math.round((product.price * 6) / 1000);
      const newPoints = user.points + earnedExp;
      const updatedUser = await transaction.user.update({
        where: { id: user.id },
        data: {
          points: newPoints,
          level: calculateLevel(newPoints),
        },
      });

      return {
        message: 'Compra realizada con éxito y experiencia otorgada.',
        earnedExp,
        user: {
          id: updatedUser.id,
          points: updatedUser.points,
          level: updatedUser.level,
        },
        purchase,
      };
    });
  }
}
