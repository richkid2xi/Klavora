import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme as useMuiTheme,
  Link,
} from '@mui/material'
import { useThemeContext } from '../contexts/ThemeContext'
import { OwnerLogin } from '../components/OwnerLogin'
import { StaffSelection } from '../components/StaffSelection'
import { MaterialIcon } from '../components/MaterialIcon'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 0.5 }}>{children}</Box>}
    </div>
  )
}

export const AuthPage: React.FC<{ 
  onRegisterClick: () => void;
  onLoginSuccess: (name: string, role: string) => void;
}> = ({ onRegisterClick, onLoginSuccess }) => {
  const { isDarkMode, toggleTheme } = useThemeContext()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [tabValue, setTabValue] = useState(0)

  const handleOwnerLogin = (email: string, password: string) => {
    if (email && password) {
      onLoginSuccess('Pharmacy Owner', 'Administrator')
    }
  }

  const handleDemoClick = () => {
    onLoginSuccess('Demo Owner', 'Administrator')
  }

  const handleStaffSelect = (_staffId: number, staffName: string) => {
    onLoginSuccess(staffName, 'Staff')
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDarkMode ? 'background.default' : '#EEF2F6',
        backgroundImage: isDarkMode 
          ? 'radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.1) 0, transparent 50%)'
          : 'radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.05) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.05) 0, transparent 50%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header with Theme Toggle */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 1,
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <MaterialIcon 
            icon={isDarkMode ? 'light_mode' : 'dark_mode'} 
            fill={isDarkMode}
            opsz={20} 
          />
        </IconButton>
      </Box>

      {/* Main Centered Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: 440, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                backgroundColor: '#0EA5E9',
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
              }}
            >
              <MaterialIcon icon="medication" fill weight={600} opsz={28} style={{ color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              Klavora
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Accra Central Pharmacy
            </Typography>
          </Box>

          {/* Segmented Tabs */}
          <Box 
            sx={{ 
              width: '100%', 
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
              borderRadius: 4,
              p: 0.75,
              mb: 4,
              display: 'flex',
              gap: 0.5,
            }}
          >
            <Button
              fullWidth
              onClick={() => setTabValue(0)}
              sx={{
                borderRadius: 3.5,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: tabValue === 0 ? 'background.paper' : 'transparent',
                color: tabValue === 0 ? 'text.primary' : 'text.secondary',
                boxShadow: tabValue === 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                '&:hover': {
                  backgroundColor: tabValue === 0 ? 'background.paper' : 'rgba(0,0,0,0.02)',
                }
              }}
            >
              Owner Login
            </Button>
            <Button
              fullWidth
              onClick={() => setTabValue(1)}
              sx={{
                borderRadius: 3.5,
                py: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: tabValue === 1 ? 'background.paper' : 'transparent',
                color: tabValue === 1 ? 'text.primary' : 'text.secondary',
                boxShadow: tabValue === 1 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                '&:hover': {
                  backgroundColor: tabValue === 1 ? 'background.paper' : 'rgba(0,0,0,0.02)',
                }
              }}
            >
              Staff Login
            </Button>
          </Box>

          <Box sx={{ width: '100%', mb: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center',
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              New pharmacy?{' '}
              <Link 
                component="button"
                onClick={onRegisterClick}
                sx={{ 
                  color: '#0EA5E9', 
                  fontWeight: 700,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Create your account &rarr;
              </Link>
            </Typography>
          </Box>

          {/* Form Card */}
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: isMobile ? 3 : 4,
              borderRadius: 6,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
            }}
          >
            <TabPanel value={tabValue} index={0}>
              <OwnerLogin onLogin={handleOwnerLogin} onDemoClick={handleDemoClick} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <StaffSelection onStaffSelect={handleStaffSelect} />
            </TabPanel>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
