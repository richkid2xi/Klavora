import React, { useState } from 'react'
import {
  Box,
  Grid,
  Avatar,
  Typography,
  ButtonBase,
} from '@mui/material'
import { mockStaff, StaffMember } from '../mock'
import { MaterialIcon } from './MaterialIcon'

interface StaffSelectionProps {
  onStaffSelect: (staffId: number, staffName: string) => void
}

export const StaffSelection: React.FC<StaffSelectionProps> = ({ onStaffSelect }) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleStaffClick = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setPin('')
    setError(false)
  }

  const handleBack = () => {
    setSelectedStaff(null)
    setPin('')
    setError(false)
  }

  const handleNumberClick = async (num: string) => {
    if (pin.length < 4 && !loading) {
      const newPin = pin + num
      setPin(newPin)
      setError(false)

      if (newPin.length === 4) {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (newPin === '1234' && selectedStaff) {
          setLoading(false)
          onStaffSelect(selectedStaff.id, selectedStaff.name)
        } else {
          setLoading(false)
          setError(true)
          setPin('')
        }
      }
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
  }

  if (selectedStaff) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
        }}
      >
        <Box sx={{ width: '100%', mb: 3 }}>
          <ButtonBase
            onClick={handleBack}
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.875rem',
              fontWeight: 600,
              '&:hover': { color: 'text.primary' }
            }}
          >
            <MaterialIcon icon="arrow_back" opsz={18} />
            Back
          </ButtonBase>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: selectedStaff.color,
              width: 64,
              height: 64,
              fontSize: '1.25rem',
              fontWeight: 700,
              mx: 'auto',
              mb: 2,
              boxShadow: `0 8px 16px ${selectedStaff.color}25`,
            }}
          >
            {selectedStaff.initials}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {selectedStaff.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: error ? '#EF4444' : 'text.secondary', 
              fontWeight: 500,
              fontSize: '0.8rem'
            }}
          >
            {error ? 'Invalid PIN, try again' : 'Enter your 4-digit PIN'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {[...Array(4)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: error ? '#EF4444' : (i < pin.length ? '#0EA5E9' : 'divider'),
                backgroundColor: i < pin.length ? (error ? '#EF4444' : '#0EA5E9') : 'transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: i < pin.length ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ))}
        </Box>

        <Box sx={{ width: '100%', maxWidth: 280 }}>
          <Grid container spacing={2}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((key, i) => (
              <Grid item xs={4} key={i}>
                {key === 'delete' ? (
                  <ButtonBase
                    onClick={handleDelete}
                    sx={{
                      width: '100%',
                      height: 56,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                    }}
                  >
                    <MaterialIcon icon="backspace" opsz={20} style={{ color: '#64748B' }} />
                  </ButtonBase>
                ) : key === '' ? (
                  <Box sx={{ height: 56 }} />
                ) : (
                  <ButtonBase
                    onClick={() => handleNumberClick(key)}
                    sx={{
                      width: '100%',
                      height: 56,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'text.primary',
                      transition: 'all 0.1s',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.06)' },
                      '&:active': { transform: 'scale(0.95)' }
                    }}
                  >
                    {key}
                  </ButtonBase>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="body2"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        Select your name to continue
      </Typography>

      <Grid container spacing={2}>
        {mockStaff.map((staff: StaffMember) => (
          <Grid item xs={6} key={staff.id}>
            <ButtonBase
              onClick={() => handleStaffClick(staff)}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 2.5,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'rgba(0,0,0,0.01)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#0EA5E9',
                  backgroundColor: 'rgba(14, 165, 233, 0.04)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: staff.color,
                  width: 48,
                  height: 48,
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: `0 4px 12px ${staff.color}20`,
                }}
              >
                {staff.initials}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.2,
                  }}
                >
                  {staff.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  {staff.role}
                </Typography>
              </Box>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
