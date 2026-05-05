import apiClient from './client';

export const transactionApi = {
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  },

  getTransaction: async (id: string) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: {
    type: 'SALE' | 'PURCHASE' | 'RETURN' | 'ADJUSTMENT';
    items: {
      inventoryItemId: string;
      quantity: number;
      unitPrice: number;
      costPrice: number;
      discount?: number;
      tax?: number;
    }[];
    paymentMethod?: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'INSURANCE';
    customerName?: string;
    customerPhone?: string;
    notes?: string;
  }) => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  updatePaymentStatus: async (id: string, status: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED') => {
    const response = await apiClient.patch(`/transactions/${id}/payment`, { status });
    return response.data;
  },

  voidTransaction: async (id: string) => {
    const response = await apiClient.post(`/transactions/${id}/void`);
    return response.data;
  },

  getRecent: async (limit?: number) => {
    const response = await apiClient.get('/transactions/recent', { params: { limit } });
    return response.data;
  },
};

export default transactionApi;