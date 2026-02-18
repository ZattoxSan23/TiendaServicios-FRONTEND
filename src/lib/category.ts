import { productApi } from './api';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await productApi.get('/categories');
    return response.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await productApi.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const response = await productApi.post('/categories', data);
    return response.data;
  },

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const response = await productApi.put(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: number): Promise<boolean> {
    await productApi.delete(`/categories/${id}`);
    return true;
  },

  async toggleCategoryStatus(id: number): Promise<void> {
    await productApi.patch(`/categories/${id}/toggle`);
  }
};