// src/lib/api/sku.ts
import { apiClient } from '../utils/apiClient';
import {
  SKU,
  CreateSKURequest,
  UpdateSKURequest,
  SKUSearchParams,
  SKUListResponse,
  SKUStatsResponse,
  ImportSKURequest,
  ImportSKUResponse,
} from '../types/sku';
import { ApiResponse } from '../types/api';

export const skuApi = {
  // Get all SKUs with pagination
  async getAllSKUs(
    params: SKUSearchParams = {}
  ): Promise<ApiResponse<SKUListResponse>> {
    try {
      const response = await apiClient.get<SKUListResponse>('/sku', params);
      return response;
    } catch (error) {
      console.error('Error fetching SKUs:', error);
      throw error;
    }
  },

  // Get SKU by ID
  async getSKUById(id: string): Promise<ApiResponse<SKU>> {
    try {
      const response = await apiClient.get<SKU>(`/sku/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching SKU ${id}:`, error);
      throw error;
    }
  },

  // Search SKUs
  async searchSKUs(
    query: string,
    filters: Omit<SKUSearchParams, 'search'> = {}
  ): Promise<ApiResponse<SKUListResponse>> {
    try {
      const params: SKUSearchParams = {
        search: query,
        ...filters,
      };
      const response = await apiClient.get<SKUListResponse>(
        '/sku/search',
        params
      );
      return response;
    } catch (error) {
      console.error('Error searching SKUs:', error);
      throw error;
    }
  },

  // Create new SKU
  async createSKU(skuData: CreateSKURequest): Promise<ApiResponse<SKU>> {
    try {
      const response = await apiClient.post<SKU>('/sku', skuData);
      return response;
    } catch (error) {
      console.error('Error creating SKU:', error);
      throw error;
    }
  },

  // Update SKU
  async updateSKU(
    id: string,
    skuData: UpdateSKURequest
  ): Promise<ApiResponse<SKU>> {
    try {
      const response = await apiClient.put<SKU>(`/sku/${id}`, skuData);
      return response;
    } catch (error) {
      console.error(`Error updating SKU ${id}:`, error);
      throw error;
    }
  },

  // Partial update SKU
  async patchSKU(
    id: string,
    skuData: Partial<UpdateSKURequest>
  ): Promise<ApiResponse<SKU>> {
    try {
      const response = await apiClient.patch<SKU>(`/sku/${id}`, skuData);
      return response;
    } catch (error) {
      console.error(`Error patching SKU ${id}:`, error);
      throw error;
    }
  },

  // Delete SKU
  async deleteSKU(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(`/sku/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting SKU ${id}:`, error);
      throw error;
    }
  },

  // Bulk import SKUs from Excel
  async importSKUsFromExcel(
    excelData: CreateSKURequest[]
  ): Promise<ApiResponse<ImportSKUResponse>> {
    try {
      const requestData: ImportSKURequest = { data: excelData };
      const response = await apiClient.post<ImportSKUResponse>(
        '/sku/import',
        requestData
      );
      return response;
    } catch (error) {
      console.error('Error importing SKUs from Excel:', error);
      throw error;
    }
  },

  // Get SKU statistics
  async getSKUStats(): Promise<ApiResponse<SKUStatsResponse>> {
    try {
      const response = await apiClient.get<SKUStatsResponse>('/sku/stats');
      return response;
    } catch (error) {
      console.error('Error fetching SKU stats:', error);
      throw error;
    }
  },

  // Get SKUs by category
  async getSKUsByCategory(
    category: string,
    params: SKUSearchParams = {}
  ): Promise<ApiResponse<SKUListResponse>> {
    try {
      const searchParams = { ...params, category };
      const response = await apiClient.get<SKUListResponse>(
        '/sku',
        searchParams
      );
      return response;
    } catch (error) {
      console.error(`Error fetching SKUs for category ${category}:`, error);
      throw error;
    }
  },
};
