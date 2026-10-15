import { Request, Response } from 'express';
import {
  UserAuthResponseDTO,
  UserLoginRequestDTO,
  UserRegistrationRequestDTO
} from '../dto/user.dto.js';
import {
  InvalidCredentialsError,
  UsernameAlreadyExistsError
} from '../services/user.service.js';
import { IUserService } from '../services/interface/user.service.interface.js';

const isUsername = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-zA-Z0-9._-]{3,30}$/.test(value.trim());

export class UserController {
  constructor(private userService: IUserService) {}

  register = async (
    req: Request<{}, {}, unknown>,
    res: Response<UserAuthResponseDTO | { message: string; code: number }>
  ): Promise<void> => {
    if (!this.isRegistrationRequest(req.body)) {
      res.status(400).json({
        message: 'Completa nombre de usuario, contraseña, nombre, apellido y una edad válida (18+).',
        code: 400
      });
      return;
    }

    try {
      const result = await this.userService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof UsernameAlreadyExistsError) {
        res.status(409).json({ message: error.message, code: 409 });
        return;
      }
      console.error('Failed to register user:', error);
      res.status(500).json({ message: 'No se pudo crear la cuenta.', code: 500 });
    }
  };

  login = async (
    req: Request<{}, {}, unknown>,
    res: Response<UserAuthResponseDTO | { message: string; code: number }>
  ): Promise<void> => {
    if (!this.isLoginRequest(req.body)) {
      res.status(400).json({
        message: 'Ingresa un nombre de usuario y una contraseña válidos.',
        code: 400
      });
      return;
    }

    try {
      const result = await this.userService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        res.status(401).json({ message: error.message, code: 401 });
        return;
      }
      console.error('Failed to log in user:', error);
      res.status(500).json({ message: 'No se pudo iniciar sesión.', code: 500 });
    }
  };

  private isRegistrationRequest(body: unknown): body is UserRegistrationRequestDTO {
    if (typeof body !== 'object' || body === null) return false;
    const value = body as Record<string, unknown>;
    return isUsername(value.username)
      && typeof value.password === 'string'
      && value.password.length >= 8
      && typeof value.name === 'string'
      && value.name.trim().length > 0
      && typeof value.lastName === 'string'
      && value.lastName.trim().length > 0
      && typeof value.age === 'number'
      && Number.isInteger(value.age)
      && value.age >= 18
      && value.age <= 120;
  }

  private isLoginRequest(body: unknown): body is UserLoginRequestDTO {
    if (typeof body !== 'object' || body === null) return false;
    const value = body as Record<string, unknown>;
    return isUsername(value.username)
      && typeof value.password === 'string'
      && value.password.length > 0;
  };
}