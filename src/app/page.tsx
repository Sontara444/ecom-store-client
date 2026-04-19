'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Zap, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 md:px-12">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-indigo-100 modern-shadow">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                Curated Collection 2024
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-foreground leading-[1] mb-8 tracking-tighter">
              Upgrade Your <br />
              <span className="gradient-text">Lifestyle</span> with <br />
              ShopModern
            </h1>
            
            <p className="text-lg md:text-xl text-secondary mb-10 max-w-lg leading-relaxed font-medium">
              Discover a universe of premium products that blend innovative technology with timeless design. Elevate your everyday.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="btn-wow text-lg group">
                Shop the Drop
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="glass px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center transition-all hover:bg-white/80 active:scale-95"
              >
                Learn More
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs font-bold text-secondary">Joined by 10k+ visionaries</p>
              </div>
            </div>
          </motion.div>

          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden modern-shadow border-4 border-white/50 bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center">
              <ShoppingBag size={200} className="text-indigo-500/20 floating" />
              
              {/* Product Preview Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 -left-6 glass p-4 rounded-3xl shadow-xl z-20 w-48 border-white/50"
              >
                <div className="w-full aspect-square bg-indigo-500/10 rounded-2xl mb-3 flex items-center justify-center">
                  <Zap className="text-indigo-500 w-8 h-8" />
                </div>
                <div className="font-bold text-sm">SmartWatch Pro</div>
                <div className="text-indigo-500 font-black">$299.00</div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 -right-6 glass p-4 rounded-3xl shadow-xl z-20 w-48 border-white/50"
              >
                <div className="w-full aspect-square bg-pink-500/10 rounded-2xl mb-3 flex items-center justify-center">
                  <ShieldCheck className="text-pink-500 w-8 h-8" />
                </div>
                <div className="font-bold text-sm">SafeGuard Plus</div>
                <div className="text-pink-500 font-black">$49.00</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { title: "Global Delivery", icon: Zap },
             { title: "Secure Checkout", icon: ShieldCheck },
             { title: "24/7 Support", icon: Star },
             { title: "Free Returns", icon: ArrowRight }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-white transition-all hover:shadow-xl hover:shadow-indigo-500/5 cursor-default">
               <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                 <item.icon className="text-indigo-500 w-6 h-6" />
               </div>
               <h3 className="font-bold text-sm">{item.title}</h3>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
