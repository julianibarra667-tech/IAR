import { Router } from 'express';
import v1Router from './V1/index.js';

const rootRouter = Router();

// Versionamiento global
rootRouter.use('/v1', v1Router);

export default rootRouter;