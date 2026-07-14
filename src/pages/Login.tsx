import React, { useState } from 'react';
import { LogIn, Sparkles, ShieldCheck, Mail, Lock } from 'lucide-react';
import { User } from '../types.js';
import { api } from '../lib/api.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';

interface LoginProps {
  navigate: (path: string) => void;
  setUser: (user: User | null) => void;
}

export function Login({ navigate, setUser }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    api.login(email, password)
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
          navigate('/');
        } else {
          setError(res.error || 'Invalid email or password.');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError('A network connection error occurred.');
        setIsLoading(false);
      });
  };

  // Auto-fill and immediately submit demo credentials
  const handleAutofillDemo = (role: 'user' | 'admin') => {
    setError(null);
    setIsLoading(true);

    const demoEmail = role === 'admin' ? 'admin@deskspace.com' : 'user@deskspace.com';
    const demoPassword = 'password123';

    setEmail(demoEmail);
    setPassword(demoPassword);

    // Call API immediately
    api.login(demoEmail, demoPassword)
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
          navigate('/');
        } else {
          setError(res.error || 'Failed to authenticate demo user.');
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError('Network error. Failed to authenticate.');
        setIsLoading(false);
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-amber-50 border border-amber-200 rounded-full text-amber-600">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight">Sign In to DeskSpace</h1>
          <p className="text-xs text-zinc-400">Unlock custom desks and premium acoustic creative studios.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full justify-center py-3 text-sm font-semibold" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Demo Fast Login Helpers */}
        <div className="pt-4 border-t border-zinc-150 space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">Fast Demo Access</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleAutofillDemo('user')}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-zinc-200 hover:border-amber-300 bg-zinc-50 hover:bg-amber-50/20 text-xs font-semibold rounded-lg text-zinc-700 hover:text-amber-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Demo Tenant
            </button>
            <button
              onClick={() => handleAutofillDemo('admin')}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-zinc-200 hover:border-amber-300 bg-zinc-50 hover:bg-amber-50/20 text-xs font-semibold rounded-lg text-zinc-700 hover:text-amber-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" /> Demo Admin
            </button>
          </div>
        </div>

        {/* Sign up links */}
        <div className="text-center">
          <p className="text-xs text-zinc-400">
            Don't have an account yet?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-amber-600 hover:text-amber-700 font-bold hover:underline focus:outline-none cursor-pointer"
            >
              Register Here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
