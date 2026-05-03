import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

type Step = 'email' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('reset');
      setError('');
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setError('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-4 transition-colors duration-200">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
      >
        {theme === 'light' ? <i className="ri-moon-line text-base"></i> : <i className="ri-sun-line text-base"></i>}
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
              <i className="ri-medicine-bottle-line text-white text-lg"></i>
            </div>
            <span className="font-heading font-700 text-xl text-gray-900 dark:text-white tracking-tight">Klavora</span>
          </div>
          <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white">Forgot Password?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body">No worries, we'll help you reset it.</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6 shadow-sm">
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                  <i className="ri-error-warning-line flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? <i className="ri-loader-4-line animate-spin"></i> : null}
                Send Reset Instructions
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-body transition-colors cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                  <i className="ri-error-warning-line flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? <i className="ri-loader-4-line animate-spin"></i> : null}
                Reset Password
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success-50 dark:bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-checkbox-circle-line text-success-500 text-3xl"></i>
              </div>
              <h3 className="text-base font-heading font-700 text-gray-900 dark:text-white mb-2">Password Reset Successfully</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-6">You can now login with your new password.</p>
              <button
                onClick={() => navigate('/')}
                className="w-full h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
