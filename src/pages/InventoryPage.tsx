import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Grid,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

export const InventoryPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  const inventoryList = [
    { id: 1, name: 'Amoxicillin 500mg', category: 'Antibiotics', qty: 360, expiry: '2026-08-15', status: 'In Stock' },
    { id: 2, name: 'Paracetamol 500mg', category: 'Analgesics', qty: 508, expiry: '2026-05-10', status: 'Low Stock' },
    { id: 3, name: 'Metformin 850mg', category: 'Antidiabetics', qty: 240, expiry: '2026-04-28', status: 'Expiring Soon' },
    { id: 4, name: 'Artemether/Lumefantrine 20/120mg', category: 'Antimalarials', qty: 96, expiry: '2026-09-30', status: 'In Stock' },
    { id: 5, name: 'Lisinopril 10mg', category: 'Antihypertensives', qty: 12, expiry: '2026-06-15', status: 'Low Stock' },
    { id: 6, name: 'Omeprazole 20mg', category: 'Antacids', qty: 450, expiry: '2027-02-28', status: 'In Stock' },
    { id: 7, name: 'Ciprofloxacin 500mg', category: 'Antibiotics', qty: 245, expiry: '2026-04-20', status: 'In Stock' },
    { id: 8, name: 'Atorvastatin 20mg', category: 'Antihypertensives', qty: 90, expiry: '2027-04-01', status: 'In Stock' },
    { id: 9, name: 'Salbutamol Inhaler 100mcg', category: 'Respiratory', qty: 35, expiry: '2026-07-20', status: 'Low Stock' },
    { id: 10, name: 'Diazepam 5mg', category: 'CNS', qty: 200, expiry: '2027-08-15', status: 'In Stock' },
    { id: 11, name: 'Doxycycline 100mg', category: 'Antibiotics', qty: 7, expiry: '2026-05-05', status: 'Low Stock' },
    { id: 12, name: 'Ibuprofen 400mg', category: 'Analgesics', qty: 400, expiry: '2027-05-20', status: 'In Stock', highlightName: true },
    { id: 13, name: 'Zinc Sulphate 20mg', category: 'Vitamins & Supplements', qty: 600, expiry: '2027-09-01', status: 'In Stock' },
    { id: 14, name: 'ORS Sachets', category: 'Vitamins & Supplements', qty: 1000, expiry: '2028-01-01', status: 'In Stock' },
    { id: 15, name: 'Fluconazole 150mg', category: 'Antifungals', qty: 3, expiry: '2026-04-25', status: 'In Stock' },
  ]

  const filteredInventory = inventoryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeTab === 'All' || item.category === activeTab
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' }
      case 'Low Stock': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' }
      case 'Expiring Soon': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' }
      default: return { bg: 'action.hover', text: 'text.secondary' }
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'none' }}>
        {/* Hidden header since design has no header, just search bar */}
      </Box>

      <TextField
        fullWidth
        placeholder="Search drugs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MaterialIcon icon="search" style={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4, '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 4, overflowX: 'auto', pb: 1 }} className="hide-scrollbar">
        <Button 
          onClick={() => setActiveTab('All')}
          size="small" 
          variant={activeTab === 'All' ? 'contained' : 'outlined'} 
          sx={{ 
            borderRadius: 4, 
            backgroundColor: activeTab === 'All' ? '#0EA5E9' : 'transparent', 
            borderColor: activeTab === 'All' ? 'transparent' : 'divider',
            color: activeTab === 'All' ? 'white' : 'text.secondary',
            fontWeight: activeTab === 'All' ? 700 : 600, 
            px: 2,
            '&:hover': { backgroundColor: activeTab === 'All' ? '#0284C7' : 'action.hover' }
          }}
        >
          All
        </Button>
        {['Antibiotics', 'Analgesics', 'Antidiabetics', 'Antimalarials', 'Antihypertensives', 'Antacids', 'Respiratory', 'CNS', 'Antifungals', 'Vitamins & Supplements'].map(cat => (
          <Button 
            key={cat} 
            onClick={() => setActiveTab(cat)}
            size="small" 
            variant={activeTab === cat ? 'contained' : 'outlined'} 
            sx={{ 
              borderRadius: 4, 
              backgroundColor: activeTab === cat ? '#0EA5E9' : 'transparent', 
              borderColor: activeTab === cat ? 'transparent' : 'divider',
              color: activeTab === cat ? 'white' : 'text.secondary', 
              fontWeight: activeTab === cat ? 700 : 600, 
              whiteSpace: 'nowrap', 
              px: 2,
              '&:hover': { backgroundColor: activeTab === cat ? '#0284C7' : 'action.hover' }
            }}
          >
            {cat}
          </Button>
        ))}
      </Box>

      <Grid container spacing={2}>
        {filteredInventory.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: item.highlightName ? '#0EA5E9' : 'text.primary' }}>{item.name}</Typography>
                <Box sx={{ 
                  px: 1, 
                  py: 0.25, 
                  borderRadius: 1, 
                  backgroundColor: getStatusColor(item.status).bg,
                  color: getStatusColor(item.status).text,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  {item.status}
                </Box>
              </Box>

              <Box sx={{ display: 'inline-block', px: 1, py: 0.25, borderRadius: 1, backgroundColor: 'action.hover', mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.category}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>TOTAL QTY</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>{item.qty}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>NEAREST EXPIRY</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: (item.status === 'Expiring Soon' || item.expiry < '2026-06') ? '#EF4444' : 'text.secondary' }}>{item.expiry}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
