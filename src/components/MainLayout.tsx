import React, { useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme as useMuiTheme,
  ButtonBase,
} from '@mui/material'
import { MaterialIcon } from './MaterialIcon'
import { useThemeContext } from '../contexts/ThemeContext'

interface MainLayoutProps {
  children: React.ReactNode
  user: { name: string; role: string }
  onLogout: () => void
  activePage: string
  onPageChange: (page: string) => void
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  activePage, 
  onPageChange 
}) => {
  const { isDarkMode, toggleTheme } = useThemeContext()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
    { id: 'sell', label: 'Sell', icon: 'shopping_cart' },
    { id: 'restock', label: 'Restock', icon: 'add_business' },
    { id: 'add-inventory', label: 'Add Inventory', icon: 'add_box' },
    { id: 'insights', label: 'Insights', icon: 'analytics' },
    { id: 'audit-log', label: 'Audit Log', icon: 'history_edu' },
    { id: 'sales-metrics', label: 'Sales Metrics', icon: 'trending_up' },
    { id: 'staff', label: 'Staff', icon: 'groups' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handlePageClick = (id: string) => {
    onPageChange(id)
    if (isMobile) setMobileOpen(false)
  }

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6, px: 1 }}>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            width: 32,
            height: 32,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcon icon="medication" fill weight={600} opsz={20} style={{ color: 'white' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Klavora
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ButtonBase
            key={item.id}
            onClick={() => handlePageClick(item.id)}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              mb: 0.5,
              color: activePage === item.id ? 'primary.main' : 'text.secondary',
              backgroundColor: activePage === item.id ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundColor: activePage === item.id ? 'rgba(14, 165, 233, 0.15)' : 'action.hover',
                color: 'text.primary',
              }
            }}
          >
            <MaterialIcon icon={item.icon} fill={activePage === item.id} opsz={20} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
          </ButtonBase>
        ))}
      </Box>

      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
        <Box sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 2, mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.2, color: 'text.primary' }}>{user.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { label: isDarkMode ? 'Light Mode' : 'Dark Mode', icon: isDarkMode ? 'light_mode' : 'dark_mode', action: toggleTheme },
            { label: 'Sign Out', icon: 'logout', action: onLogout },
          ].map((item) => (
            <ButtonBase
              key={item.label}
              onClick={item.action}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1,
                px: 2,
                color: 'text.secondary',
                justifyContent: 'flex-start',
                borderRadius: 1,
                '&:hover': { backgroundColor: 'action.hover', color: 'text.primary' }
              }}
            >
              <MaterialIcon icon={item.icon} opsz={18} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.label}</Typography>
            </ButtonBase>
          ))}
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'background.default', overflow: 'hidden' }}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Box sx={{ width: 260, backgroundColor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }}>
          {sidebarContent}
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 260, backgroundColor: 'background.paper', backgroundImage: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile Header */}
        {isMobile && (
          <Box
            sx={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.primary', mr: 2 }}>
              <MaterialIcon icon="menu" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>Klavora</Typography>
          </Box>
        )}

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 6 } }} className="custom-scrollbar">
          {children}
        </Box>
      </Box>
    </Box>
  )
}
