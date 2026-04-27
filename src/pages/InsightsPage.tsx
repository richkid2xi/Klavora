import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  LinearProgress,
  Avatar,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

export const InsightsPage: React.FC = () => {
  const [period, setPeriod] = React.useState('30')

  const topSelling = [
    { name: 'Zinc Sulphate 20mg', sales: 100, color: '#0EA5E9' },
    { name: 'ORS Sachets', sales: 50, color: '#0EA5E9' },
    { name: 'Paracetamol 500mg', sales: 40, color: '#0EA5E9' },
    { name: 'Diazepam 5mg', sales: 30, color: '#0EA5E9' },
    { name: 'Lisinopril 10mg', sales: 20, color: '#0EA5E9' },
    { name: 'Ciprofloxacin 500mg', sales: 20, color: '#0EA5E9' },
    { name: 'Atorvastatin 20mg', sales: 15, color: '#0EA5E9' },
    { name: 'Salbutamol Inhaler 100mcg', sales: 2, color: '#0EA5E9' },
  ]

  const slowMovers = [
    { name: 'Amoxicillin 500mg', units: '360 units', note: 'No sales this period' },
    { name: 'Metformin 850mg', units: '240 units', note: 'No sales this period' },
    { name: 'Artemether/Lumefantrine 20/120mg', units: '96 units', note: 'No sales this period' },
    { name: 'Omeprazole 20mg', units: '450 units', note: 'No sales this period' },
    { name: 'Doxycycline 100mg', units: '7 units', note: 'No sales this period' },
    { name: 'Ibuprofen 400mg', units: '400 units', note: 'No sales this period' },
    { name: 'Fluconazole 150mg', units: '3 units', note: 'No sales this period' },
  ]

  const staffActivity = [
    { name: 'Ama Owusu', sales: 3 },
    { name: 'Kofi Mensah', sales: 2 },
    { name: 'Abena Asante', sales: 2 },
    { name: 'Kwame Boateng', sales: 1 },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Insights</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {period === '30' ? '10 sales in the last 30 days' : '8 sales in the last 7 days'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, backgroundColor: 'background.paper', p: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Button 
            size="small" 
            variant={period === '7' ? 'contained' : 'text'} 
            onClick={() => setPeriod('7')}
            sx={{ 
              backgroundColor: period === '7' ? '#1F2937' : 'transparent', 
              color: period === '7' ? 'white' : 'text.secondary',
              px: 2,
              '&:hover': { backgroundColor: period === '7' ? '#374151' : 'action.hover' }
            }}
          >
            7 Days
          </Button>
          <Button 
            size="small" 
            variant={period === '30' ? 'contained' : 'text'} 
            onClick={() => setPeriod('30')}
            sx={{ 
              backgroundColor: period === '30' ? '#1F2937' : 'transparent', 
              color: period === '30' ? 'white' : 'text.secondary',
              px: 2,
              '&:hover': { backgroundColor: period === '30' ? '#374151' : 'action.hover' }
            }}
          >
            30 Days
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'TOTAL SALES', value: period === '30' ? '10' : '8', icon: 'shopping_bag', color: '#0EA5E9' },
          { label: 'UNITS SOLD', value: period === '30' ? '316' : '277', icon: 'layers', color: '#10B981' },
          { label: 'RESTOCKS', value: period === '30' ? '2' : '0', icon: 'refresh', color: '#F59E0B' },
          { label: 'ACTIVE STAFF', value: period === '30' ? '6' : '4', icon: 'groups', color: '#6366F1' },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>{stat.label}</Typography>
                <Box sx={{ p: 0.5, backgroundColor: 'action.hover', borderRadius: 1 }}>
                  <MaterialIcon icon={stat.icon} style={{ color: 'text.secondary' }} opsz={18} fill />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Top Selling Drugs */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <MaterialIcon icon="bar_chart" style={{ color: '#0EA5E9' }} />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Top Selling Drugs</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
              {topSelling.map((item, i) => (
                <Box key={i}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{i + 1} {item.name}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>{item.sales}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(item.sales / 100) * 100} 
                    sx={{ height: 6, borderRadius: 3, backgroundColor: 'action.hover', '& .MuiLinearProgress-bar': { backgroundColor: '#0EA5E9' } }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Slow Movers */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <MaterialIcon icon="schedule" style={{ color: '#F59E0B' }} />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Slow Movers</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
              {slowMovers.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block' }}>{i + 1} {item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.note}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#F59E0B' }}>{item.units}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Busiest Hours */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <MaterialIcon icon="analytics" style={{ color: '#10B981' }} />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Busiest Hours</Typography>
            </Box>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', px: 2, pt: 4 }}>
              {[20, 60, 90, 80, 40, 30, 45, 45].map((h, i) => (
                <Box key={i} sx={{ width: 14, height: `${h}%`, backgroundColor: i === 2 || i === 3 ? '#0EA5E9' : '#1F2937', borderRadius: '4px 4px 0 0' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>6h</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>9h</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>12h</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>15h</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>21h</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Staff Activity */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <MaterialIcon icon="person" style={{ color: '#6366F1' }} />
          <Typography variant="body1" sx={{ fontWeight: 700 }}>Staff Activity</Typography>
        </Box>
        <Grid container spacing={3}>
          {staffActivity.map((staff, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'action.hover', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366F110', color: '#6366F1' }}>
                  <MaterialIcon icon="person" opsz={18} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: 'text.primary' }}>{staff.name}</Typography>
                  <LinearProgress variant="determinate" value={(staff.sales / 3) * 100} sx={{ height: 4, borderRadius: 2, mt: 0.5, backgroundColor: 'divider', '& .MuiLinearProgress-bar': { backgroundColor: '#6366F1' } }} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 800 }}>{staff.sales}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  )
}
