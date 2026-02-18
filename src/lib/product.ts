import { productApi } from './api';
import type {
  Product,
  ProductFilter,
  PaginationInfo,
  CreateProductDto,
  UpdateProductDto,
  Review,
  CreateReviewDto
} from '@/types';

export const productService = {
  // Obtener todos los productos
  async getAllProducts(): Promise<Product[]> {
    const response = await productApi.get('/products');
    return response.data;
  },

  // Obtener producto por ID
  async getProductById(id: number): Promise<Product> {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
  },

  // Obtener productos destacados
  async getFeaturedProducts(count: number = 8): Promise<Product[]> {
    const response = await productApi.get(`/products/featured?count=${count}`);
    return response.data;
  },

  // ✅ NUEVO: Obtener productos por categoría (por ID)
  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    const response = await productApi.get(`/products/category/id/${categoryId}`);
    return response.data;
  },

  // Obtener productos filtrados
  async getFilteredProducts(filter: ProductFilter): Promise<{ products: Product[], pagination: PaginationInfo }> {
    const params = new URLSearchParams();
    
    if (filter.search) params.append('search', filter.search);
    if (filter.category) params.append('category', filter.category);
    if (filter.categoryId) params.append('categoryId', filter.categoryId.toString()); // ✅ NUEVO
    if (filter.brand) params.append('brand', filter.brand);
    if (filter.minPrice) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.isFeatured !== undefined) params.append('isFeatured', filter.isFeatured.toString());
    if (filter.onDiscount !== undefined) params.append('onDiscount', filter.onDiscount.toString());
    if (filter.inStock !== undefined) params.append('inStock', filter.inStock.toString());
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    params.append('page', filter.page.toString());
    params.append('pageSize', filter.pageSize.toString());

    const response = await productApi.get(`/products/filter?${params.toString()}`);
    return response.data;
  },

  // ✅ ACTUALIZADO: Obtener categorías completas (no solo nombres)
  async getCategories(): Promise<{ id: number; name: string; imageUrl?: string }[]> {
    const response = await productApi.get('/products/categories');
    return response.data;
  },

  // Obtener marcas
  async getBrands(): Promise<string[]> {
    const response = await productApi.get('/products/brands');
    return response.data;
  },

  // Obtener productos por categoría (por nombre - compatibilidad)
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await productApi.get(`/products/category/${category}`);
    return response.data;
  },

  // Crear producto (solo admin)
  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await productApi.post('/products', data);
    return response.data;
  },

  // Actualizar producto (solo admin)
  async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await productApi.put(`/products/${id}`, data);
    return response.data;
  },

  // Eliminar producto (solo admin)
  async deleteProduct(id: number): Promise<boolean> {
    await productApi.delete(`/products/${id}`);
    return true;
  },

  // Actualizar stock (solo admin)
  async updateStock(id: number, quantity: number): Promise<boolean> {
    await productApi.patch(`/products/${id}/stock`, { quantity });
    return true;
  },

  // Reseñas
  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await productApi.get(`/products/${productId}/reviews`);
    return response.data;
  },

  async addReview(productId: number, data: CreateReviewDto): Promise<Review> {
    const response = await productApi.post(`/products/${productId}/reviews`, data);
    return response.data;
  }
};