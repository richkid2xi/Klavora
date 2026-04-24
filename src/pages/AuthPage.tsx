import React, { useState } from 'react'
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  IconButton,
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

export const AuthPage: React.FC<{ onRegisterClick: () => void }> = ({ onRegisterClick }) => {
  const { isDarkMode, toggleTheme } = useThemeContext()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleOwnerLogin = (email: string, password: string) => {
    console.log('Owner login:', email, password)
  }

  const handleDemoClick = () => {
    console.log('Demo account clicked')
  }

  const handleStaffSelect = (staffId: number, staffName: string) => {
    console.log('Staff selected:', staffId, staffName)
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Header with Theme Toggle - Absolute positioned to not interfere with centering */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={toggleTheme}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
            p: 0.8,
          }}
        >
          <MaterialIcon 
            icon={isDarkMode ? 'light_mode' : 'dark_mode'} 
            fill={isDarkMode}
            opsz={18}
            style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'inherit' }}
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
            maxWidth: 420, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          {/* Section 1: Logo */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 6, // Good space after logo
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#00a3ff',
                  width: 30,
                  height: 30,
                  borderRadius: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcon icon="medication" fill weight={600} opsz={20} style={{ color: 'white' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.01em',
                  color: 'text.primary',
                }}
              >
                Klavora
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              Accra Central Pharmacy
            </Typography>
          </Box>

          {/* Section 2: Toggle */}
          <Box sx={{ width: '100%', mb: 5 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                p: '4px',
                minHeight: 'auto',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  minHeight: 40,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    backgroundColor: 'action.hover',
                    color: 'text.primary',
                  }
                }
              }}
            >
              <Tab label="Owner Login" id="auth-tab-0" />
              <Tab label="Staff Login" id="auth-tab-1" />
            </Tabs>
          </Box>

          {/* Section 3: Card + Link */}
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                p: isMobile ? 3 : 4,
                borderRadius: 4,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
              }}
            >
              <TabPanel value={tabValue} index={0}>
                <OwnerLogin onLogin={handleOwnerLogin} onDemoClick={handleDemoClick} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <StaffSelection onStaffSelect={handleStaffSelect} />
              </TabPanel>
            </Paper>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.85rem' }}>
                New pharmacy?{' '}
                <Link 
                  component="button"
                  onClick={onRegisterClick}
                  sx={{ 
                    color: '#00a3ff', 
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                >
                  Create your account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
