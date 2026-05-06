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
  const [loading, setLoading] = useState(false)

  const handleClickShowPassword = (e: React.MouseEvent) => {
    e.preventDefault() 
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    onLogin(email, password)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            mb: 0.75,
            color: 'text.secondary',
            display: 'block',
            letterSpacing: '0.05em',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
          }}
        >
          Email
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="owner@klavora.demo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            mb: 0.75,
            color: 'text.secondary',
            display: 'block',
            letterSpacing: '0.05em',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
          }}
        >
          Password
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
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <MaterialIcon 
                    icon={showPassword ? 'visibility_off' : 'visibility'} 
                    opsz={20} 
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mb: 2,
          height: 48,
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: 3,
        }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onDemoClick}
        startIcon={<MaterialIcon icon="science" opsz={18} />}
        sx={{
          mb: 2.5,
          height: 44,
          color: 'text.secondary',
          borderRadius: 3,
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'action.hover',
            color: 'text.primary',
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
            color: 'text.disabled', 
            fontFamily: 'monospace',
            letterSpacing: '0.02em',
          }}
        >
          owner@klavora.demo / demo1234
        </Typography>
      </Box>
    </Box>
  )
}
