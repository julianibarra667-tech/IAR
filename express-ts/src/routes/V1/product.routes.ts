import { Router } from 'express';
import { container } from '../../config/container.js';
import { ProductController } from '../../controllers/product.controller.js';

const router = Router();

router.get('/', (req, res) => {
  const productController = container.resolve<ProductController>('productController');
  return productController.getProducts(req, res);
});

router.post('/', (req, res) => {
  const productController = container.resolve<ProductController>('productController');
  return productController.createProduct(req, res);
});

router.put('/:id', (req, res) => {
  const productController = container.resolve<ProductController>('productController');
  return productController.updateProduct(req, res);
});

router.delete('/:id', (req, res) => {
  const productController = container.resolve<ProductController>('productController');
  return productController.deleteProduct(req, res);
});

export default router;
