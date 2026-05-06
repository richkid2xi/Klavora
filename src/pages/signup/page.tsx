import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function SignupPage() {
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1
  const [pharmacyName, setPharmacyName] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('');
  const [pharmacyType, setPharmacyType] = useState('Independent');

  // Step 2
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 3
  const [plan, setPlan] = useState<'starter' | 'premium'>('premium');

  // Step 4
  const [momoNetwork, setMomoNetwork] = useState('MTN');
  const [momoNumber, setMomoNumber] = useState('');

  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!pharmacyName.trim() || !location.trim() || !region || !pharmacyType) {
        setError('Please fill in all pharmacy details.');
        return;
      }
    } else if (step === 2) {
      if (!ownerName.trim() || !phone.trim() || !email.trim() || !password || !confirmPassword) {
        setError('Please fill in all owner details.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else if (step === 4) {
      if (!momoNumber.trim()) {
        setError('Please enter your MoMo number.');
        return;
      }
      // Fake processing
    }
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(s => s - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex flex-col items-center justify-center p-4 transition-colors duration-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent pointer-events-none" />
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
      >
        {theme === 'light' ? <i className="ri-moon-line text-base"></i> : <i className="ri-sun-line text-base"></i>}
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
              <i className="ri-medicine-bottle-line text-white text-lg"></i>
            </div>
            <span className="font-heading font-700 text-xl text-gray-900 dark:text-white tracking-tight">Klavora</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Create your pharmacy account</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 md:p-8 shadow-xl shadow-gray-200/40 dark:shadow-none">
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white">Pharmacy Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Tell us about your pharmacy.</p>
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Pharmacy Name</label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={e => setPharmacyName(e.target.value)}
                  placeholder="e.g. Mensah Pharmacy"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Location / Address</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. 14 Kwame Nkrumah Ave, Accra"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Region</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                >
                  <option value="">Select region...</option>
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Central">Central</option>
                  <option value="Western">Western</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Northern">Northern</option>
                  <option value="Volta">Volta</option>
                </select>
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Type of Pharmacy</label>
                <select
                  value={pharmacyType}
                  onChange={e => setPharmacyType(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                >
                  <option value="Independent">Independent</option>
                  <option value="Small Chain">Small Chain</option>
                  <option value="Franchise">Franchise</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white">Owner Account</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Create your login credentials.</p>
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Owner Full Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 font-body">Email</label>
                  <span className="text-[10px] text-primary-500 font-body">Your email is your login.</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <i className={showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white">Plan Selection</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Choose the right plan for your pharmacy.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() => setPlan('starter')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${plan === 'starter' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-300'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-heading font-600 text-gray-900 dark:text-white">Starter</h3>
                    <span className="text-base font-mono font-700 text-primary-500">GH₵150/mo</span>
                  </div>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 font-body">
                    <li><i className="ri-check-line text-success-500 mr-1"></i> Basic Inventory</li>
                    <li><i className="ri-check-line text-success-500 mr-1"></i> Point of Sale</li>
                    <li><i className="ri-check-line text-success-500 mr-1"></i> Up to 5 Staff</li>
                  </ul>
                </div>

                <div
                  onClick={() => setPlan('premium')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${plan === 'premium' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-amber-300'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-heading font-600 text-amber-600 dark:text-amber-500">Premium</h3>
                    <span className="text-base font-mono font-700 text-amber-500">GH₵400/mo</span>
                  </div>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 font-body">
                    <li><i className="ri-check-line text-amber-500 mr-1"></i> Everything in Starter</li>
                    <li><i className="ri-check-line text-amber-500 mr-1"></i> Advanced Analytics</li>
                    <li><i className="ri-check-line text-amber-500 mr-1"></i> Full Audit Logs</li>
                    <li><i className="ri-check-line text-amber-500 mr-1"></i> Unlimited Staff</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white">Payment</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body">Pay via Mobile Money to activate your plan.</p>
              </div>

              <div className="flex justify-between items-center p-4 bg-primary-50 dark:bg-primary-500/10 border border-primary-500/20 rounded-lg mb-6">
                <span className="text-sm font-heading font-600 text-primary-600 dark:text-primary-400 capitalize">{plan} Plan</span>
                <span className="text-lg font-mono font-700 text-primary-500">{plan === 'premium' ? 'GH₵400/mo' : 'GH₵150/mo'}</span>
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Network</label>
                <select
                  value={momoNetwork}
                  onChange={e => setMomoNetwork(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                >
                  <option value="MTN">MTN</option>
                  <option value="Telecel">Telecel</option>
                  <option value="AirtelTigo">AirtelTigo</option>
                </select>
              </div>

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">MoMo Number</label>
                <input
                  type="text"
                  value={momoNumber}
                  onChange={e => setMomoNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 0241234567"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-success-50 dark:bg-success-500/10 flex items-center justify-center mb-4">
                <i className="ri-checkbox-circle-line text-success-500 text-3xl"></i>
              </div>
              <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white mb-2">Confirmation & Dashboard Access</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-6">
                Payment successful! Your pharmacy account has been activated.
              </p>
              <button
                onClick={() => navigate('/signin')}
                className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium font-body transition-colors cursor-pointer shadow-sm"
              >
                Go to Sign In
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
              <i className="ri-error-warning-line flex-shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {step < 5 && (
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 h-11 border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-medium font-body transition-colors cursor-pointer bg-white dark:bg-surface-dark shadow-sm"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="flex-[2] h-11 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium font-body transition-colors cursor-pointer shadow-sm"
              >
                {step === 4 ? 'Confirm & Pay' : 'Next Step'}
              </button>
            </div>
          )}
        </div>

        {/* Back to login */}
        {step < 5 && (
          <div className="text-center mt-5">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Already have an account? </span>
            <a href="/signin" className="text-sm text-primary-500 hover:text-primary-600 font-semibold font-body cursor-pointer transition-colors">Sign in</a>
          </div>
        )}
      </div>
    </div>
  );
}
