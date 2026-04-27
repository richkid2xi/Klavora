import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  Grid,
  MenuItem,
  Select,
  Link,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'
import { useThemeContext } from '../contexts/ThemeContext'

interface RegisterPageProps {
  onBackToLogin: () => void
}

const steps = ['Pharmacy', 'Account', 'Plan', 'Payment', 'Done']

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBackToLogin }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [pharmacyType, setPharmacyType] = useState('Independent')
  const [selectedPlan, setSelectedPlan] = useState('Premium')
  const [momoNetwork, setMomoNetwork] = useState('MTN')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { isDarkMode } = useThemeContext()

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    } else {
      onBackToLogin()
    }
  }

  const progress = ((activeStep + 1) / steps.length) * 100

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDarkMode ? 'background.default' : '#EEF2F6',
        backgroundImage: isDarkMode 
          ? 'radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.1) 0, transparent 50%)'
          : 'radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.05) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.05) 0, transparent 50%)',
        overflowY: 'auto',
        p: { xs: 2, md: 6 },
      }}
      className="custom-scrollbar"
    >
      {/* Header Logo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Box
          sx={{
            backgroundColor: '#0EA5E9',
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)',
          }}
        >
          <MaterialIcon icon="medication" fill weight={600} opsz={24} style={{ color: 'white' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>Klavora</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Pharmacy Onboarding</Typography>
      </Box>

      {/* Progress Stepper */}
      <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700 }}>STEP {activeStep + 1} OF 5</Typography>
          <Typography variant="caption" sx={{ color: '#0EA5E9', fontWeight: 700 }}>{Math.round(progress)}% COMPLETE</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4, 
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': { 
              backgroundColor: '#0EA5E9',
              borderRadius: 4,
            } 
          }} 
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {steps.map((step, index) => (
            <Typography 
              key={step} 
              variant="caption" 
              sx={{ 
                color: index <= activeStep ? 'text.primary' : 'text.disabled',
                fontWeight: index <= activeStep ? 700 : 500,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {step}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Form Content */}
      <Box sx={{ width: '100%', maxWidth: 680, mx: 'auto', mb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 6,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.05)',
            mb: 4,
          }}
        >
          {activeStep === 0 && (
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Pharmacy Details</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>Tell us about your pharmacy to get started.</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pharmacy Name</Typography>
                  <TextField fullWidth placeholder="e.g. Mensah Pharmacy" variant="outlined" />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Location / Address</Typography>
                  <TextField fullWidth placeholder="e.g. 14 Kwame Nkrumah Ave, Accra" variant="outlined" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Region</Typography>
                  <Select
                    fullWidth
                    defaultValue="none"
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="none" disabled>Select region...</MenuItem>
                    <MenuItem value="greater-accra">Greater Accra</MenuItem>
                    <MenuItem value="ashanti">Ashanti</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type</Typography>
                  <Select
                    fullWidth
                    value={pharmacyType}
                    onChange={(e) => setPharmacyType(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="Independent">Independent</MenuItem>
                    <MenuItem value="Small Chain">Small Chain</MenuItem>
                    <MenuItem value="Franchise">Franchise</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Owner Account</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>Create your secure login credentials.</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Owner Full Name</Typography>
                  <TextField fullWidth placeholder="e.g. Kwame Mensah" variant="outlined" />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Phone Number</Typography>
                  <TextField fullWidth placeholder="+233 XX XXX XXXX" variant="outlined" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</Typography>
                  <TextField 
                    fullWidth 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Min. 6 characters" 
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)} size="small" edge="end">
                          <MaterialIcon icon={showPassword ? 'visibility_off' : 'visibility'} opsz={18} />
                        </IconButton>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Confirm Password</Typography>
                  <TextField 
                    fullWidth 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="Re-enter password" 
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} size="small" edge="end">
                          <MaterialIcon icon={showConfirmPassword ? 'visibility_off' : 'visibility'} opsz={18} />
                        </IconButton>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Choose Your Plan</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>14-day free trial on all plans. No charge today.</Typography>
              
              <Grid container spacing={3}>
                {['Starter', 'Premium'].map((plan) => (
                  <Grid item xs={12} md={6} key={plan}>
                    <Box
                      onClick={() => setSelectedPlan(plan)}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        border: '2px solid',
                        borderColor: selectedPlan === plan ? '#0EA5E9' : 'divider',
                        backgroundColor: selectedPlan === plan ? 'rgba(14, 165, 233, 0.02)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        height: '100%',
                        '&:hover': {
                          borderColor: selectedPlan === plan ? '#0EA5E9' : 'text.disabled',
                        }
                      }}
                    >
                      {plan === 'Premium' && (
                        <Box sx={{ position: 'absolute', top: -14, right: 24, backgroundColor: '#0EA5E9', px: 2, py: 0.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MaterialIcon icon="star" opsz={14} fill style={{ color: 'white' }} />
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>Popular</Typography>
                        </Box>
                      )}
                      <Typography variant="subtitle2" sx={{ color: plan === 'Premium' ? '#0EA5E9' : 'text.secondary', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{plan}</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>GH₵{plan === 'Premium' ? '400' : '150'} <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>/MO</Typography></Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {(plan === 'Starter' 
                          ? ['Up to 5 staff PINs', 'Batch inventory tracking', 'Sell and restock flow', 'Low stock & expiry alerts']
                          : ['Unlimited staff PINs', 'Full audit log', 'Insights & Analytics', 'Staff activity analytics', 'Priority support']
                        ).map(item => (
                          <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <MaterialIcon icon="check" opsz={14} weight={700} style={{ color: '#10B981' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>{item}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>Payment Method</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>Activate your account with Mobile Money.</Typography>
              
              <Box sx={{ mb: 5, p: 3, borderRadius: 4, backgroundColor: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#0EA5E9', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Selected Plan: {selectedPlan}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>GH₵{selectedPlan === 'Premium' ? '400' : '150'} <Typography component="span" variant="body2">/MONTH</Typography></Typography>
                </Box>
                <MaterialIcon icon="payments" fill style={{ color: '#0EA5E9', opacity: 0.5, fontSize: 40 }} />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select Network</Typography>
                  <Grid container spacing={2}>
                    {['MTN', 'Telecel', 'AirtelTigo'].map((net) => (
                      <Grid item xs={4} key={net}>
                        <Button
                          fullWidth
                          onClick={() => setMomoNetwork(net)}
                          sx={{
                            py: 1.5,
                            borderRadius: 3,
                            backgroundColor: momoNetwork === net ? 'rgba(14, 165, 233, 0.1)' : 'action.hover',
                            border: '2px solid',
                            borderColor: momoNetwork === net ? '#0EA5E9' : 'transparent',
                            color: momoNetwork === net ? '#0EA5E9' : 'text.secondary',
                            '&:hover': { backgroundColor: 'rgba(14, 165, 233, 0.05)' }
                          }}
                        >
                          {net}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Momo Number</Typography>
                  <TextField fullWidth placeholder="e.g. 024 123 4567" variant="outlined" />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                sx={{
                  mt: 5,
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderRadius: 4,
                  boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)',
                }}
              >
                Activate Free Trial
              </Button>
            </Box>
          )}

          {activeStep === 4 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Box sx={{ width: 96, height: 96, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4 }}>
                <MaterialIcon icon="check_circle" fill weight={700} opsz={56} style={{ color: '#10B981' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Welcome Aboard!</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, maxWidth: 400, mx: 'auto' }}>Your pharmacy setup is complete. You can now log in to manage your inventory.</Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={onBackToLogin}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  borderRadius: 4,
                  maxWidth: 320,
                  mx: 'auto',
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          )}

          {/* Navigation Buttons */}
          {activeStep < 4 && (
            <Box sx={{ display: 'flex', gap: 2, mt: 6 }}>
              {activeStep > 0 && activeStep !== 3 && (
                <Button
                  onClick={handleBack}
                  startIcon={<MaterialIcon icon="arrow_back" />}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: 'divider',
                    color: 'text.secondary',
                  }}
                >
                  Back
                </Button>
              )}
              {activeStep !== 3 && (
                <Button
                  fullWidth
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    flex: 2,
                    py: 1.5,
                    borderRadius: 3,
                  }}
                >
                  Continue <MaterialIcon icon="arrow_forward" style={{ marginLeft: 8 }} />
                </Button>
              )}
            </Box>
          )}
          
          {activeStep === 3 && (
             <Button
                onClick={handleBack}
                sx={{
                  mt: 3,
                  color: 'text.disabled',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mx: 'auto',
                  '&:hover': { color: 'text.secondary' }
                }}
              >
                <MaterialIcon icon="arrow_back" opsz={16} /> Back to plan selection
              </Button>
          )}
        </Paper>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Already have an account?{' '}
            <Link 
              component="button"
              onClick={onBackToLogin}
              sx={{ 
                color: '#0EA5E9', 
                fontWeight: 800,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' } 
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
