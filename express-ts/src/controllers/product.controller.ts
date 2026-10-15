import { Request, Response } from 'express';
import { ProductRequestDTO, ProductResponseDTO } from '../dto/product.dto.js';
import { IProductService } from '../services/interface/product.service.interface.js';

type ProductParams = { id: string };

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const isProductRequest = (body: unknown): body is ProductRequestDTO => {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const product = body as Record<string, unknown>;
  return typeof product.name === 'string'
    && product.name.trim().length > 0
    && typeof product.price === 'number'
    && Number.isFinite(product.price)
    && product.price >= 0
    && typeof product.points === 'number'
    && Number.isInteger(product.points)
    && product.points >= 0
    && (product.imageUri === undefined
      || product.imageUri === null
      || (typeof product.imageUri === 'string' && product.imageUri.length <= 2_000_000));
};

export class ProductController {
  constructor(private productService: IProductService) {}

  getProducts = async (
    _req: Request,
    res: Response<ProductResponseDTO[] | { message: string; code: number }>
  ): Promise<void> => {
    try {
      res.status(200).json(await this.productService.getProducts());
    } catch (error) {
      console.error('Failed to list products:', error);
      res.status(500).json({ message: 'No se pudieron cargar los productos.', code: 500 });
    }
  };

  createProduct = async (
    req: Request<{}, {}, unknown>,
    res: Response<ProductResponseDTO | { message: string; code: number }>
  ): Promise<void> => {
    if (!isProductRequest(req.body)) {
      res.status(400).json({
        message: 'Invalid product. name, price, and points are required.',
        code: 400
      });
      return;
    }

    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Failed to create product:', error);
      res.status(500).json({ message: 'No se pudo guardar el producto.', code: 500 });
    }
  };

  updateProduct = async (
    req: Request<ProductParams, {}, unknown>,
    res: Response<ProductResponseDTO | { message: string; code: number }>
  ): Promise<void> => {
    const id = req.params.id;
    if (!isUuid(id)) {
      res.status(400).json({ message: 'Invalid product id.', code: 400 });
      return;
    }

    if (!isProductRequest(req.body)) {
      res.status(400).json({
        message: 'Invalid product. name, price, and points are required.',
        code: 400
      });
      return;
    }

    try {
      const product = await this.productService.updateProduct(id, req.body);
      if (!product) {
        res.status(404).json({ message: 'Product not found.', code: 404 });
        return;
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Failed to update product:', error);
      res.status(500).json({ message: 'No se pudo actualizar el producto.', code: 500 });
    }
  };

  deleteProduct = async (
    req: Request<ProductParams>,
    res: Response<{ message: string; code: number }>
  ): Promise<void> => {
    const id = req.params.id;
    if (!isUuid(id)) {
      res.status(400).json({ message: 'Invalid product id.', code: 400 });
      return;
    }

    try {
      const deleted = await this.productService.deleteProduct(id);
      if (!deleted) {
        res.status(404).json({ message: 'Product not found.', code: 404 });
        return;
      }
      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete product:', error);
      res.status(500).json({ message: 'No se pudo eliminar el producto.', code: 500 });
    }
  };
}
