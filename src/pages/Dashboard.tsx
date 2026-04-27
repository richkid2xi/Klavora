import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  ButtonBase,
  Button,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

interface DashboardProps {
  user: { name: string; role: string }
  onLogout: () => void
}

export const Dashboard: React.FC<DashboardProps> = ({ user: _user, onLogout: _onLogout }) => {
  const [activeAlertTab, setActiveAlertTab] = useState(0)

  const stats = [
    { label: 'TOTAL DRUGS', value: '15', sub: 'Drug types tracked', icon: 'medication', color: '#0EA5E9' },
    { label: 'TOTAL UNITS', value: '4,246', sub: 'Units in stock', icon: 'layers', color: '#10B981' },
    { label: 'LOW STOCK', value: '5', sub: 'Drugs need restocking', icon: 'warning', color: '#F59E0B' },
    { label: 'EXPIRING SOON', value: '5', sub: 'Batches within 30 days', icon: 'schedule', color: '#EF4444' },
  ]

  const alerts = [
    { name: 'Paracetamol 500mg', units: '8 units', exp: 'Exp 2026-05-10', status: 'Low Stock' },
    { name: 'Artemether/Lumefantrine 20/120mg', units: '0 units', exp: 'Exp 2025-12-01', status: 'Out of Stock' },
    { name: 'Lisinopril 10mg', units: '12 units', exp: 'Exp 2026-06-15', status: 'Low Stock' },
    { name: 'Salbutamol Inhaler 100mcg', units: '5 units', exp: 'Exp 2026-07-20', status: 'Low Stock' },
    { name: 'Doxycycline 100mg', units: '7 units', exp: 'Exp 2026-08-05', status: 'Low Stock' },
  ]

  const activity = [
    { type: 'Sale', name: 'Amoxicillin 500mg', detail: '+38 units · Ama Owusu', time: '4d ago' },
    { type: 'Sale', name: 'Paracetamol 500mg', detail: '+20 units · Kofi Mensah', time: '4d ago' },
    { type: 'Restock', name: 'Lisinopril 10mg', detail: '+50 units · Dr. Nana Adjei', time: '4d ago' },
    { type: 'Sale', name: 'Artemether/Lumefantrine 20/120mg', detail: '+12 units · Abena Asante', time: '5d ago' },
    { type: 'Sale', name: 'Metformin 850mg', detail: '+30 units · Ama Owusu', time: '5d ago' },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Accra Central Pharmacy · Monday, 27 April 2026
          </Typography>
        </Box>
      </Box>

      {/* Payment Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MaterialIcon icon="error_outline" style={{ color: '#F59E0B' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#F59E0B' }}>
            Your next payment is in 14 days. Renew via MoMo.
          </Typography>
        </Box>
        <Button size="small" sx={{ color: '#F59E0B', fontWeight: 700, textTransform: 'none' }}>Dismiss</Button>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column: Stats and Alerts */}
        <Grid item xs={12} md={8.5}>
          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>
                      {stat.label}
                    </Typography>
                    <Box sx={{ p: 0.5, backgroundColor: 'action.hover', borderRadius: 1 }}>
                      <MaterialIcon icon={stat.icon} style={{ color: 'text.secondary' }} opsz={18} fill />
                    </Box>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{stat.sub}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Alerts Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>Alerts</Typography>
            
            <Box sx={{ display: 'flex', gap: 4, mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              {[
                { label: 'Low Stock', count: 5 },
                { label: 'Expiring Soon', count: 3 }
              ].map((tab, i) => (
                <ButtonBase
                  key={tab.label}
                  onClick={() => setActiveAlertTab(i)}
                  sx={{
                    pb: 1.5,
                    color: activeAlertTab === i ? '#F59E0B' : 'text.secondary',
                    borderBottom: '2px solid',
                    borderColor: activeAlertTab === i ? '#F59E0B' : 'transparent',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  {tab.label} <Box component="span" sx={{ ml: 1, color: activeAlertTab === i ? '#F59E0B' : 'text.secondary', opacity: 0.7 }}>{tab.count}</Box>
                </ButtonBase>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {alerts.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                    borderBottom: i === alerts.length - 1 ? 'none' : '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.2, color: 'text.primary' }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {item.units} · <Box component="span" sx={{ color: 'text.secondary', opacity: 0.7 }}>{item.exp}</Box>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        backgroundColor: item.status === 'Out of Stock' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: item.status === 'Out of Stock' ? '#EF4444' : '#F59E0B',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.status}
                    </Box>
                    <ButtonBase sx={{ color: '#0EA5E9', fontWeight: 700, fontSize: '0.8rem', '&:hover': { textDecoration: 'underline' } }}>
                      Restock
                    </ButtonBase>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Recent Activity */}
        <Grid item xs={12} md={3.5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>Recent Activity</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {activity.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.2,
                        borderRadius: 1,
                        backgroundColor: item.type === 'Sale' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: item.type === 'Sale' ? '#0EA5E9' : '#10B981',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        mb: 1,
                      }}
                    >
                      {item.type}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.2, color: 'text.primary' }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {item.detail}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}>{item.time}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
