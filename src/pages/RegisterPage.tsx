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
  FormControl,
  InputLabel,
  Link,
  Avatar,
} from '@mui/material'
import { MaterialIcon } from '../components/MaterialIcon'

interface RegisterPageProps {
  onBackToLogin: () => void
}

const steps = ['Pharmacy', 'Account', 'Plan', 'Payment', 'Done']

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBackToLogin }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [pharmacyType, setPharmacyType] = useState('Independent')
  const [selectedPlan, setSelectedPlan] = useState('Premium')
  const [momoNetwork, setMomoNetwork] = useState('MTN')

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
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        overflowY: 'auto',
        color: 'text.primary',
        p: { xs: 2, md: 4 },
      }}
      className="custom-scrollbar"
    >
      {/* Header Logo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box sx={{ backgroundColor: '#00a3ff', width: 30, height: 30, borderRadius: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcon icon="medication" fill weight={600} opsz={20} style={{ color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.4rem', color: 'text.primary' }}>Klavora</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>New Pharmacy Setup</Typography>
      </Box>

      {/* Progress Stepper */}
      <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Step {activeStep + 1} of 5</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{Math.round(progress)}%</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 6, 
            borderRadius: 3, 
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': { backgroundColor: '#f59e0b' } 
          }} 
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
          {steps.map((step, index) => (
            <Typography 
              key={step} 
              variant="caption" 
              sx={{ 
                color: index <= activeStep ? '#f59e0b' : 'text.disabled',
                fontWeight: index === activeStep ? 700 : 500,
                fontSize: '0.75rem'
              }}
            >
              {step}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Form Content */}
      <Box sx={{ width: '100%', maxWidth: 640, mx: 'auto', mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          {activeStep === 0 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Pharmacy Details</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Tell us about your pharmacy.</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>PHARMACY NAME</Typography>
                <TextField fullWidth placeholder="e.g. Mensah Pharmacy" variant="outlined" />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>LOCATION / ADDRESS</Typography>
                <TextField fullWidth placeholder="e.g. 14 Kwame Nkrumah Ave, Accra" variant="outlined" />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>REGION</Typography>
                <Select
                  fullWidth
                  defaultValue="none"
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' }
                  }}
                >
                  <MenuItem value="none" disabled>Select region...</MenuItem>
                  <MenuItem value="greater-accra">Greater Accra</MenuItem>
                  <MenuItem value="ashanti">Ashanti</MenuItem>
                </Select>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>TYPE OF PHARMACY</Typography>
                <Grid container spacing={1.5}>
                  {['Independent', 'Small Chain', 'Franchise'].map((type) => (
                    <Grid item xs={4} key={type}>
                      <Button
                        fullWidth
                        onClick={() => setPharmacyType(type)}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          backgroundColor: pharmacyType === type ? 'rgba(245, 158, 11, 0.1)' : 'action.hover',
                          border: '1px solid',
                          borderColor: pharmacyType === type ? '#f59e0b' : 'divider',
                          color: pharmacyType === type ? '#f59e0b' : 'text.secondary',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.05)' }
                        }}
                      >
                        {type}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Owner Account</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Create your login credentials.</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>OWNER FULL NAME</Typography>
                <TextField fullWidth placeholder="e.g. Kwame Mensah" variant="outlined" />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>PHONE NUMBER</Typography>
                <TextField fullWidth placeholder="+233 XX XXX XXXX" variant="outlined" />
                <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1, display: 'block' }}>Your phone number is your login.</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>PASSWORD</Typography>
                <TextField fullWidth type="password" placeholder="Min. 6 characters" variant="outlined" />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>CONFIRM PASSWORD</Typography>
                <TextField fullWidth type="password" placeholder="Re-enter password" variant="outlined" />
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Choose Your Plan</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>14-day free trial on all plans. No charge today.</Typography>
              
              <Grid container spacing={3}>
                {/* Starter Plan */}
                <Grid item xs={12} md={6}>
                  <Box
                    onClick={() => setSelectedPlan('Starter')}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: selectedPlan === 'Starter' ? '#f59e0b' : 'divider',
                      backgroundColor: selectedPlan === 'Starter' ? 'rgba(245, 158, 11, 0.05)' : 'action.hover',
                      cursor: 'pointer',
                      height: '100%',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>Starter</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>GH₵150 <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>/month</Typography></Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {['Up to 5 staff PINs', 'Batch inventory tracking', 'Sell and restock flow', 'Low stock & expiry alerts', 'Activity feed'].map(item => (
                        <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MaterialIcon icon="check" opsz={16} style={{ color: '#10b981' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Premium Plan */}
                <Grid item xs={12} md={6}>
                  <Box
                    onClick={() => setSelectedPlan('Premium')}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: selectedPlan === 'Premium' ? '#f59e0b' : 'divider',
                      backgroundColor: selectedPlan === 'Premium' ? 'rgba(245, 158, 11, 0.05)' : 'action.hover',
                      cursor: 'pointer',
                      position: 'relative',
                      height: '100%',
                    }}
                  >
                    {selectedPlan === 'Premium' && (
                      <Box sx={{ position: 'absolute', top: -12, right: 20, backgroundColor: '#f59e0b', px: 1.5, py: 0.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MaterialIcon icon="crown" opsz={14} fill style={{ color: 'white' }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>Most Popular</Typography>
                      </Box>
                    )}
                    <Typography variant="subtitle2" sx={{ color: '#f59e0b', mb: 1 }}>Premium</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>GH₵400 <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>/month</Typography></Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MaterialIcon icon="layers" opsz={16} fill /> Everything in Starter
                      </Typography>
                      {['Unlimited staff PINs', 'Full audit log with reversal', 'Insights: top sellers', 'Staff activity analytics', 'Priority support'].map(item => (
                        <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MaterialIcon icon="check" opsz={16} style={{ color: '#f59e0b' }} />
                          <Typography variant="caption" sx={{ color: 'text.primary' }}>{item}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Payment</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Pay via Mobile Money to activate your plan.</Typography>
              
              <Box sx={{ mb: 4, p: 3, borderRadius: 3, backgroundColor: 'action.hover', border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>{selectedPlan} Plan</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>GH₵{selectedPlan === 'Premium' ? '400' : '150'} <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>/mo</Typography></Typography>
                </Box>
                <MaterialIcon icon="crown" fill style={{ color: '#f59e0b', opacity: 0.5 }} />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>NETWORK</Typography>
                <Grid container spacing={1.5}>
                  {['MTN', 'Telecel', 'AirtelTigo'].map((net) => (
                    <Grid item xs={4} key={net}>
                      <Button
                        fullWidth
                        onClick={() => setMomoNetwork(net)}
                        sx={{
                          py: 1.2,
                          borderRadius: 2,
                          backgroundColor: momoNetwork === net ? 'rgba(245, 158, 11, 0.1)' : 'action.hover',
                          border: '1px solid',
                          borderColor: momoNetwork === net ? '#f59e0b' : 'divider',
                          color: momoNetwork === net ? '#f59e0b' : 'text.secondary',
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {net}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary', display: 'block', letterSpacing: '0.05em' }}>MOMO NUMBER</Typography>
                <TextField fullWidth placeholder="e.g. 0241234567" variant="outlined" />
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                startIcon={<MaterialIcon icon="payments" />}
                sx={{
                  py: 1.5,
                  backgroundColor: '#f59e0b',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '1rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#d97706' }
                }}
              >
                Pay GH₵{selectedPlan === 'Premium' ? '400' : '150'} & Activate
              </Button>

              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <MaterialIcon icon="verified_user" opsz={16} style={{ color: '#10b981' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>14-day free trial — no charge today</Typography>
              </Box>
            </Box>
          )}

          {activeStep === 4 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                <MaterialIcon icon="check_circle" fill weight={700} opsz={48} style={{ color: '#10b981' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Setup Complete!</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>Your pharmacy is ready. You can now log in to start managing your inventory.</Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={onBackToLogin}
                sx={{
                  py: 1.8,
                  backgroundColor: '#00a3ff',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 3,
                  textTransform: 'none',
                }}
              >
                Go to Sign In
              </Button>
            </Box>
          )}

          {/* Navigation Buttons (for steps with back button) */}
          {activeStep < 4 && (
            <Box sx={{ display: 'flex', gap: 2, mt: activeStep === 2 || activeStep === 3 ? 6 : 4 }}>
              {activeStep > 0 && activeStep !== 3 && (
                <Button
                  onClick={handleBack}
                  startIcon={<MaterialIcon icon="arrow_back" />}
                  sx={{
                    flex: 0.3,
                    py: 1.5,
                    backgroundColor: 'action.hover',
                    color: 'text.primary',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  Back
                </Button>
              )}
              {activeStep !== 3 && (
                <Button
                  fullWidth
                  onClick={handleNext}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    backgroundColor: '#f59e0b',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#d97706' }
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
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mx: 'auto',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <MaterialIcon icon="arrow_back" opsz={16} /> Back to plan selection
              </Button>
          )}
        </Paper>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Already have an account?{' '}
            <Link 
              component="button"
              onClick={onBackToLogin}
              sx={{ 
                color: '#f59e0b', 
                fontWeight: 700,
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
