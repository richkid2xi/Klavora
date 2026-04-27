import React from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

export const AuditLogPage: React.FC = () => {
  const auditData = [
    {
      date: 'FRIDAY, 24 APRIL 2026',
      entries: [
        { type: 'Sale', color: '#0EA5E9', name: 'Salbutamol Inhaler 100mcg', txn: 'TXN-20260424-001', staff: 'Ama Owusu', time: '8:30:00 AM', before: 7, qty: -2, after: 5 },
        { type: 'Sale', color: '#0EA5E9', name: 'Paracetamol 500mg', txn: 'TXN-20260424-002', staff: 'Kofi Mensah', time: '9:45:00 AM', before: 500, qty: -40, after: 460 },
        { type: 'Sale', color: '#0EA5E9', name: 'Atorvastatin 20mg', txn: 'TXN-20260424-003', staff: 'Abena Asante', time: '11:10:00 AM', before: 90, qty: -15, after: 75 },
      ]
    },
    {
      date: 'THURSDAY, 23 APRIL 2026',
      entries: [
        { type: 'Sale', color: '#0EA5E9', name: 'Lisinopril 10mg', txn: 'TXN-20260423-001', staff: 'Ama Owusu', time: '10:20:00 AM', before: 32, qty: -20, after: 12 },
        { type: 'Sale', color: '#0EA5E9', name: 'Zinc Sulphate 20mg', txn: 'TXN-20260423-002', staff: 'Kwame Boateng', time: '2:30:00 PM', before: 600, qty: -100, after: 500 },
      ]
    },
    {
      date: 'WEDNESDAY, 22 APRIL 2026',
      entries: [
        { type: 'Sale', color: '#0EA5E9', name: 'Ciprofloxacin 500mg', txn: 'TXN-20260422-001', staff: 'Kofi Mensah', time: '9:00:00 AM', before: 200, qty: -20, after: 180 },
      ]
    },
    {
      date: 'TUESDAY, 21 APRIL 2026',
      entries: [
        { type: 'Sale', color: '#0EA5E9', name: 'Diazepam 5mg', txn: 'TXN-20260421-001', staff: 'Abena Asante', time: '1:15:00 PM', before: 200, qty: -30, after: 170 },
      ]
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>Audit Log</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          23 entries
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Grid container spacing={2} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search drug or ref..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MaterialIcon icon="search" style={{ color: 'text.secondary' }} opsz={20} />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper', borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField select SelectProps={{ native: true }} size="small" sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper', borderRadius: 2 } }}>
              <option>All Types</option>
            </TextField>
            <TextField select SelectProps={{ native: true }} size="small" sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper', borderRadius: 2 } }}>
              <option>All Staff</option>
            </TextField>
            <TextField type="date" size="small" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper', borderRadius: 2 } }} />
            <TextField type="date" size="small" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper', borderRadius: 2 } }} />
          </Box>
        </Grid>
      </Grid>

      {/* Log List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {auditData.map((group, groupIdx) => (
          <Box key={groupIdx}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 2 }}>
              {group.date}
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 2, backgroundColor: 'transparent', border: 'none' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {group.entries.map((entry, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2.5,
                      mb: 1.5,
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ px: 1, py: 0.5, borderRadius: 1, backgroundColor: `${entry.color}20`, color: entry.color, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {entry.type}
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{entry.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{entry.txn}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <span style={{ fontWeight: 500 }}>{entry.staff}</span> &nbsp;&nbsp;{entry.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4, textAlign: 'center' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>BEFORE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{entry.before}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>QTY</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: entry.qty < 0 ? '#0EA5E9' : '#10B981' }}>
                          {entry.qty > 0 ? `+${entry.qty}` : entry.qty}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>AFTER</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{entry.after}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
