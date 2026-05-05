'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/products?keyword=${keyword}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-black hover:opacity-70 transition-opacity">
            SHOPMODERN.
          </Link>
        </div>

        {/* Nav Items */}
        <div className="hidden md:flex flex-1 justify-center space-x-12">
          {['Shop', 'Collections', 'Editorial'].map((item) => (
            <Link
              key={item}
              href={item === 'Shop' ? '/products' : item === 'Collections' ? '/products?keyword=premium' : '/products'}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
          <form onSubmit={submitHandler} className="w-full relative group">
            <input
              type="text"
              name="q"
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-50 border border-transparent hover:border-gray-200 focus:border-black rounded-none py-2.5 pl-10 pr-4 outline-none transition-all font-medium text-sm text-black"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
          </form>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/wishlist" className="text-black hover:opacity-60 transition-opacity">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-black hover:opacity-60 transition-opacity relative"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>

          <div className="h-5 w-[1px] bg-gray-200 mx-2" />

          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium">
                  {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} group-hover:text-black`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-48 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 rounded-lg overflow-hidden py-2"
                  >
                    <Link href="/profile" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors">
                      Orders
                    </Link>
                    {userInfo.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-50 transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="h-[1px] bg-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-black hover:opacity-60 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-black"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black"
          >
            {isOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {['Shop', 'Collections', 'Wishlist', 'Profile'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Shop' ? '/products' : item === 'Collections' ? '/products?keyword=premium' : `/${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-black"
                >
                  {item}
                </Link>
              ))}
              {!userInfo && (
                <Link href="/login" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-black pt-4 border-t border-gray-100">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
