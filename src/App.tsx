import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/layout/AppShell';

// Pages
import DashboardPage from '@/pages/dashboard/page';
import InventoryPage from '@/pages/inventory/page';
import AddInventoryPage from '@/pages/add-inventory/page';
import SellPage from '@/pages/sell/page';
import RestockPage from '@/pages/restock/page';
import SalesMetricsPage from '@/pages/sales-metrics/page';
import StaffPage from '@/pages/staff/page';
import SettingsPage from '@/pages/settings/page';
import SignInPage from '@/pages/signin/page';
import SignUpPage from '@/pages/signup/page';
import ForgotPasswordPage from '@/pages/forgot-password/page';
import AuditLogPage from '@/pages/audit-log/page';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes wrapped in AppShell */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/add-inventory" element={<AddInventoryPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/restock" element={<RestockPage />} />
            <Route path="/sales-metrics" element={<SalesMetricsPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
