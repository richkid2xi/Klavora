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

export const RestockPage: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [qty, setQty] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null)

  const handleBack = () => {
    if (step > 0) setStep((prev) => (prev - 1) as 0 | 1 | 2 | 3)
  }

  if (step === 0) {
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
          sx={{ mb: 4, '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
        />

        <Grid container spacing={2}>
          {mockInventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Paper
                onClick={() => {
                  setSelectedDrug(item.name)
                  setStep(1)
                }}
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
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>{item.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 4 }}>{item.category}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{item.quantity}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>in stock</Typography>
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
        onClick={handleBack}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontWeight: 600, mb: 4, '&:hover': { color: 'text.primary' } }}
      >
        <MaterialIcon icon="arrow_back" opsz={18} />
        Back
      </ButtonBase>

      {step === 1 && (
        <Box sx={{ maxWidth: 600 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>{selectedDrug}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Is this a new delivery with a different expiry date?</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ButtonBase
              onClick={() => setStep(2)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                p: 2.5,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'left',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcon icon="add" style={{ color: '#10B981' }} opsz={20} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.2 }}>Yes — New Batch</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>New delivery with different expiry date</Typography>
              </Box>
            </ButtonBase>

            <ButtonBase
              onClick={() => alert('Add to existing batch not implemented in this demo')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 2,
                p: 2.5,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'left',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcon icon="add" style={{ color: '#0EA5E9' }} opsz={20} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.2 }}>No — Add to Existing Batch</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Top up an existing batch</Typography>
              </Box>
            </ButtonBase>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ maxWidth: 600 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>New Batch Details</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 1 }}>EXPIRY DATE</Typography>
              <TextField 
                fullWidth 
                placeholder="mm/dd/yyyy"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MaterialIcon icon="calendar_today" style={{ color: 'text.secondary' }} opsz={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 1 }}>SUPPLIER (OPTIONAL)</Typography>
              <TextField fullWidth placeholder="Supplier name" />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 1 }}>QUANTITY TO ADD</Typography>
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
                  onClick={() => setQty(qty + 1)}
                  sx={{ width: 48, height: 48, backgroundColor: 'action.hover', borderLeft: '1px solid', borderColor: 'divider', '&:hover': { backgroundColor: 'divider' } }}
                >
                  <MaterialIcon icon="add" />
                </ButtonBase>
              </Box>
            </Box>

            <Button 
              onClick={() => setStep(3)}
              fullWidth 
              variant="contained" 
              sx={{ backgroundColor: '#10B981', color: 'white', py: 1.5, borderRadius: 2, fontWeight: 700, mt: 2, '&:hover': { backgroundColor: '#059669' } }}
            >
              Review Restock
            </Button>
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box sx={{ maxWidth: 600 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>Confirm Restock</Typography>
          </Box>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Drug</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>{selectedDrug}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Type</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>New Batch</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Quantity</Typography>
                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 800 }}>+{qty} units</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Expiry</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>2028-06-09</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Supplier</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>No idea</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Staff</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>Dr. Nana Adjei</Typography>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              onClick={() => setStep(2)}
              variant="outlined" 
              sx={{ flex: 1, py: 1.5, borderRadius: 2, fontWeight: 700, borderColor: 'divider', color: 'text.secondary' }}
            >
              Back
            </Button>
            <Button 
              onClick={() => alert('Restock Confirmed!')}
              variant="contained" 
              sx={{ flex: 2, backgroundColor: '#10B981', color: 'white', py: 1.5, borderRadius: 2, fontWeight: 700, '&:hover': { backgroundColor: '#059669' } }}
            >
              Confirm Restock
            </Button>
          </Box>
        </Box>
      )}

    </Box>
  )
}
