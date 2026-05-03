import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { AuthUser } from '@/mocks/types';

const GHANA_REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central',
  'Northern', 'Upper East', 'Upper West', 'Volta', 'Brong-Ahafo',
  'Oti', 'Bono East', 'Ahafo', 'Savannah', 'North East', 'Western North',
];

const NETWORKS = ['MTN', 'Telecel', 'AirtelTigo'];

const STARTER_FEATURES = [
  'Up to 5 staff PINs',
  'Batch inventory tracking',
  'Sell and restock flow',
  'Low stock & expiry alerts',
  'Activity feed',
  'Basic audit log',
  'Receipt generation',
];

const PREMIUM_FEATURES = [
  'Everything in Starter',
  'Unlimited staff PINs',
  'Full audit log with reversal & reconciliation',
  'Insights: top sellers & slow movers',
  'Staff activity analytics',
  'Priority support',
  'Subscription renewal reminders',
];

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Pharmacy', 'Account', 'Plan', 'Payment', 'Done'];

type Plan = 'starter' | 'premium';

export default function SignUpPage() {
  const { login, setSubscriptionPlan, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Step 1 — Pharmacy Details
  const [pharmacyName, setPharmacyName] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('');
  const [pharmacyType, setPharmacyType] = useState<'Independent' | 'Small Chain' | 'Franchise'>('Independent');
  const [step1Error, setStep1Error] = useState('');

  // Step 2 — Owner Account
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [step2Error, setStep2Error] = useState('');

  // Step 3 — Plan
  const [selectedPlan, setSelectedPlan] = useState<Plan>('premium');

  // Step 4 — Payment
  const [momoNumber, setMomoNumber] = useState('');
  const [network, setNetwork] = useState('MTN');
  const [payError, setPayError] = useState('');
  const [paying, setPaying] = useState(false);

  const planPrice = selectedPlan === 'starter' ? 150 : 400;

  const validateStep1 = () => {
    if (!pharmacyName.trim()) return 'Pharmacy name is required.';
    if (!location.trim()) return 'Location is required.';
    if (!region) return 'Please select a region.';
    return '';
  };

  const validateStep2 = () => {
    if (!ownerName.trim()) return 'Owner name is required.';
    if (!email.trim() || !email.includes('@')) return 'A valid email address is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleContinue = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { setStep1Error(err); return; }
      setStep1Error('');
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { setStep2Error(err); return; }
      setStep2Error('');
    }
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const handlePayAndActivate = () => {
    if (!momoNumber.trim() || momoNumber.length < 10) {
      setPayError('Please enter a valid MoMo number.');
      return;
    }
    setPayError('');
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      const authUser: AuthUser = {
        id: 'owner-' + Date.now(),
        name: ownerName,
        role: 'owner',
        pharmacyId: 'pharm-' + Date.now(),
        pharmacyName: pharmacyName,
      };
      login(authUser);
      setSubscriptionPlan(selectedPlan);
      setDone(true);
    }, 1800);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-4 transition-colors duration-200">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-6 border-2 border-amber-400">
            <i className="ri-check-line text-amber-500 text-4xl"></i>
          </div>
          <h1 className="text-2xl font-heading font-700 text-gray-900 dark:text-white mb-3">
            {pharmacyName || 'Your Pharmacy'} is ready.
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-1">Your pharmacy is set up.</p>
          <p className="text-sm text-gray-400 dark:text-gray-600 font-body mb-8">No drugs required yet — add them from your dashboard.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-400/40 mb-8">
            <i className="ri-vip-crown-line text-amber-500 text-sm"></i>
            <span className="text-sm font-body font-medium text-amber-600 dark:text-amber-400 capitalize">{selectedPlan} Plan Active</span>
          </div>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="h-btn px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-4 transition-colors duration-200">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
      >
        {theme === 'light' ? <i className="ri-moon-line text-base"></i> : <i className="ri-sun-line text-base"></i>}
      </button>

      <div className={`w-full ${step === 3 ? 'max-w-2xl' : 'max-w-lg'} transition-all duration-300`}>
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <i className="ri-medicine-bottle-line text-white text-base"></i>
            </div>
            <span className="font-heading font-700 text-lg text-gray-900 dark:text-white tracking-tight">Klavora</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 font-body">New Pharmacy Setup</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-body text-gray-500 dark:text-gray-400">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-xs font-mono text-gray-400 dark:text-gray-600">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEP_LABELS.map((label, i) => (
              <span
                key={label}
                className={`text-[10px] font-body transition-colors ${i + 1 <= step ? 'text-amber-500' : 'text-gray-300 dark:text-gray-700'}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6">

          {/* Step 1 — Pharmacy Details */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white mb-1">Pharmacy Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">Tell us about your pharmacy.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Pharmacy Name</label>
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={e => setPharmacyName(e.target.value)}
                    placeholder="e.g. Mensah Pharmacy"
                    className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Location / Address</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. 14 Kwame Nkrumah Ave, Accra"
                    className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Region</label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  >
                    <option value="">Select region...</option>
                    {GHANA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-body">Type of Pharmacy</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Independent', 'Small Chain', 'Franchise'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setPharmacyType(type)}
                        className={`py-3 px-2 rounded-lg border text-xs font-body font-medium transition-all cursor-pointer text-center
                          ${pharmacyType === type
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {step1Error && (
                  <div className="flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                    <i className="ri-error-warning-line flex-shrink-0"></i>
                    <span>{step1Error}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Owner Account */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white mb-1">Owner Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">Create your login credentials.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Owner Full Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="owner@example.com"
                    className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-1">Your email will be used for login.</p>
                </div>
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full h-btn px-3 pr-10 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      <i className={showPass ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                {step2Error && (
                  <div className="flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                    <i className="ri-error-warning-line flex-shrink-0"></i>
                    <span>{step2Error}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — Subscription Plan */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white mb-1">Choose Your Plan</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">14-day free trial on all plans. No charge today.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Starter */}
                <button
                  onClick={() => setSelectedPlan('starter')}
                  className={`relative text-left p-5 rounded-xl border-2 transition-all cursor-pointer
                    ${selectedPlan === 'starter'
                      ? 'border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.15)]'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  {selectedPlan === 'starter' && (
                    <div className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full bg-amber-500">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                  )}
                  <div className="mb-3">
                    <p className="text-sm font-body font-medium text-gray-500 dark:text-gray-400 mb-1">Starter</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-mono font-700 text-gray-900 dark:text-white">GH₵150</span>
                      <span className="text-xs text-gray-400 font-body">/month</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {STARTER_FEATURES.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <i className="ri-check-line text-success-500 text-sm flex-shrink-0 mt-0.5"></i>
                        <span className="text-xs font-body text-gray-600 dark:text-gray-400">{f}</span>
                      </div>
                    ))}
                  </div>
                </button>

                {/* Premium */}
                <button
                  onClick={() => setSelectedPlan('premium')}
                  className={`relative text-left p-5 rounded-xl border-2 transition-all cursor-pointer
                    ${selectedPlan === 'premium'
                      ? 'border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.2)]'
                      : 'border-border-light dark:border-border-dark hover:border-amber-300 dark:hover:border-amber-700'
                    }`}
                >
                  {/* Most Popular badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-body font-600 whitespace-nowrap">
                      <i className="ri-vip-crown-line text-xs"></i>
                      Most Popular
                    </span>
                  </div>
                  {selectedPlan === 'premium' && (
                    <div className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full bg-amber-500">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                  )}
                  <div className="mb-3 mt-2">
                    <p className="text-sm font-body font-medium text-amber-600 dark:text-amber-400 mb-1">Premium</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-mono font-700 text-gray-900 dark:text-white">GH₵400</span>
                      <span className="text-xs text-gray-400 font-body">/month</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {PREMIUM_FEATURES.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <i className={`text-sm flex-shrink-0 mt-0.5 ${f === 'Everything in Starter' ? 'ri-stack-line text-amber-500' : 'ri-check-line text-amber-500'}`}></i>
                        <span className={`text-xs font-body ${f === 'Everything in Starter' ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>{f}</span>
                      </div>
                    ))}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Payment */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-heading font-700 text-gray-900 dark:text-white mb-1">Payment</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">Pay via Mobile Money to activate your plan.</p>
              <div className="space-y-4">
                {/* Amount display */}
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-400/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-body mb-0.5 capitalize">{selectedPlan} Plan</p>
                    <p className="text-2xl font-mono font-700 text-gray-900 dark:text-white">GH₵{planPrice}<span className="text-sm font-400 text-gray-400">/mo</span></p>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                    <i className="ri-vip-crown-line text-amber-500 text-lg"></i>
                  </div>
                </div>

                {/* Network selector */}
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-body">Network</label>
                  <div className="grid grid-cols-3 gap-2">
                    {NETWORKS.map(n => (
                      <button
                        key={n}
                        onClick={() => setNetwork(n)}
                        className={`py-2.5 rounded-lg border text-sm font-body font-medium transition-all cursor-pointer
                          ${network === n
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MoMo number */}
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">MoMo Number</label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={e => setMomoNumber(e.target.value)}
                    placeholder="e.g. 0241234567"
                    className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {payError && (
                  <div className="flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                    <i className="ri-error-warning-line flex-shrink-0"></i>
                    <span>{payError}</span>
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handlePayAndActivate}
                  disabled={paying}
                  className="w-full h-btn bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="ri-secure-payment-line"></i>
                      Pay GH₵{planPrice} &amp; Activate
                    </>
                  )}
                </button>

                {/* Free trial note */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-600 font-body">
                  <i className="ri-shield-check-line text-success-500"></i>
                  <span>14-day free trial — no charge today</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons (steps 1-3 only; step 4 has its own pay button) */}
          {step < 4 && (
            <div className={`flex items-center mt-6 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="h-btn px-5 border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <i className="ri-arrow-left-line mr-1.5"></i>Back
                </button>
              )}
              <button
                onClick={handleContinue}
                className="h-btn px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
              >
                Continue<i className="ri-arrow-right-line ml-1.5"></i>
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="mt-4">
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors"
              >
                <i className="ri-arrow-left-line"></i>
                <span className="font-body">Back to plan selection</span>
              </button>
            </div>
          )}
        </div>

        {/* Sign in link */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 font-body mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-amber-500 hover:text-amber-600 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
