export interface Batch {
  id: string;
  quantity: number;
  expiry: string;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Expiring Soon' | 'Out of Stock';
}

export interface Drug {
  id: string;
  name: string;
  category: string;
  categories: string[];
  dosageForm: string;
  strength: string;
  manufacturer: string;
  description?: string;
  unitPrice: number;
  batches: Batch[];
}

export interface Transaction {
  id: string;
  type: 'Sale' | 'Restock' | 'Reversal' | 'Reconciliation';
  drugId: string;
  drugName: string;
  batchId: string;
  batchExpiry: string;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  staffId: string;
  staffName: string;
  timestamp: string;
  stockBefore: number;
  stockAfter: number;
  pharmacyId: string;
  reversalReason?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: 'owner' | 'staff';
  pharmacyId: string;
  pharmacyName: string;
}

export interface Staff {
  id: string;
  name: string;
  pin: string;
  color: string;
  initials: string;
  lastActive: string;
  role: 'owner' | 'staff';
  staffRole?: 'sales' | 'restock' | 'general' | 'other';
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerEmail: string;
  ownerPassword: string;
}
