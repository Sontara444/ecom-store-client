'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col bg-white overflow-hidden selection:bg-black selection:text-white pt-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-6 md:px-12 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
              New Collection 2024
            </span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-black leading-[1.1] mb-8 tracking-tight">
              Elevate <br />
              Your Space.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-lg font-medium">
              Discover a curated selection of premium artifacts designed for the modern minimal aesthetic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link href="/products" className="bg-black text-white hover:bg-gray-900 px-8 py-4 text-center font-medium transition-colors flex items-center justify-center group w-full sm:w-auto">
                Explore Collection
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>

          {/* Minimal Visual Showcase */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 w-full aspect-[4/5] bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={100} strokeWidth={1} className="text-gray-300" />
            </div>
            
            {/* Architectural Accent Box */}
            <div className="absolute -bottom-8 -left-8 w-48 h-64 bg-white border border-gray-200 z-20 flex flex-col items-center justify-center p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-black" strokeWidth={1.5} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-center text-gray-500">Premium Quality</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-16">
          {[
            { title: "Free Shipping", desc: "On orders over $200", icon: Zap },
            { title: "Secure Payment", desc: "100% encrypted", icon: ShieldCheck },
            { title: "Premium Quality", desc: "Crafted to last", icon: Star },
            { title: "Free Returns", desc: "Within 30 days", icon: ArrowRight }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-start group">
              <div className="mb-6 bg-gray-50 p-4 group-hover:bg-black transition-colors duration-300">
                <item.icon className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-base mb-2 text-black">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
