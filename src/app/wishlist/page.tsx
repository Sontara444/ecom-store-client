'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleWishlist } from '@/redux/slices/wishlistSlice';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-full mb-4 border border-pink-100">
               <Heart className="w-4 h-4 text-pink-500 fill-current" />
               <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">Your Favorites</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              CURATED <span className="text-pink-500">SELECTIONS</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
             <Link href="/products" className="group flex items-center space-x-2 text-sm font-bold text-secondary hover:text-primary transition-all">
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {wishlistItems.map((item: any) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* We cast item as the ProductCard expects a full product object */}
                  <ProductCard product={{
                    ...item,
                    images: [{ url: item.image }],
                    numReviews: 0,
                    rating: 5,
                    category: 'Saved',
                    stock: 10 // Assumption for wishlist view
                  }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[3rem] border-white/20">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-8">
               <Sparkles className="w-10 h-10 text-pink-300 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight">Your wishlist is pristine</h2>
            <p className="text-secondary font-medium max-w-sm mx-auto mb-10 leading-relaxed">
              Explore our boutique collection and save the pieces that speak to you.
            </p>
            <Link href="/products" className="btn-wow">
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
