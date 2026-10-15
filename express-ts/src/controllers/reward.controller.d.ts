import { Request, Response } from 'express';
import { RewardResponseDTO } from '../dto/reward.dto';
import { IRewardService } from '../services/interface/reward.service.interface';
type RewardParams = {
    id: string;
};
export declare class RewardController {
    private rewardService;
    constructor(rewardService: IRewardService);
    getRewards: (_req: Request, res: Response<RewardResponseDTO[]>) => Promise<void>;
    createReward: (req: Request<{}, {}, unknown>, res: Response<RewardResponseDTO | {
        message: string;
        code: number;
    }>) => Promise<void>;
    deleteReward: (req: Request<RewardParams>, res: Response<{
        message: string;
        code: number;
    }>) => Promise<void>;
}
export {};
//# sourceMappingURL=reward.controller.d.ts.map