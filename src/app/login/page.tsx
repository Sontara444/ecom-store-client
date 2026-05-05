'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, loginSuccess, loginFail } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
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
      toast.success('Sign in successful');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      dispatch(loginFail(message));
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white pt-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-2 text-black">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Welcome back to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                 Password
               </label>
               <Link
                 href="/forgot-password"
                 className="text-xs font-semibold text-black hover:opacity-60 transition-opacity"
               >
                 Forgot?
               </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center disabled:opacity-50 mt-8"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-black font-semibold border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
          >
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
