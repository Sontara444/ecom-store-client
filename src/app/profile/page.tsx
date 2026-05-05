'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateProfile } from '@/redux/slices/authSlice';
import api from '@/services/api';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
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
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-black mb-12 border-b border-gray-100 pb-6">Account Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left: Identity Sidebar */}
          <div className="md:w-1/3 space-y-8">
             <div className="flex flex-col items-start space-y-4">
                <div className="w-24 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center text-3xl font-medium text-black">
                   {userInfo?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                   <h2 className="text-xl font-medium text-black">{userInfo?.name}</h2>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{userInfo?.role}</p>
                </div>
             </div>

             <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                   <User className="w-4 h-4" />
                   <span>Personal Information</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer">
                   <Mail className="w-4 h-4" />
                   <span>Email Preferences</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer">
                   <Lock className="w-4 h-4" />
                   <span>Security</span>
                </div>
             </div>
          </div>

          {/* Right: Management Form */}
          <div className="md:w-2/3">
             <div className="bg-gray-50 border border-gray-100 p-8 md:p-12">
                <h2 className="text-lg font-semibold text-black mb-8 border-b border-gray-200 pb-4">Profile Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                        <input 
                          required 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="w-full bg-transparent border-b border-gray-300 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" 
                          placeholder="John Doe" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <input 
                          required 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full bg-transparent border-b border-gray-300 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" 
                          placeholder="name@example.com" 
                        />
                      </div>
                   </div>

                   <div className="h-[1px] bg-gray-200 my-4" />

                   <h3 className="text-sm font-semibold text-black pt-2">Change Password</h3>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
                        <input 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full bg-transparent border-b border-gray-300 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" 
                          placeholder="Leave blank to keep current" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm Password</label>
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          className="w-full bg-transparent border-b border-gray-300 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" 
                          placeholder="Confirm new password" 
                        />
                      </div>
                   </div>

                   <div className="pt-6">
                     <button 
                       type="submit" 
                       disabled={loading}
                       className="w-full sm:w-auto bg-black text-white px-8 py-4 text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                     >
                       {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                       ) : (
                         <>
                           <span>Save Changes</span>
                           <ArrowRight className="w-4 h-4" />
                         </>
                       )}
                     </button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
