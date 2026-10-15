import { Request, Response } from 'express';
import { UserRequestDTO, UserResponseDTO } from '../dto/user.dto';
import { IUserService } from '../services/interface/user.service.interface';
export declare class UserController {
    private userService;
    constructor(userService: IUserService);
    createUser: (req: Request<{}, {}, UserRequestDTO>, res: Response<UserResponseDTO>) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map