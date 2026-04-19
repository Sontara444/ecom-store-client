'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { ShoppingCart, Heart, Search, Menu, X, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
  };

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 ${scrolled ? 'top-2' : ''}`}>
      <div className={`glass rounded-2xl md:rounded-[2rem] px-6 md:px-10 py-3 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-indigo-500/10 border-white/40' : 'border-white/20'}`}>
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                SHOP<span className="text-primary">MODERN</span>
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex flex-1 justify-center space-x-10">
            {['Products', 'Featured', 'Narrative'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="text-sm font-bold text-secondary hover:text-primary transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-secondary hover:text-primary">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/wishlist" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-secondary hover:text-accent">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 hover:bg-indigo-50 rounded-full transition-colors text-indigo-500 relative group">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white">
                0
              </span>
            </Link>
            
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 px-2 py-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {userInfo?.name?.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-foreground">{userInfo?.name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-3 h-3 text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 glass rounded-2xl shadow-2xl p-2 border-white/50"
                    >
                      <Link href="/profile" className="flex items-center px-4 py-3 text-sm font-bold text-secondary hover:text-primary hover:bg-indigo-50 rounded-xl transition-all">
                        Profile Details
                      </Link>
                      <Link href="/orders" className="flex items-center px-4 py-3 text-sm font-bold text-secondary hover:text-primary hover:bg-indigo-50 rounded-xl transition-all">
                        Order Track
                      </Link>
                      {userInfo.role === 'admin' && (
                        <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-black text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          Admin Panel
                        </Link>
                      )}
                      <div className="h-[1px] bg-slate-100 my-2 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-pink-500 hover:bg-pink-50 rounded-xl transition-all flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-indigo-500">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white">
                0
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden mt-2 glass rounded-2xl p-4 space-y-2 border-white/50 shadow-2xl"
          >
            {['Products', 'Featured', 'Wishlist', 'Profile'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-secondary hover:text-primary hover:bg-indigo-50 transition-all"
              >
                {item}
              </Link>
            ))}
            {!userInfo && (
              <Link href="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-bold text-primary bg-indigo-50">
                Sign In / Join
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
