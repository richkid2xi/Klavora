import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'
import { mockInventory } from '../mock'

export const AddInventoryPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filteredInventory = mockInventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Add Inventory</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Register new medicines and manage categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<MaterialIcon icon="add" />}
          onClick={() => setOpen(true)}
          sx={{
            py: 1.2,
            px: 3,
            borderRadius: 2,
            backgroundColor: '#0EA5E9',
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#0284C7' }
          }}
        >
          Add Medicine
        </Button>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Search inventory..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4, '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' } }}
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>
          All Medicines <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>({mockInventory.length})</Box>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', pb: 1 }} className="hide-scrollbar">
          <Button size="small" variant="contained" sx={{ borderRadius: 2, backgroundColor: '#0EA5E9', fontWeight: 700 }}>All</Button>
          {['Analgesics', 'Antacids', 'Antibiotics', 'Antidiabetics', 'Antifungals', 'Antihypertensives', 'Antimalarials', 'CNS', 'Respiratory', 'Vitamins & Supplements'].map(cat => (
            <Button key={cat} size="small" variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', color: 'text.secondary', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {cat}
            </Button>
          ))}
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Medicine</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Categories</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Form</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Qty</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Price</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                <TableCell sx={{ textAlign: 'right' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>PharmaCo GH</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" sx={{ borderRadius: 1, backgroundColor: 'action.hover', fontWeight: 600, color: 'text.secondary' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tablet</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.quantity}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>GH₵{item.price}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 800, 
                      color: item.quantity < 20 ? '#F59E0B' : '#10B981',
                      textTransform: 'uppercase'
                    }}>
                      {item.quantity < 20 ? 'Low Stock' : 'In Stock'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton size="small"><MaterialIcon icon="edit" opsz={18} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Medicine Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Medicine</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Medicine Name" placeholder="e.g. Paracetamol 500mg" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Category" placeholder="e.g. Analgesics" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Form" placeholder="e.g. Tablet" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Quantity" type="number" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Price (GH₵)" type="number" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ backgroundColor: '#0EA5E9', borderRadius: 2 }}>Add Medicine</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
