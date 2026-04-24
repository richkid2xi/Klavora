import React, { useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from './styles/theme'
import { ThemeProvider as CustomThemeProvider, useThemeContext } from './contexts/ThemeContext'
import { AuthPage } from './pages/AuthPage'
import { RegisterPage } from './pages/RegisterPage'

function AppContent() {
  const { isDarkMode } = useThemeContext()
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode])
  const [view, setView] = useState<'login' | 'register'>('login')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {view === 'login' ? (
        <AuthPage onRegisterClick={() => setView('register')} />
      ) : (
        <RegisterPage onBackToLogin={() => setView('login')} />
      )}
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
