import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  ButtonBase,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'
import { mockInventory } from '../mock'

export const SellPage: React.FC = () => {
  const [qty, setQty] = useState(1)
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  if (!selectedDrug) {
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
          sx={{ mb: 4, '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
        />

        <Grid container spacing={2}>
          {mockInventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Paper
                onClick={() => setSelectedDrug(item.name)}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.name}</Typography>
                  <Box sx={{ px: 1, py: 0.25, borderRadius: 1, backgroundColor: item.quantity < 20 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: item.quantity < 20 ? '#F59E0B' : '#10B981', fontSize: '0.65rem', fontWeight: 800 }}>
                    {item.quantity < 20 ? 'Low Stock' : 'In Stock'}
                  </Box>
                </Box>
                <Box sx={{ px: 1, py: 0.25, borderRadius: 1, backgroundColor: 'action.hover', display: 'inline-block', mb: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.category}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>UNITS</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{item.quantity}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>FEFO EXP</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>2026-08-15</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <Box>
      <ButtonBase 
        onClick={() => setSelectedDrug(null)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontWeight: 600, mb: 4, '&:hover': { color: 'text.primary' } }}
      >
        <MaterialIcon icon="arrow_back" opsz={18} />
        Back to drug list
      </ButtonBase>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>Amoxicillin 500mg</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Antibiotics</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Sell Action */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            
            {/* Selected Batch Card */}
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 2 }}>
              FEFO BATCH (AUTO-SELECTED)
            </Typography>
            <Box sx={{ p: 2.5, borderRadius: 2, backgroundColor: 'action.hover', border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'monospace', mb: 0.5 }}>batch-001a</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>Exp 2026-08-15</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>PharmaCo GH</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>240</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>available</Typography>
              </Box>
            </Box>

            {/* Quantity */}
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 2 }}>
              QUANTITY
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <ButtonBase 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  sx={{ width: 48, height: 48, backgroundColor: 'action.hover', borderRight: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'divider' } }}
                >
                  <MaterialIcon icon="remove" />
                </ButtonBase>
                <Box sx={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{qty}</Typography>
                </Box>
                <ButtonBase 
                  onClick={() => setQty(Math.min(240, qty + 1))}
                  sx={{ width: 48, height: 48, backgroundColor: 'action.hover', borderLeft: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'divider' } }}
                >
                  <MaterialIcon icon="add" />
                </ButtonBase>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mt: 1, textAlign: 'center' }}>
                Max: 240
              </Typography>
            </Box>

            {/* Pricing */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Unit Price</Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>GH¢2.50</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 800 }}>Total</Typography>
              <Typography variant="body1" sx={{ color: '#0EA5E9', fontWeight: 800 }}>GH¢{(2.50 * qty).toFixed(2)}</Typography>
            </Box>

            <Button fullWidth variant="contained" sx={{ backgroundColor: '#0EA5E9', color: 'white', py: 1.5, borderRadius: 2, fontWeight: 700, '&:hover': { backgroundColor: '#0284C7' } }}>
              Continue to Confirm
            </Button>
          </Paper>
        </Grid>

        {/* Right Column - Batches */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>All Batches</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 4 }}>Sorted by FEFO (earliest expiry first)</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, borderRadius: 2, backgroundColor: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'monospace' }}>batch-001a</Typography>
                    <Box sx={{ backgroundColor: '#0EA5E9', color: 'white', px: 0.75, py: 0.25, borderRadius: 1, fontSize: '0.6rem', fontWeight: 800 }}>FEFO</Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Exp 2026-08-15</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>240</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>PharmaCo GH</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'monospace', mb: 0.5 }}>batch-001b</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Exp 2026-12-20</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>120</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>MedSupply Ltd</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
