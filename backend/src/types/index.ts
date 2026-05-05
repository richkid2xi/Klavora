import { UserRole, TransactionType, AlertType, AlertSeverity } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  pharmacyId: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  pharmacyId?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
}

export interface CreateInventoryItemInput {
  name: string;
  genericName?: string;
  sku: string;
  barcode?: string;
  category: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  reorderLevel?: number;
  unit?: string;
}

export interface UpdateInventoryItemInput {
  name?: string;
  genericName?: string;
  category?: string;
  description?: string;
  unitPrice?: number;
  costPrice?: number;
  reorderLevel?: number;
  unit?: string;
}

export interface CreateBatchInput {
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  costPrice: number;
  supplierName?: string;
  notes?: string;
}

export interface StockAdjustmentInput {
  adjustmentType: 'INCREASE' | 'DECREASE';
  quantity: number;
  reason: string;
  batchId?: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
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
}

export interface DashboardStats {
  totalItems: number;
  totalInventoryValue: number;
  totalRetailValue: number;
  todaySales: number;
  todayTransactions: number;
  unreadAlerts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface SalesChartData {
  date: string;
  total: number;
  count: number;
}

export interface CreateAlertInput {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  inventoryItemId?: string;
  batchId?: string;
  metadata?: Record<string, unknown>;
}

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  type?: string;
}