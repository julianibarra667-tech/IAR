import {
  UserAuthResponseDTO,
  UserLoginRequestDTO,
  UserRegistrationRequestDTO
} from '../../dto/user.dto.js';

export interface IUserService {
  register(data: UserRegistrationRequestDTO): Promise<UserAuthResponseDTO>;
  login(data: UserLoginRequestDTO): Promise<UserAuthResponseDTO>;
}