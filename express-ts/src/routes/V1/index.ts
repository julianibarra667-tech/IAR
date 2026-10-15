import { Router } from 'express';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import rewardRoutes from './reward.routes.js';
import themeRoutes from './theme.routes.js';
import purchaseRoutes from './purchase.routes.js';

const v1Router = Router();

// Modulo de usuarios bajo la v1
v1Router.use('/users', userRoutes);
v1Router.use('/products', productRoutes);
v1Router.use('/rewards', rewardRoutes);
v1Router.use('/theme', themeRoutes);
v1Router.use('/purchases', purchaseRoutes);

export default v1Router;