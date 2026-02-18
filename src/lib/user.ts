// lib/user.ts
import { authApi } from './api';

export const userService = {
  // Obtener todos los usuarios (solo Admin)
  getAllUsers: async () => {
    const response = await authApi.get('/users');
    return response.data;
  },

  // Crear usuario (solo Admin)
  createUser: async (data: any) => {
    const response = await authApi.post('/users', data);
    return response.data;
  },

  // Actualizar usuario (solo Admin)
  updateUser: async (id: number, data: any) => {
    const response = await authApi.put(`/users/${id}`, data);
    return response.data;
  },

  // Eliminar usuario (solo Admin)
  deleteUser: async (id: number) => {
    const response = await authApi.delete(`/users/${id}`);
    return response.data;
  },

  // Cambiar rol (solo Admin)
  changeRole: async (id: number, role: string) => {
    const response = await authApi.put(`/users/${id}/role`, { role });
    return response.data;
  },

  // Actualizar perfil propio
  updateProfile: async (data: any) => {
    const response = await authApi.put('/users/profile', data);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (data: any) => {
    const response = await authApi.put('/users/profile/password', data);
    return response.data;
  }
};