import React, { useState } from 'react';
import { User, UserPlus } from 'lucide-react';
import { api } from '../lib/api.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';

interface RegisterProps {
  navigate: (path: string) => void;
  setUser: (user: any | null) => void;
}

export function Register({ navigate, setUser }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    api.register(name, email, password)
      .then((res) => {
        if (res.success && res.data) {
          setUser(res.data);
          navigate('/');
        } else {
          setError(res.error || 'Registration failed. Please try again.');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError('A network connection error occurred.');
        setIsLoading(false);
      });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-amber-50 border border-amber-200 rounded-full text-amber-600">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 tracking-tight">Create an Account</h1>
          <p className="text-xs text-zinc-400">Join DeskSpace to start booking hourly premium workspace solutions.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="•••••••• (Min 6 chars)"
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
            Create Account
          </Button>
        </form>

        {/* Login redirect link */}
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-amber-600 hover:text-amber-700 font-bold hover:underline focus:outline-none cursor-pointer"
            >
              Sign In Here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
