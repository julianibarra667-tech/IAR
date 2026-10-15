import { RewardRequestDTO, RewardResponseDTO } from '../../dto/reward.dto.js';

export interface IRewardService {
  getRewards(): Promise<RewardResponseDTO[]>;
  createReward(data: RewardRequestDTO): Promise<RewardResponseDTO>;
  deleteReward(id: string): Promise<boolean>;
}
