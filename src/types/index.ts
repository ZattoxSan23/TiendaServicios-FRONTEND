export * from './product';
export * from './category';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  createdAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
}

export interface ChangeRoleDto {
  role: string;
}

export interface UpdateProfileDto {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
}