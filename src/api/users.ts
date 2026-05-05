import apiClient from './client';

export const userApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'PHARMACIST' | 'CASHIER' | 'VIEWER';
    phone?: string;
  }) => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
  }) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await apiClient.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  activateUser: async (id: string) => {
    const response = await apiClient.patch(`/users/${id}/activate`);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/users/me/password', { currentPassword, newPassword });
    return response.data;
  },
};

export default userApi;