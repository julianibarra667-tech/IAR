import { Request, Response } from 'express';
import { RewardRequestDTO, RewardResponseDTO } from '../dto/reward.dto.js';
import { IRewardService } from '../services/interface/reward.service.interface.js';

type RewardParams = { id: string };

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const isRewardRequest = (body: unknown): body is RewardRequestDTO => {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const reward = body as Record<string, unknown>;
  return typeof reward.title === 'string'
    && reward.title.trim().length > 0
    && typeof reward.value === 'number'
    && Number.isFinite(reward.value)
    && reward.value > 0
    && typeof reward.points === 'number'
    && Number.isSafeInteger(reward.points)
    && reward.points > 0
    && typeof reward.description === 'string'
    && reward.description.trim().length > 0;
};

export class RewardController {
  constructor(private rewardService: IRewardService) {}

  getRewards = async (
    _req: Request,
    res: Response<RewardResponseDTO[] | { message: string; code: number }>
  ): Promise<void> => {
    try {
      const rewards = await this.rewardService.getRewards();
      res.status(200).json(rewards);
    } catch (error) {
      console.error('Failed to list rewards:', error);
      res.status(500).json({ message: 'No se pudieron cargar los premios.', code: 500 });
    }
  };

  createReward = async (
    req: Request<{}, {}, unknown>,
    res: Response<RewardResponseDTO | { message: string; code: number }>
  ): Promise<void> => {
    if (!isRewardRequest(req.body)) {
      res.status(400).json({
        message: 'Invalid reward. title, value, points, and description are required.',
        code: 400
      });
      return;
    }

    try {
      const reward = await this.rewardService.createReward(req.body);
      res.status(201).json(reward);
    } catch (error) {
      console.error('Failed to create reward:', error);
      res.status(500).json({ message: 'No se pudo guardar el premio.', code: 500 });
    }
  };

  deleteReward = async (
    req: Request<RewardParams>,
    res: Response<{ message: string; code: number }>
  ): Promise<void> => {
    const id = req.params.id;
    if (!isUuid(id)) {
      res.status(400).json({ message: 'Invalid reward id.', code: 400 });
      return;
    }

    try {
      const deleted = await this.rewardService.deleteReward(id);
      if (!deleted) {
        res.status(404).json({ message: 'Reward not found.', code: 404 });
        return;
      }
      res.status(204).end();
    } catch (error) {
      console.error('Failed to delete reward:', error);
      res.status(500).json({ message: 'No se pudo eliminar el premio.', code: 500 });
    }
  };
}
