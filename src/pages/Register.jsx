import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bug, ArrowRight } from 'lucide-react';

export function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    setError('');
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4ed] flex flex-col justify-center items-center p-4 selection:bg-[#c96442]/20 selection:text-[#c96442]">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#c96442] text-[#faf9f5] flex items-center justify-center shadow-sm">
          <Bug className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-serif font-medium tracking-tight text-[#141413]">BugTracker</h1>
      </div>

      {/* Main Register Card */}
      <div className="w-full max-w-md bg-[#faf9f5] border border-[#e8e6dc] rounded-2xl shadow-[rgba(0,0,0,0.06)_0px_8px_30px] p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-serif font-medium text-[#141413]">Create an account</h2>
          <p className="text-xs text-[#87867f] mt-1">
            Get started tracking bugs and features with your team.
          </p>
        </div>

        {error && (
          <div className="bg-[#fdf2f2] border border-[#f5c6cb] text-[#b53333] text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1.5">Full name</label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-lg px-3.5 py-2.5 text-[#141413] placeholder:text-[#87867f] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1.5">Email address</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-lg px-3.5 py-2.5 text-[#141413] placeholder:text-[#87867f] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
            />
          </div>

          <div>
            <label className="block text-[#5e5d59] font-medium text-xs mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f5f4ed] border border-[#e8e6dc] focus:border-[#3898ec] rounded-lg px-3.5 py-2.5 text-[#141413] placeholder:text-[#87867f] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#c96442] hover:bg-[#b85737] active:bg-[#a84c2e] disabled:opacity-50 text-[#faf9f5] rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center text-xs text-[#87867f] pt-2 border-t border-[#f0eee6]">
          <span>Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-[#c96442] hover:text-[#b85737] font-semibold underline underline-offset-4"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
