import { Request, Response } from 'express';
import { ProductResponseDTO } from '../dto/product.dto';
import { IProductService } from '../services/interface/product.service.interface';
type ProductParams = {
    id: string;
};
export declare class ProductController {
    private productService;
    constructor(productService: IProductService);
    createProduct: (req: Request<{}, {}, unknown>, res: Response<ProductResponseDTO | {
        message: string;
        code: number;
    }>) => Promise<void>;
    updateProduct: (req: Request<ProductParams, {}, unknown>, res: Response<ProductResponseDTO | {
        message: string;
        code: number;
    }>) => Promise<void>;
    deleteProduct: (req: Request<ProductParams>, res: Response<{
        message: string;
        code: number;
    }>) => Promise<void>;
}
export {};
//# sourceMappingURL=product.controller.d.ts.map