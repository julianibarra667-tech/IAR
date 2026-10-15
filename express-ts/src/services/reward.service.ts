import { PrismaClient } from '@prisma/client';
import { RewardRequestDTO, RewardResponseDTO } from '../dto/reward.dto.js';
import { IRewardService } from './interface/reward.service.interface.js';

export class RewardService implements IRewardService {
  constructor(private prisma: PrismaClient) {}

  async getRewards(): Promise<RewardResponseDTO[]> {
    const rewards = await this.prisma.reward.findMany({
      where: { status: true },
      orderBy: { createdAt: 'desc' }
    });
    return rewards.map((reward) => this.toResponse(reward));
  }

  async createReward(dto: RewardRequestDTO): Promise<RewardResponseDTO> {
    const reward = await this.prisma.reward.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        value: dto.value,
        pointsCost: dto.points
      }
    });
    return this.toResponse(reward);
  }

  async deleteReward(id: string): Promise<boolean> {
    const reward = await this.prisma.reward.findFirst({
      where: { id, status: true }
    });
    if (!reward) {
      return false;
    }

    await this.prisma.reward.delete({ where: { id } });
    return true;
  }

  private toResponse(reward: {
    id: string;
    title: string;
    description: string | null;
    value: number;
    pointsCost: number;
  }): RewardResponseDTO {
    return {
      id: reward.id,
      title: reward.title,
      value: reward.value,
      points: reward.pointsCost,
      description: reward.description ?? ''
    };
  }
}
