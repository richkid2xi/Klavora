import React, { useState } from 'react'
import {
  Box,
  Grid,
  Avatar,
  Typography,
  ButtonBase,
  useTheme,
  IconButton,
} from '@mui/material'
import { mockStaff } from '../mock'
import { MaterialIcon } from './MaterialIcon'

interface StaffSelectionProps {
  onStaffSelect: (staffId: number, staffName: string) => void
}

export const StaffSelection: React.FC<StaffSelectionProps> = ({ onStaffSelect }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [pin, setPin] = useState('')

  const handleStaffClick = (staff: any) => {
    setSelectedStaff(staff)
    setPin('')
  }

  const handleBack = () => {
    setSelectedStaff(null)
    setPin('')
  }

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num
      setPin(newPin)
      if (newPin.length === 4) {
        // Automatically submit if PIN is 4 digits
        onStaffSelect(selectedStaff.id, selectedStaff.name)
      }
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
  }

  if (selectedStaff) {
    return (
      <Box 
        className="custom-scrollbar"
        sx={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          maxHeight: 360, // Fixed height for scrolling content
          overflowY: 'auto',
          overflowX: 'hidden',
          pr: 0.5, // Space for the scrollbar
        }}
      >
        {/* Back Button */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <ButtonBase
            onClick={handleBack}
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.8rem',
              fontWeight: 500,
              '&:hover': { color: '#ffffff' }
            }}
          >
            <MaterialIcon icon="arrow_back" opsz={16} />
            Back
          </ButtonBase>
        </Box>

        {/* Staff Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: selectedStaff.color,
              width: 52,
              height: 52,
              fontSize: '1.1rem',
              fontWeight: 700,
              mx: 'auto',
              mb: 1.5,
            }}
          >
            {selectedStaff.initials}
          </Avatar>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#ffffff', mb: 0.2, fontSize: '0.95rem' }}>
            {selectedStaff.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: 500, fontSize: '0.7rem' }}>
            Enter your 4-digit PIN
          </Typography>
        </Box>

        {/* PIN Display */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          {[...Array(4)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                backgroundColor: i < pin.length ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Box>

        {/* Keypad */}
        <Box sx={{ width: '100%', maxWidth: 260 }}>
          <Grid container spacing={1}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'].map((key, i) => (
              <Grid item xs={4} key={i}>
                {key === 'delete' ? (
                  <ButtonBase
                    onClick={handleDelete}
                    sx={{
                      width: '100%',
                      height: 50,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid',
                      borderColor: 'rgba(255, 255, 255, 0.04)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                    }}
                  >
                    <MaterialIcon icon="backspace" opsz={18} style={{ opacity: 0.4 }} />
                  </ButtonBase>
                ) : key === '' ? (
                  <Box sx={{ height: 50 }} />
                ) : (
                  <ButtonBase
                    onClick={() => handleNumberClick(key)}
                    sx={{
                      width: '100%',
                      height: 50,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid',
                      borderColor: 'rgba(255, 255, 255, 0.06)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                    }}
                  >
                    {key}
                  </ButtonBase>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.15)', 
              fontFamily: 'monospace',
              fontSize: '0.65rem'
            }}
          >
            Demo PIN: 1234
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box 
      className="custom-scrollbar"
      sx={{ 
        width: '100%', 
        maxHeight: 360, 
        overflowY: 'auto',
        overflowX: 'hidden',
        pr: 0.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          mb: 2.5,
          textAlign: 'left',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.85rem',
        }}
      >
        Select your name to continue
      </Typography>

      <Grid container spacing={1.5}>
        {mockStaff.map((staff) => (
          <Grid item xs={12} sm={6} key={staff.id}>
            <ButtonBase
              onClick={() => handleStaffClick(staff)}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 1.5,
                p: 1.2,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: staff.color,
                  width: 36,
                  height: 36,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {staff.initials}
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    fontSize: '0.85rem'
                  }}
                >
                  {staff.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '0.7rem'
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
