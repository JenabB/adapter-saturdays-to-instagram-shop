// src/lib/types/sku.ts

export interface SKU {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status: SKUStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export enum SKUStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

export interface CreateSKURequest {
  code: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status?: SKUStatus;
}

export interface UpdateSKURequest {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
  status?: SKUStatus;
}

export interface SKUSearchParams {
  search?: string;
  category?: string;
  status?: SKUStatus;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface SKUListResponse {
  data: SKU[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SKUStatsResponse {
  total: number;
  active: number;
  inactive: number;
  discontinued: number;
  totalValue: number;
  avgPrice: number;
}

export interface ImportSKURequest {
  data: CreateSKURequest[];
}

export interface ImportSKUResponse {
  success: boolean;
  imported: number;
  failed: number;
  errors?: string[];
}
