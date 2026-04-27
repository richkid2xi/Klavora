import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Paper,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'
import { mockInventory } from '../mock'

export const SellPage: React.FC = () => {
  const [search, setSearch] = useState('')

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Sell</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Select a drug to begin a sale
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search drug to sell..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MaterialIcon icon="search" style={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          }
        }}
      />

      <Grid container spacing={2}>
        {mockInventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(item => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {item.name}
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: item.quantity < 20 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: item.quantity < 20 ? '#F59E0B' : '#10B981',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                  }}
                >
                  {item.quantity < 20 ? 'Low Stock' : 'In Stock'}
                </Box>
              </Box>

              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: 'action.hover',
                  display: 'inline-block',
                  mb: 3,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {item.category}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    UNITS
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {item.quantity}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    FEFO EXP
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    2026-08-15
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
