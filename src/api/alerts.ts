import apiClient from './client';

export const alertApi = {
  getAlerts: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    severity?: string;
    status?: string;
  }) => {
    const response = await apiClient.get('/alerts', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/alerts/unread-count');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.patch(`/alerts/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post('/alerts/read-all');
    return response.data;
  },

  resolveAlert: async (id: string) => {
    const response = await apiClient.patch(`/alerts/${id}/resolve`);
    return response.data;
  },
};

export default alertApi;