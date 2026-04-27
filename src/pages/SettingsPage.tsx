import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Switch,
  ButtonBase,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

export const SettingsPage: React.FC = () => {
  const operations = [
    { icon: 'settings', label: 'Inventory Preferences', desc: 'Configure inventory behaviour', active: true, color: '#0EA5E9' },
    { icon: 'workspace_premium', label: 'Account & Plan', desc: 'Subscription and pharmacy info', active: false, color: '#F59E0B' },
    { icon: 'undo', label: 'Stock Reversal', desc: 'Adjust stock for errors or returns', active: false, color: '#F59E0B' },
    { icon: 'balance', label: 'Reconciliation', desc: 'Match system to physical count', active: false, color: '#8B5CF6' },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>Settings</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Owner-only operations
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 2 }}>
            OPERATIONS
          </Typography>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {operations.map((op, i) => (
                <ButtonBase
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: op.active ? 'action.hover' : 'transparent',
                    '&:hover': { backgroundColor: 'action.hover' },
                    textAlign: 'left'
                  }}
                >
                  <Box sx={{ p: 1, borderRadius: 1.5, backgroundColor: op.active ? `${op.color}20` : 'action.hover', display: 'flex' }}>
                    <MaterialIcon icon={op.icon} style={{ color: op.color }} opsz={20} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: op.active ? op.color : 'text.primary', mb: 0.5 }}>{op.label}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{op.desc}</Typography>
                  </Box>
                </ButtonBase>
              ))}
            </Box>
          </Paper>

          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', display: 'block', mb: 2 }}>
            NOTE
          </Typography>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.6 }}>
              All operations in this section are permanently logged in the Audit Log and cannot be undone. Double confirmation is required before any changes are applied.
            </Typography>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <MaterialIcon icon="settings" style={{ color: '#0EA5E9' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>Inventory Preferences</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>Configure how inventory and restocking behaves.</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
              <Box sx={{ pr: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>Auto-create new batch on restock</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  When enabled, the restock flow skips the question asking if this is a new delivery and automatically creates a new batch every time. Double confirmation still applies.
                </Typography>
              </Box>
              <Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#0EA5E9' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#0EA5E9' } }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
              <Button variant="contained" sx={{ backgroundColor: '#0EA5E9', fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 3, py: 1, '&:hover': { backgroundColor: '#0284C7' } }}>
                Save Preferences
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
