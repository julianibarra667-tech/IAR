export interface UserRegistrationRequestDTO {
  username: string;
  password: string;
  name: string;
  lastName: string;
  age: number;
}

export interface UserResponseDTO {
  id: string;
  username: string;
  name: string;
  lastName: string;
  fullName: string;
  age: number;
  level: string;
  points: number;
  status: boolean;
  createdAt: string;
}

export interface UserAuthResponseDTO {
  message: string;
  user: UserResponseDTO;
}

export interface UserLoginRequestDTO {
  username: string;
  password: string;
}