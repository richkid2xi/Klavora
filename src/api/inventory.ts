import apiClient from './client';

export const inventoryApi = {
  getItems: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) => {
    const response = await apiClient.get('/inventory', { params });
    return response.data;
  },

  getItem: async (id: string) => {
    const response = await apiClient.get(`/inventory/${id}`);
    return response.data;
  },

  createItem: async (data: {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    costPrice: number;
    reorderLevel?: number;
    unit?: string;
    description?: string;
    genericName?: string;
    barcode?: string;
  }) => {
    const response = await apiClient.post('/inventory', data);
    return response.data;
  },

  updateItem: async (id: string, data: Partial<{
    name: string;
    category: string;
    unitPrice: number;
    costPrice: number;
    reorderLevel: number;
    description: string;
  }>) => {
    const response = await apiClient.put(`/inventory/${id}`, data);
    return response.data;
  },

  deactivateItem: async (id: string) => {
    const response = await apiClient.patch(`/inventory/${id}/deactivate`);
    return response.data;
  },

  getLowStock: async () => {
    const response = await apiClient.get('/inventory/low-stock');
    return response.data;
  },

  getExpiringSoon: async (days?: number) => {
    const response = await apiClient.get('/inventory/expiring-soon', { params: { days } });
    return response.data;
  },

  searchItems: async (query: string) => {
    const response = await apiClient.get('/inventory/search', { params: { q: query } });
    return response.data;
  },

  createBatch: async (itemId: string, data: {
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    costPrice: number;
    supplierName?: string;
    notes?: string;
  }) => {
    const response = await apiClient.post(`/inventory/${itemId}/batches`, data);
    return response.data;
  },

  adjustStock: async (itemId: string, data: {
    adjustmentType: 'INCREASE' | 'DECREASE';
    quantity: number;
    reason: string;
    batchId?: string;
  }) => {
    const response = await apiClient.post(`/inventory/${itemId}/adjust`, data);
    return response.data;
  },

  getBatches: async (itemId: string) => {
    const response = await apiClient.get(`/inventory/${itemId}/batches`);
    return response.data;
  },
};

export default inventoryApi;