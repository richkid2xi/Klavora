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

export const RestockPage: React.FC = () => {
  const [search, setSearch] = useState('')

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Restock</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Manage and increase stock levels
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search drug to restock..."
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
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                {item.name}
              </Typography>
              
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 4 }}>
                {item.category}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {item.quantity}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  in stock
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
