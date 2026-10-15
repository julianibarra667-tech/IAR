import { Prisma, PrismaClient } from '@prisma/client';
import { ProductRequestDTO, ProductResponseDTO } from '../dto/product.dto.js';
import { IProductService } from './interface/product.service.interface.js';

export class ProductService implements IProductService {
  constructor(private prisma: PrismaClient) {}

  async getProducts(): Promise<ProductResponseDTO[]> {
    const products = await this.prisma.product.findMany({
      where: { status: true },
      orderBy: { createdAt: 'desc' }
    });
    return products.map((product) => this.toResponse(product));
  }

  async createProduct(dto: ProductRequestDTO): Promise<ProductResponseDTO> {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        price: dto.price,
        expGiven: dto.points,
        imageUri: dto.imageUri ?? null
      }
    });
    return this.toResponse(product);
  }

  async updateProduct(
    id: string,
    dto: ProductRequestDTO
  ): Promise<ProductResponseDTO | null> {
    const existingProduct = await this.prisma.product.findFirst({
      where: { id, status: true }
    });
    if (!existingProduct) {
      return null;
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name.trim(),
        price: dto.price,
        expGiven: dto.points,
        imageUri: dto.imageUri === undefined ? existingProduct.imageUri : dto.imageUri
      }
    });
    return this.toResponse(updatedProduct);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.prisma.product.findFirst({
      where: { id, status: true }
    });
    if (!product) {
      return false;
    }

    const purchaseCount = await this.prisma.purchase.count({
      where: { productId: id }
    });

    if (purchaseCount > 0) {
      await this.prisma.product.update({
        where: { id },
        data: { status: false }
      });
    } else {
      try {
        await this.prisma.product.delete({ where: { id } });
      } catch (error) {
        if (
          !(error instanceof Prisma.PrismaClientKnownRequestError) ||
          error.code !== 'P2003'
        ) {
          throw error;
        }
        await this.prisma.product.update({
          where: { id },
          data: { status: false }
        });
      }
    }
    return true;
  }

  private toResponse(product: {
    id: string;
    name: string;
    price: number;
    expGiven: number;
    imageUri: string | null;
  }): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      points: product.expGiven,
      imageUri: product.imageUri
    };
  }
}
