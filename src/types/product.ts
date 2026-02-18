// types/product.ts

// ✅ NUEVO: Tipo para categorías simples (del endpoint /products/categories)
export interface CategorySimple {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId?: number;
  categoryName: string;
  categoryImageUrl?: string;
  brand: string;
  color?: string;
  size?: string;
  material?: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  sku?: string;
  tags?: string;
  finalPrice?: number;
  discountPercentage?: number;
  hasDiscount?: boolean;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  username: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  onDiscount?: boolean;
  inStock?: boolean;
  sortBy?: string;
  page: number;
  pageSize: number;
}

export interface PaginationInfo {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId?: number;
  categoryName: string;
  brand: string;
  color?: string;
  size?: string;
  material?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  sku?: string;
  tags?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  stock?: number;
  categoryId?: number;
  categoryName?: string;
  brand?: string;
  color?: string;
  size?: string;
  material?: string;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sku?: string;
  tags?: string;
}

export interface CreateReviewDto {
  userId: number;
  username: string;
  rating: number;
  comment?: string;
}

export interface UpdateStockDto {
  quantity: number;
}