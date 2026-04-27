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
import { mockInventory } from '../mock'

export const InventoryPage: React.FC = () => {
  const [search, setSearch] = useState('')

  const filteredInventory = mockInventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Inventory</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {mockInventory.length} drugs tracked
        </Typography>
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
        <Button size="small" variant="contained" sx={{ borderRadius: 4, backgroundColor: '#0EA5E9', fontWeight: 700, px: 2 }}>All</Button>
        {['Antibiotics', 'Analgesics', 'Antidiabetics', 'Antimalarials', 'Antihypertensives', 'Antacids', 'Respiratory', 'CNS', 'Antifungals', 'Vitamins & Supplements'].map(cat => (
          <Button key={cat} size="small" variant="outlined" sx={{ borderRadius: 4, borderColor: 'divider', color: 'text.secondary', fontWeight: 600, whiteSpace: 'nowrap', px: 2 }}>
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
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                <Box sx={{ 
                  px: 1, 
                  py: 0.25, 
                  borderRadius: 1, 
                  backgroundColor: item.quantity < 20 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: item.quantity < 20 ? '#F59E0B' : '#10B981',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  {item.quantity < 20 ? 'Low Stock' : 'In Stock'}
                </Box>
              </Box>

              <Box sx={{ display: 'inline-block', px: 1, py: 0.25, borderRadius: 1, backgroundColor: 'action.hover', mb: 3 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.category}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>TOTAL QTY</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{item.quantity}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>NEAREST EXPIRY</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: item.quantity < 10 ? '#EF4444' : 'text.primary' }}>2026-08-15</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
