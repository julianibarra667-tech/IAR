import { createContainer, asClass, InjectionMode, asValue } from 'awilix';
import { UserService } from '../services/user.service.js';
import { UserController } from '../controllers/user.controller.js';
import { ProductService } from '../services/product.service.js';
import { ProductController } from '../controllers/product.controller.js';
import { RewardService } from '../services/reward.service.js';
import { RewardController } from '../controllers/reward.controller.js';
import { ThemeService } from '../services/theme.service.js';
import { ThemeController } from '../controllers/theme.controller.js';
import { PurchaseService } from '../services/purchase.service.js';
import { PurchaseController } from '../controllers/purchase.controller.js';
import { prisma } from './prisma.js';

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

// Registro de dependencias en el contenedor
container.register({
  prisma: asValue(prisma),
  userService: asClass(UserService).scoped(),
  userController: asClass(UserController).scoped(),
  productService: asClass(ProductService).singleton(),
  productController: asClass(ProductController).scoped(),
  rewardService: asClass(RewardService).singleton(),
  rewardController: asClass(RewardController).scoped(),
  themeService: asClass(ThemeService).singleton(),
  themeController: asClass(ThemeController).scoped(),
  purchaseService: asClass(PurchaseService).scoped(),
  purchaseController: asClass(PurchaseController).scoped()
});