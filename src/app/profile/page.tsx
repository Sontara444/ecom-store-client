'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateProfile } from '@/redux/slices/authSlice';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name,
        email,
        password: password || undefined,
      });
      dispatch(updateProfile(data));
      toast.success('Identity profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update sequence failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left: Identity Sidebar */}
          <div className="md:w-1/3 space-y-8">
             <div className="text-center md:text-left space-y-6">
                <div className="relative inline-block">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-500 p-1 modern-shadow">
                      <div className="w-full h-full rounded-[2.3rem] bg-white flex items-center justify-center text-4xl font-black text-primary">
                         {userInfo?.name?.charAt(0)}
                      </div>
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl shadow-lg border-4 border-white">
                      <ShieldCheck className="w-4 h-4 text-white" />
                   </div>
                </div>
                <div>
                   <h1 className="text-3xl font-black tracking-tighter">{userInfo?.name}</h1>
                   <p className="text-sm font-bold text-secondary uppercase tracking-widest">{userInfo?.role} Account</p>
                </div>
             </div>

             <div className="glass p-8 rounded-[2rem] border-white/50 space-y-6">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                   </div>
                   <span className="text-xs font-bold text-secondary leading-tight">Identity verified and secure</span>
                </div>
                <div className="h-[1px] bg-slate-100" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Member since {new Date().getFullYear()}</p>
             </div>
          </div>

          {/* Right: Management Form */}
          <div className="md:w-2/3">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass p-10 md:p-14 rounded-[3rem] border-white/50 shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10" />
                
                <h2 className="text-3xl font-black tracking-tighter mb-10">IDENTITY <span className="text-primary">MANAGEMENT</span></h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Full Identity</label>
                        <div className="relative group">
                          <input 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" 
                            placeholder="John Doe" 
                          />
                          <User className="absolute left-4 top-4 text-slate-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Email Interface</label>
                        <div className="relative group">
                          <input 
                            required 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" 
                            placeholder="name@nexus.com" 
                          />
                          <Mail className="absolute left-4 top-4 text-slate-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                   </div>

                   <div className="h-[1px] bg-slate-100 my-4" />

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Update Key (Optional)</label>
                        <div className="relative group">
                          <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" 
                            placeholder="••••••••" 
                          />
                          <Lock className="absolute left-4 top-4 text-slate-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Confirm New Key</label>
                        <div className="relative group">
                          <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full bg-white/50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" 
                            placeholder="••••••••" 
                          />
                          <Lock className="absolute left-4 top-4 text-slate-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        </div>
                      </div>
                   </div>

                   <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full btn-wow py-5 flex items-center justify-center space-x-3 group mt-4"
                   >
                     {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                     ) : (
                       <>
                         <span>Secure Updates</span>
                         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                       </>
                     )}
                   </button>
                </form>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
