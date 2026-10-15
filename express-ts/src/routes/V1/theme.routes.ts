import { Router } from 'express';
import { container } from '../../config/container.js';
import { ThemeController } from '../../controllers/theme.controller.js';

const router = Router();

router.get('/', (req, res) => {
  const themeController = container.resolve<ThemeController>('themeController');
  return themeController.getTheme(req, res);
});

router.put('/', (req, res) => {
  const themeController = container.resolve<ThemeController>('themeController');
  return themeController.updateTheme(req, res);
});

export default router;
