import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Button
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

export const SalesMetricsPage: React.FC = () => {
  const [period, setPeriod] = useState('7 Days')

  const topSelling = [
    { name: 'Atorvastatin 20mg', details: '15 units · 1 transactions', revenue: 'GH₵84.00', value: 100 },
    { name: 'Lisinopril 10mg', details: '20 units · 1 transactions', revenue: 'GH₵82.00', value: 95 },
    { name: 'Ciprofloxacin 500mg', details: '20 units · 1 transactions', revenue: 'GH₵70.00', value: 85 },
    { name: 'Zinc Sulphate 20mg', details: '100 units · 1 transactions', revenue: 'GH₵60.00', value: 75 },
    { name: 'Diazepam 5mg', details: '30 units · 1 transactions', revenue: 'GH₵54.00', value: 65 },
    { name: 'Paracetamol 500mg', details: '40 units · 1 transactions', revenue: 'GH₵32.00', value: 40 },
    { name: 'Salbutamol Inhaler 100mcg', details: '2 units · 1 transactions', revenue: 'GH₵24.00', value: 30 },
  ]

  const staffPerformance = [
    { name: 'Abena Asante', details: '45 units · 2 sales', revenue: 'GH₵138.00', rank: 1, initial: 'AA' },
    { name: 'Ama Owusu', details: '22 units · 2 sales', revenue: 'GH₵106.00', rank: 2, initial: 'AO' },
    { name: 'Kofi Mensah', details: '60 units · 2 sales', revenue: 'GH₵102.00', rank: 3, initial: 'KM' },
    { name: 'Kwame Boateng', details: '100 units · 1 sales', revenue: 'GH₵60.00', rank: 4, initial: 'KB' },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>Sales Metrics</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Revenue and performance overview
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, backgroundColor: 'background.paper', p: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          {['Today', '7 Days', '30 Days'].map((p) => (
            <Button 
              key={p}
              onClick={() => setPeriod(p)}
              size="small" 
              variant={period === p ? 'contained' : 'text'} 
              sx={{ 
                backgroundColor: period === p ? '#0EA5E9' : 'transparent', 
                color: period === p ? 'white' : 'text.secondary', 
                px: 2, 
                '&:hover': { backgroundColor: period === p ? '#0284C7' : 'action.hover' } 
              }}
            >
              {p}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Top Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL REVENUE</Typography>
              <MaterialIcon icon="adjust" style={{ color: '#0EA5E9' }} opsz={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: '#0EA5E9' }}>GH₵406.00</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Last 7 Days</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>UNITS SOLD</Typography>
              <MaterialIcon icon="layers" style={{ color: '#10B981' }} opsz={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: '#10B981' }}>227</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Dispensed</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>TRANSACTIONS</Typography>
              <MaterialIcon icon="receipt_long" style={{ color: '#F59E0B' }} opsz={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>7</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Sales recorded</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>AVG ORDER VALUE</Typography>
              <MaterialIcon icon="bar_chart" style={{ color: '#EF4444' }} opsz={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>GH₵58.00</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Per transaction</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts Placeholder */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>Revenue</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last 7 Days</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0EA5E9' }}>GH₵406.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>21 Apr</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>27 Apr</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>Units Sold</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Last 7 Days</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10B981' }}>227</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>21 Apr</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>27 Apr</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Lists */}
      <Grid container spacing={3}>
        {/* Top Selling Drugs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>Top Selling Drugs</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>By revenue · Last 7 Days</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topSelling.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', width: 16 }}>{i + 1}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.revenue}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>{item.details}</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.value} 
                      sx={{ height: 4, borderRadius: 2, backgroundColor: 'action.hover', '& .MuiLinearProgress-bar': { backgroundColor: '#0EA5E9' } }} 
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Staff Performance */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>Staff Performance</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Revenue by staff · Last 7 Days</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {staffPerformance.map((staff, i) => (
                <Box key={i} sx={{ p: 2, borderRadius: 2, backgroundColor: 'action.hover', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 24, textAlign: 'center' }}>
                    {staff.rank <= 3 ? (
                      <MaterialIcon icon="workspace_premium" style={{ color: staff.rank === 1 ? '#F59E0B' : staff.rank === 2 ? '#94A3B8' : '#D97706', fontSize: 20 }} />
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>{staff.rank}</Typography>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{staff.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{staff.details}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0EA5E9' }}>{staff.revenue}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
