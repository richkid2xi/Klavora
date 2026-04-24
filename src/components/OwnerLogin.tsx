import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { MaterialIcon } from './MaterialIcon'

interface OwnerLoginProps {
  onLogin: (email: string, password: string) => void
  onDemoClick: () => void
}

export const OwnerLogin: React.FC<OwnerLoginProps> = ({ onLogin, onDemoClick }) => {
  const [email, setEmail] = useState('owner@klavora.demo')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'block',
            letterSpacing: '0.05em',
            fontSize: '0.65rem',
          }}
        >
          EMAIL
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="owner@klavora.demo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0a0f18',
              '& input': {
                color: '#ffffff',
              },
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'block',
            letterSpacing: '0.05em',
            fontSize: '0.65rem',
          }}
        >
          PASSWORD
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  size="small"
                  sx={{ color: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <MaterialIcon 
                    icon={showPassword ? 'visibility_off' : 'visibility'} 
                    opsz={16} 
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0a0f18',
              '& input': {
                color: '#ffffff',
              },
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }
            }
          }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mb: 1.5,
          height: 42,
          backgroundColor: '#00a3ff',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0095e9',
          },
          fontSize: '0.9rem',
          fontWeight: 700,
          borderRadius: 1.5,
          textTransform: 'none',
        }}
      >
        Sign In
      </Button>

      <Button
        fullWidth
        variant="outlined"
        onClick={onDemoClick}
        startIcon={<MaterialIcon icon="science" opsz={16} style={{ opacity: 0.5 }} />}
        sx={{
          mb: 2,
          height: 42,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          color: 'rgba(255, 255, 255, 0.7)',
          backgroundColor: 'transparent',
          borderRadius: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }
        }}
      >
        Use Demo Account
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 500, 
            color: 'rgba(255, 255, 255, 0.2)', 
            fontFamily: 'monospace',
            letterSpacing: '0.02em',
            fontSize: '0.7rem'
          }}
        >
          owner@klavora.demo / demo1234
        </Typography>
      </Box>
    </Box>
  )
}
