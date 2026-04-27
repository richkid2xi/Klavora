import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

export const StaffPage: React.FC = () => {
  const [open, setOpen] = useState(false)

  const staffMembers = [
    { name: 'Ama Owusu', initial: 'AO', active: '2d ago', salesToday: 0, unitsToday: 0, allTime: 182, lastAction: 'Salbutamol Inhaler 100mcg', lastActionDetails: '2 units · 2d ago', color: '#10B981' },
    { name: 'Kofi Mensah', initial: 'KM', active: '2d ago', salesToday: 0, unitsToday: 0, allTime: 170, lastAction: 'Paracetamol 500mg', lastActionDetails: '43 units · 2d ago', color: '#0EA5E9' },
    { name: 'Abena Asante', initial: 'AA', active: '2d ago', salesToday: 0, unitsToday: 0, allTime: 81, lastAction: 'Atorvastatin 20mg', lastActionDetails: '15 units · 2d ago', color: '#8B5CF6' },
    { name: 'Kwame Boateng', initial: 'KB', active: '3d ago', salesToday: 0, unitsToday: 0, allTime: 130, lastAction: 'Zinc Sulphate 20mg', lastActionDetails: '100 units · 3d ago', color: '#F59E0B' },
    { name: 'Efua Darko', initial: 'ED', active: '7d ago', salesToday: 0, unitsToday: 0, allTime: 75, lastAction: 'Omeprazole 20mg', lastActionDetails: '45 units · 7d ago', color: '#EF4444' },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>Staff</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            5 staff members
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<MaterialIcon icon="add" />}
          sx={{
            py: 1,
            px: 2.5,
            borderRadius: 2,
            backgroundColor: '#0EA5E9',
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { backgroundColor: '#0284C7' }
          }}
          onClick={() => setOpen(true)}
        >
          Add Staff
        </Button>
      </Box>

      {/* Top Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>SALES TODAY</Typography>
              <MaterialIcon icon="shopping_bag" style={{ color: '#0EA5E9' }} opsz={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>0</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>transactions across all staff</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>UNITS SOLD TODAY</Typography>
              <MaterialIcon icon="layers" style={{ color: '#10B981' }} opsz={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>0</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>units dispensed today</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em' }}>TOP PERFORMER</Typography>
              <MaterialIcon icon="emoji_events" style={{ color: '#F59E0B' }} opsz={20} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#10B981', fontSize: '0.75rem', fontWeight: 700 }}>AO</Avatar>
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>Ama Owusu</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>182 units all time</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Staff Grid */}
      <Grid container spacing={3}>
        {staffMembers.map((staff, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: staff.color, fontWeight: 700 }}>{staff.initial}</Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {staff.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Last active {staff.active}</Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => alert(`Delete ${staff.name}?`)} size="small"><MaterialIcon icon="delete_outline" opsz={20} style={{ color: 'text.secondary' }} /></IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Box sx={{ flex: 1, p: 1.5, backgroundColor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{staff.salesToday}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>sales today</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 1.5, backgroundColor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{staff.unitsToday}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>units today</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 1.5, backgroundColor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{staff.allTime}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>all time</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#0EA5E9' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{staff.lastAction}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{staff.lastActionDetails}</Typography>
                  </Box>
                </Box>
                <Box sx={{ px: 1, py: 0.25, backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9', borderRadius: 1, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Sale
                </Box>
              </Box>

              <Button onClick={() => alert(`Viewing activity for ${staff.name}`)} fullWidth variant="text" startIcon={<MaterialIcon icon="bar_chart" />} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: 'action.hover' } }}>
                View Activity Log
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Staff Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Staff Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" placeholder="e.g. Ama Owusu" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email Address" placeholder="e.g. ama@klavora.com" type="email" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Role" placeholder="e.g. Pharmacist" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Temporary Password" type="password" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)} sx={{ backgroundColor: '#0EA5E9', borderRadius: 2, fontWeight: 700, px: 3 }}>Add Staff</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
