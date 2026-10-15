import { Router } from 'express';
import { container } from '../../config/container.js';
import { RewardController } from '../../controllers/reward.controller.js';

const router = Router();

router.get('/', (req, res) => {
  const rewardController = container.resolve<RewardController>('rewardController');
  return rewardController.getRewards(req, res);
});

router.post('/', (req, res) => {
  const rewardController = container.resolve<RewardController>('rewardController');
  return rewardController.createReward(req, res);
});

router.delete('/:id', (req, res) => {
  const rewardController = container.resolve<RewardController>('rewardController');
  return rewardController.deleteReward(req, res);
});

export default router;
