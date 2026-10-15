import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import {
  UserAuthResponseDTO,
  UserLoginRequestDTO,
  UserRegistrationRequestDTO
} from '../dto/user.dto.js';
import { IUserService } from './interface/user.service.interface.js';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export class UsernameAlreadyExistsError extends Error {}
export class InvalidCredentialsError extends Error {}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash || !/^[0-9a-f]{32}$/i.test(salt) || !/^[0-9a-f]{128}$/i.test(hash)) {
    return false;
  }

  const expectedKey = Buffer.from(hash, 'hex');
  const actualKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return timingSafeEqual(actualKey, expectedKey);
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 'P2002';
}

export class UserService implements IUserService {
  constructor(private prisma: PrismaClient) {}

  async register(dto: UserRegistrationRequestDTO): Promise<UserAuthResponseDTO> {
    const username = dto.username.trim().toLowerCase();
    let newUser;
    try {
      newUser = await this.prisma.user.create({
        data: {
          username,
          passwordHash: await hashPassword(dto.password),
          name: dto.name.trim(),
          lastName: dto.lastName.trim(),
          age: dto.age
        }
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new UsernameAlreadyExistsError('Ese nombre de usuario ya está registrado.');
      }
      throw error;
    }

    return {
      message: 'La cuenta se creó correctamente.',
      user: this.toUserResponse(newUser)
    };
  }

  async login(dto: UserLoginRequestDTO): Promise<UserAuthResponseDTO> {
    const username = dto.username.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (
      !user ||
      !user.passwordHash ||
      !user.status ||
      !(await verifyPassword(dto.password, user.passwordHash))
    ) {
      throw new InvalidCredentialsError('Usuario o contraseña incorrectos.');
    }

    return {
      message: 'Inicio de sesión correcto.',
      user: this.toUserResponse(user)
    };
  }

  private toUserResponse(user: {
    id: string;
    username: string | null;
    name: string;
    lastName: string;
    age: number;
    level: string;
    points: number;
    status: boolean;
    createdAt: Date;
  }) {
    if (!user.username) {
      throw new Error('El usuario no tiene nombre de usuario configurado.');
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      fullName: `${user.name} ${user.lastName}`,
      age: user.age,
      level: user.level,
      points: user.points,
      status: user.status,
      createdAt: user.createdAt.toISOString()
    };
  }
}