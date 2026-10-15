import express, { Application } from 'express';
import { scopePerRequest } from 'awilix-express';
import { container } from './config/container.js';
import rootRouter from './routes/index.js';

export const createServer = (): Application => {
  const app = express();

  // Middleware para procesar JSON
  app.use(express.json());

  // Inyección del contenedor por cada petición HTTP
  app.use(scopePerRequest(container));

  // Rutas de la API
  app.use('/api', rootRouter);

  // Manejo de rutas no encontradas (404)
  app.use((req, res) => {
    res.status(404).json({
      message: 'Route not found',
      code: 404
    });
  });

  return app;
};