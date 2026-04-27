import { useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from './styles/theme'
import { ThemeProvider as CustomThemeProvider, useThemeContext } from './contexts/ThemeContext'
import { AuthPage } from './pages/AuthPage'
import { RegisterPage } from './pages/RegisterPage'
import { Dashboard } from './pages/Dashboard'
import { InventoryPage } from './pages/InventoryPage'
import { SellPage } from './pages/SellPage'
import { RestockPage } from './pages/RestockPage'
import { AddInventoryPage } from './pages/AddInventoryPage'
import { InsightsPage } from './pages/InsightsPage'
import { StaffPage } from './pages/StaffPage'
import { SettingsPage } from './pages/SettingsPage'
import { AuditLogPage } from './pages/AuditLogPage'
import { SalesMetricsPage } from './pages/SalesMetricsPage'
import { MainLayout } from './components/MainLayout'

function AppContent() {
  const { isDarkMode } = useThemeContext()
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode])
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  const handleLoginSuccess = (name: string, role: string) => {
    setUser({ name, role })
  }

  const handleLogout = () => {
    setUser(null)
    setActivePage('dashboard')
  }

  const renderContent = () => {
    if (isRegistering) {
      return <RegisterPage onBackToLogin={() => setIsRegistering(false)} />
    }

    if (!user) {
      return <AuthPage onLoginSuccess={handleLoginSuccess} onRegisterClick={() => setIsRegistering(true)} />
    }

    const renderPage = () => {
      switch (activePage) {
        case 'dashboard':
          return <Dashboard user={user} onLogout={handleLogout} />
        case 'inventory':
          return <InventoryPage />
        case 'sell':
          return <SellPage />
        case 'restock':
          return <RestockPage />
        case 'add-inventory':
          return <AddInventoryPage />
        case 'insights':
          return <InsightsPage />
        case 'audit-log':
          return <AuditLogPage />
        case 'sales-metrics':
          return <SalesMetricsPage />
        case 'staff':
          return <StaffPage />
        case 'settings':
          return <SettingsPage />
        default:
          return <Dashboard user={user} onLogout={handleLogout} />
      }
    }

    return (
      <MainLayout 
        user={user} 
        onLogout={handleLogout} 
        activePage={activePage} 
        onPageChange={setActivePage}
      >
        {renderPage()}
      </MainLayout>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderContent()}
    </ThemeProvider>
  )
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  )
}

export default App
