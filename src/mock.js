import { authApi, inventoryApi, transactionApi, dashboardApi, alertApi } from './api';

const isProduction = import.meta.env.VITE_USE_MOCK === 'false';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const USE_MOCK = !isProduction && !API_BASE_URL.includes('localhost:3000');

export const pharmacyInfo = async () => {
  if (USE_MOCK) {
    return {
      id: '1',
      name: 'Klavora Central Pharmacy',
      address: '123 Health Street, Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      phone: '+2348012345678',
      email: 'info@klavora.com',
      licenseNumber: 'PHARM-2024-001',
      currency: 'NGN',
    };
  }
  const response = await fetch(`${API_BASE_URL}/pharmacy`);
  return response.json();
};

export const inventoryItems = async (params = {}) => {
  if (USE_MOCK) {
    return mockInventory;
  }
  const response = await fetch(`${API_BASE_URL}/inventory?page=${params.page || 1}&limit=${params.limit || 20}`);
  const data = await response.json();
  return data.data.items;
};

export const getLowStockItems = async () => {
  if (USE_MOCK) {
    return mockInventory.filter(item => item.quantity <= item.minQuantity);
  }
  const response = await fetch(`${API_BASE_URL}/inventory/low-stock`);
  const data = await response.json();
  return data.data;
};

export const getExpiringSoon = async (days = 90) => {
  if (USE_MOCK) {
    return [];
  }
  const response = await fetch(`${API_BASE_URL}/inventory/expiring-soon?days=${days}`);
  const data = await response.json();
  return data.data;
};

export const transactions = async (params = {}) => {
  if (USE_MOCK) {
    return mockTransactions;
  }
  const response = await fetch(`${API_BASE_URL}/transactions?page=${params.page || 1}&limit=${params.limit || 20}`);
  const data = await response.json();
  return data.data.items;
};

export const dashboardStats = async () => {
  if (USE_MOCK) {
    return mockStats;
  }
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  const data = await response.json();
  return data.data;
};

export const salesChartData = async (dateFrom, dateTo) => {
  if (USE_MOCK) {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        total: Math.floor(Math.random() * 10000) + 1000,
        count: Math.floor(Math.random() * 50) + 10,
      });
    }
    return data;
  }
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  const response = await fetch(`${API_BASE_URL}/dashboard/sales-chart?${params}`);
  const data = await response.json();
  return data.data;
};

export const topProducts = async (limit = 10) => {
  if (USE_MOCK) {
    return mockInventory.slice(0, limit).map(item => ({
      ...item,
      quantitySold: Math.floor(Math.random() * 100),
      revenue: item.price * Math.floor(Math.random() * 100),
    }));
  }
  const response = await fetch(`${API_BASE_URL}/dashboard/top-products?limit=${limit}`);
  const data = await response.json();
  return data.data;
};

export const alerts = async () => {
  if (USE_MOCK) {
    return [
      { id: 1, type: 'LOW_STOCK', title: 'Low Stock Alert', message: 'Vitamin C 1000mg is running low', severity: 'WARNING', status: 'UNREAD' },
      { id: 2, type: 'EXPIRY', title: 'Expiry Warning', message: 'Aspirin 500mg expires in 30 days', severity: 'INFO', status: 'UNREAD' },
    ];
  }
  const response = await fetch(`${API_BASE_URL}/alerts?status=UNREAD`);
  const data = await response.json();
  return data.data.items;
};

export const unreadAlertsCount = async () => {
  if (USE_MOCK) {
    return { count: 2 };
  }
  const response = await fetch(`${API_BASE_URL}/alerts/unread-count`);
  const data = await response.json();
  return data.data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Login failed');
  }
  
  const data = await response.json();
  if (data.data.accessToken) {
    localStorage.setItem('accessToken', data.data.accessToken);
  }
  return data;
};

export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (e) {
    console.error('Logout API error:', e);
  }
  localStorage.removeItem('accessToken');
};

export const registerPharmacy = async (data) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Registration failed');
  }
  
  return response.json();
};

// Mock data for development
export const mockPharmacies = [
  {
    id: 1,
    name: 'Klavora Central Pharmacy',
    address: '123 Health Street, Victoria Island',
    city: 'Lagos',
    state: 'Lagos',
    phone: '+2348012345678',
    email: 'info@klavora.com',
  },
];

export const mockInventory = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'PARA-500-001',
    quantity: 150,
    minQuantity: 50,
    maxQuantity: 500,
    price: 150.00,
    costPrice: 100.00,
    unit: 'tablet',
    category: 'Pain Relief',
    reorderLevel: 50,
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    sku: 'AMOX-250-001',
    quantity: 200,
    minQuantity: 30,
    maxQuantity: 600,
    price: 350.00,
    costPrice: 250.00,
    unit: 'capsule',
    category: 'Antibiotics',
    reorderLevel: 30,
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    sku: 'VITC-1000-001',
    quantity: 45,
    minQuantity: 100,
    maxQuantity: 400,
    price: 500.00,
    costPrice: 350.00,
    unit: 'tablet',
    category: 'Vitamins',
    reorderLevel: 100,
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    sku: 'IBUP-400-001',
    quantity: 80,
    minQuantity: 40,
    maxQuantity: 400,
    price: 200.00,
    costPrice: 140.00,
    unit: 'tablet',
    category: 'Pain Relief',
    reorderLevel: 40,
  },
  {
    id: '5',
    name: 'ORS Sachet',
    sku: 'ORS-001-001',
    quantity: 300,
    minQuantity: 100,
    maxQuantity: 1000,
    price: 80.00,
    costPrice: 50.00,
    unit: 'sachet',
    category: 'Hydration',
    reorderLevel: 100,
  },
];

export const mockTransactions = [
  {
    id: '1',
    type: 'SALE',
    referenceNumber: 'TXN-SL-20260505-0001',
    itemName: 'Paracetamol 500mg',
    quantity: 5,
    unitPrice: 150.00,
    totalAmount: 750.00,
    createdAt: new Date('2026-05-05'),
    customerName: 'John Doe',
    status: 'PAID',
  },
  {
    id: '2',
    type: 'SALE',
    referenceNumber: 'TXN-SL-20260504-0001',
    itemName: 'Vitamin C 1000mg',
    quantity: 2,
    unitPrice: 500.00,
    totalAmount: 1000.00,
    createdAt: new Date('2026-05-04'),
    customerName: 'Jane Smith',
    status: 'PAID',
  },
];

export const mockStats = {
  totalItems: 45,
  totalInventoryValue: 250000,
  totalRetailValue: 350000,
  todaySales: 12500,
  todayTransactions: 25,
  unreadAlerts: 3,
  lowStockCount: 2,
  outOfStockCount: 0,
};

export const mockStaff = [
  {
    id: '1',
    name: 'Ama Owusu',
    initials: 'AO',
    role: 'Pharmacist',
    color: '#26a69a',
  },
  {
    id: '2',
    name: 'Kofi Mensah',
    initials: 'KM',
    role: 'Cashier',
    color: '#29b6f6',
  },
  {
    id: '3',
    name: 'Abena Asante',
    initials: 'AA',
    role: 'Pharmacy Technician',
    color: '#ab47bc',
  },
  {
    id: '4',
    name: 'Kwame Boateng',
    initials: 'KB',
    role: 'Pharmacist',
    color: '#ffa726',
  },
  {
    id: '5',
    name: 'Efua Darko',
    initials: 'ED',
    role: 'Cashier',
    color: '#ef5350',
  },
];