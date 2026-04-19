'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFail } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [userInfo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest());
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(data));
      toast.success('Welcome back to the future!');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      dispatch(loginFail(message));
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-[2rem] p-10 shadow-2xl border-white/50 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
          
          <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl mb-4">
              <Sparkles className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              SIGN <span className="text-primary">IN</span>
            </h1>
            <p className="text-sm font-bold text-secondary">
              Access your premium dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-secondary mb-2 ml-1">
                Identity Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-4 top-4 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-secondary mb-2 ml-1">
                Access Key
              </label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-4 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary hover:underline underline-offset-4"
              >
                Reset Credentials?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-wow py-5 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Authenticate</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-bold text-secondary">
            New here?{' '}
            <Link
              href="/register"
              className="text-primary hover:underline underline-offset-4"
            >
              Start Registration
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
