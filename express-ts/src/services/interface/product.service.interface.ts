import { ProductRequestDTO, ProductResponseDTO } from '../../dto/product.dto.js';

export interface IProductService {
  getProducts(): Promise<ProductResponseDTO[]>;
  createProduct(data: ProductRequestDTO): Promise<ProductResponseDTO>;
  updateProduct(id: string, data: ProductRequestDTO): Promise<ProductResponseDTO | null>;
  deleteProduct(id: string): Promise<boolean>;
}
