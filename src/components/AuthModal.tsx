import React, { useState } from 'react';
import { User } from '../types/index.ts';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle } from 'lucide-react';
import { api } from '../api/client.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAuthSuccess: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onAuthSuccess,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role] = useState<'customer' | 'provider'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onAuthSuccess(res.user);
      } else {
        const res = await api.register(name, email, password, role, phone);
        onAuthSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (selectedRole: 'customer' | 'provider' | 'admin') => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.demoLogin(selectedRole);
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 text-stone-100 w-full max-w-md rounded-2xl shadow-2xl border border-stone-700/80 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div>
            <div className="text-[11px] uppercase font-mono tracking-wider font-semibold text-amber-400">
              JWT Secure Authentication
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {user ? 'Account Profile' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {user ? (
            /* Logged in view */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-stone-950/80 rounded-xl border border-stone-800">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-800 border border-stone-700">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-base">{user.name}</div>
                  <div className="text-xs text-stone-400">{user.email}</div>
                  <div className="text-xs font-semibold text-amber-400 mt-0.5">
                    {user.loyaltyTier} Member · {user.loyaltyPoints ?? 0} Glam Points
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-300 space-y-1.5 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
                <div><strong className="text-white">Role:</strong> {user.role === 'provider' ? 'Service Provider' : user.role === 'admin' ? 'Administrator' : 'Customer'}</div>
                <div><strong className="text-white">Phone:</strong> {user.phone || '+256 772 392 881'}</div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 rounded-xl transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Sign in / Sign up form */
            <>
              {/* Preset 1-Click Demo Logins */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
                  Quick Access Profiles
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/70 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white">Mabirizi (Admin)</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Add Salons</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer')}
                    className="p-2.5 rounded-xl border border-stone-700 bg-stone-950/80 hover:bg-stone-800 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white">Amina (Client)</div>
                    <div className="text-[10px] text-amber-400 font-medium">Gold (1,450 pts)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('provider')}
                    className="p-2.5 rounded-xl border border-stone-700 bg-stone-950/80 hover:bg-stone-800 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white">Camille (Artist)</div>
                    <div className="text-[10px] text-stone-400 font-medium">Kololo Nails</div>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-stone-800 w-full" />
                <span className="bg-stone-900 px-3 text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                  Or use credentials
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Amina Namubiru"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+256 772 000 000"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all cursor-pointer mt-2 shadow-md shadow-amber-500/20"
                >
                  {isLoading
                    ? 'Processing...'
                    : mode === 'login'
                    ? 'Sign In with JWT'
                    : 'Register Account'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-xs text-stone-400 hover:text-amber-300 font-medium underline cursor-pointer"
                >
                  {mode === 'login'
                    ? "Don't have an account? Sign up"
                    : 'Already registered? Sign in'}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
