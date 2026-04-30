import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { pharmacies, demoOwnerCredentials } from '@/mocks/pharmacy';
import { staffMembers } from '@/mocks/staff';
import type { AuthUser } from '@/mocks/types';

type LoginMode = 'owner' | 'staff';

export default function SignInPage() {
  const { login, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Staff PIN state
  const [selectedStaff, setSelectedStaff] = useState<typeof staffMembers[0] | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinShake, setPinShake] = useState(false);

  const staffOnly = staffMembers.filter(s => s.role === 'staff');
  const pharmacy = pharmacies[0];

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === pharmacy.ownerEmail && password === pharmacy.ownerPassword) {
      const owner = staffMembers.find(s => s.role === 'owner')!;
      const authUser: AuthUser = {
        id: owner.id,
        name: owner.name,
        role: 'owner',
        pharmacyId: pharmacy.id,
        pharmacyName: pharmacy.name,
      };
      login(authUser);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Try the demo account.');
    }
  };

  const handleDemoFill = () => {
    setEmail(demoOwnerCredentials.email);
    setPassword(demoOwnerCredentials.password);
    setError('');
  };

  const handlePinDigit = (digit: string) => {
    if (!selectedStaff) return;
    const newPin = pin + digit;
    if (newPin.length <= 4) {
      setPin(newPin);
      setPinError('');
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === selectedStaff.pin) {
            const authUser: AuthUser = {
              id: selectedStaff.id,
              name: selectedStaff.name,
              role: 'staff',
              pharmacyId: pharmacy.id,
              pharmacyName: pharmacy.name,
            };
            login(authUser);
            navigate('/sell');
          } else {
            setPinShake(true);
            setPinError('Incorrect PIN. Try again.');
            setTimeout(() => { setPin(''); setPinShake(false); }, 600);
          }
        }, 150);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setPinError('');
  };

  const handlePinClear = () => {
    setPin('');
    setPinError('');
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
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body">{pharmacy.name}</p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-gray-100 dark:bg-surface-dark rounded-lg p-1 mb-6 border border-border-light dark:border-border-dark">
          <button
            onClick={() => { setMode('owner'); setError(''); setPin(''); setSelectedStaff(null); }}
            className={`flex-1 h-9 rounded-md text-sm font-medium font-body transition-all cursor-pointer whitespace-nowrap ${mode === 'owner' ? 'bg-white dark:bg-bg-dark text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Owner Login
          </button>
          <button
            onClick={() => { setMode('staff'); setError(''); setPin(''); setSelectedStaff(null); }}
            className={`flex-1 h-9 rounded-md text-sm font-medium font-body transition-all cursor-pointer whitespace-nowrap ${mode === 'staff' ? 'bg-white dark:bg-bg-dark text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Staff Login
          </button>
        </div>

        {/* New pharmacy link */}
        <div className="text-center mb-4">
          <span className="text-xs text-gray-400 dark:text-gray-600 font-body">New pharmacy? </span>
          <a href="/signup" className="text-xs text-primary-500 hover:text-primary-600 font-body font-medium cursor-pointer transition-colors">Create your account →</a>
        </div>

        {/* Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6">
          {mode === 'owner' ? (
            <form onSubmit={handleOwnerLogin} className="space-y-4">
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="owner@klavora.demo"
                  className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-btn px-3 pr-10 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-white text-sm font-body placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-danger-500 text-sm font-body bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2">
                  <i className="ri-error-warning-line flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full h-btn border border-border-light dark:border-border-dark hover:border-primary-500 hover:text-primary-500 text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-flask-line mr-2"></i>Use Demo Account
              </button>
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">owner@klavora.demo / demo1234</p>
              </div>
            </form>
          ) : (
            <div>
              {!selectedStaff ? (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-4">Select your name to continue</p>
                  <div className="grid grid-cols-2 gap-3">
                    {staffOnly.map(staff => (
                      <button
                        key={staff.id}
                        onClick={() => { setSelectedStaff(staff); setPin(''); setPinError(''); }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:border-primary-500 bg-bg-light dark:bg-bg-dark transition-all cursor-pointer group"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-heading font-600 flex-shrink-0"
                          style={{ backgroundColor: staff.color }}
                        >
                          {staff.initials}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white font-body truncate">{staff.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Staff</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => { setSelectedStaff(null); setPin(''); setPinError(''); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 cursor-pointer transition-colors"
                  >
                    <i className="ri-arrow-left-line"></i>
                    <span className="font-body">Back</span>
                  </button>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-heading font-700 mb-2"
                      style={{ backgroundColor: selectedStaff.color }}
                    >
                      {selectedStaff.initials}
                    </div>
                    <p className="text-base font-heading font-600 text-gray-900 dark:text-white mb-1">{selectedStaff.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-body mb-5">Enter your 4-digit PIN</p>

                    {/* PIN dots */}
                    <div className={`flex gap-3 mb-4 ${pinShake ? 'animate-shake' : ''}`}>
                      {[0, 1, 2, 3].map(i => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${i < pin.length ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'}`}
                        />
                      ))}
                    </div>

                    {pinError && (
                      <p className="text-xs text-danger-500 font-body mb-3">{pinError}</p>
                    )}

                    {/* PIN pad */}
                    <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
                      {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (key === '⌫') handlePinDelete();
                            else if (key !== '') handlePinDigit(key);
                          }}
                          disabled={key === ''}
                          className={`h-14 rounded-lg text-lg font-mono font-500 transition-all cursor-pointer whitespace-nowrap
                            ${key === '' ? 'invisible' : ''}
                            ${key === '⌫' ? 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-bg-dark border border-border-light dark:border-border-dark hover:bg-gray-200 dark:hover:bg-gray-800' : 'bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95'}
                          `}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                    {pin.length > 0 && (
                      <button onClick={handlePinClear} className="mt-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-body cursor-pointer transition-colors">
                        Clear
                      </button>
                    )}
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">Demo PIN: {selectedStaff.pin}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
