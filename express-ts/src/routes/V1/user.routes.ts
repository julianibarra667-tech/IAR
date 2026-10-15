import { Router } from 'express';
import { container } from '../../config/container.js';
import { UserController } from '../../controllers/user.controller.js';


const router = Router();

router.post('/register', (req, res) => {
  const userController = container.resolve<UserController>('userController');
  return userController.register(req, res);
});

router.post('/login', (req, res) => {
  const userController = container.resolve<UserController>('userController');
  return userController.login(req, res);
});

export default router;