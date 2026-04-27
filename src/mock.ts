// Mock data structure for Klavora pharmacy inventory system
// This file will be populated with real backend data in production

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  price: number;
  unit: string;
  category: string;
  supplier: string;
}

export interface Transaction {
  id: number;
  type: 'sale' | 'restock';
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: Date;
  customerName?: string;
  supplierName?: string;
}

export interface Stats {
  totalProducts: number;
  lowStockItems: number;
  totalRevenue: number;
  totalTransactions: number;
}

export interface StaffMember {
  id: number;
  name: string;
  initials: string;
  role: string;
  color: string;
}

export const mockPharmacies: Pharmacy[] = [
  {
    id: 1,
    name: 'Riverside Pharmacy',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(212) 555-0100',
    email: 'riverside@pharmacy.com',
  },
  {
    id: 2,
    name: 'Downtown Medical',
    address: '456 Park Ave',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    phone: '(617) 555-0200',
    email: 'downtown@pharmacy.com',
  },
];

export const mockInventory: InventoryItem[] = [
  {
    id: 1,
    name: 'Aspirin 500mg',
    sku: 'ASP-500-001',
    quantity: 150,
    minQuantity: 50,
    maxQuantity: 500,
    price: 5.99,
    unit: 'tablets',
    category: 'Pain Relief',
    supplier: 'PharmaCorp',
  },
  {
    id: 2,
    name: 'Ibuprofen 200mg',
    sku: 'IBU-200-001',
    quantity: 200,
    minQuantity: 75,
    maxQuantity: 600,
    price: 7.49,
    unit: 'tablets',
    category: 'Pain Relief',
    supplier: 'HealthMed',
  },
  {
    id: 3,
    name: 'Vitamin C 1000mg',
    sku: 'VIT-C-1000',
    quantity: 45,
    minQuantity: 100,
    maxQuantity: 400,
    price: 3.99,
    unit: 'tablets',
    category: 'Vitamins',
    supplier: 'NutraLabs',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'sale',
    itemId: 1,
    itemName: 'Aspirin 500mg',
    quantity: 5,
    unitPrice: 5.99,
    totalPrice: 29.95,
    date: new Date('2026-04-15'),
    customerName: 'John Doe',
  },
  {
    id: 2,
    type: 'restock',
    itemId: 2,
    itemName: 'Ibuprofen 200mg',
    quantity: 100,
    unitPrice: 5.50,
    totalPrice: 550.0,
    date: new Date('2026-04-14'),
    supplierName: 'HealthMed',
  },
];

export const mockStats: Stats = {
  totalProducts: 45,
  lowStockItems: 3,
  totalRevenue: 12500.50,
  totalTransactions: 284,
};

export const mockStaff: StaffMember[] = [
  {
    id: 1,
    name: 'Ama Owusu',
    initials: 'AO',
    role: 'Staff',
    color: '#26a69a',
  },
  {
    id: 2,
    name: 'Kofi Mensah',
    initials: 'KM',
    role: 'Staff',
    color: '#29b6f6',
  },
  {
    id: 3,
    name: 'Abena Asante',
    initials: 'AA',
    role: 'Staff',
    color: '#ab47bc',
  },
  {
    id: 4,
    name: 'Kwame Boateng',
    initials: 'KB',
    role: 'Staff',
    color: '#ffa726',
  },
  {
    id: 5,
    name: 'Efua Darko',
    initials: 'ED',
    role: 'Staff',
    color: '#ef5350',
  },
];
