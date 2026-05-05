import apiClient from './client';

export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getSalesChart: async (params?: { dateFrom?: string; dateTo?: string }) => {
    const response = await apiClient.get('/dashboard/sales-chart', { params });
    return response.data;
  },

  getTopProducts: async (params?: {
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'quantity' | 'revenue';
  }) => {
    const response = await apiClient.get('/dashboard/top-products', { params });
    return response.data;
  },

  getRecentTransactions: async (limit?: number) => {
    const response = await apiClient.get('/dashboard/recent-transactions', { params: { limit } });
    return response.data;
  },
};

export default dashboardApi;