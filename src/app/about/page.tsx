'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header Section */}
        <section className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-8 border border-indigo-100">
               <Sparkles className="w-4 h-4 text-indigo-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">The ShopModern Narrative</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
              REDEFINING <span className="text-primary">COMMERCE</span> FOR THE MODERN ERA.
            </h1>
            <p className="text-lg md:text-xl text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
              We are not just a marketplace. We are a curated ecosystem of premium artifacts designed to elevate your digital and physical lifestyle.
            </p>
          </motion.div>
        </section>

        {/* Vision Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="glass p-12 md:p-16 rounded-[3rem] border-white/50 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-colors" />
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 luxury-border">
                 <Target className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4">OUR VISION</h3>
              <p className="text-secondary font-medium leading-relaxed">
                To create a seamless bridge between cutting-edge technology and timeless aesthetics. We source products that don't just solve problems, but do so with uncompromising style and quality.
              </p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="glass p-12 md:p-16 rounded-[3rem] border-white/50 relative overflow-hidden group hover:shadow-2xl hover:shadow-pink-500/10 transition-all"
           >
              <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/5 blur-3xl -z-10 group-hover:bg-pink-500/10 transition-colors" />
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 luxury-border">
                 <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter mb-4">OUR MISSION</h3>
              <p className="text-secondary font-medium leading-relaxed">
                We believe in quality over quantity. Every item in the ShopModern catalog undergoes a rigorous verification process to ensure it meets our standards for performance, design, and sustainability.
              </p>
           </motion.div>
        </section>

        {/* Core Values */}
        <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
           <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">CORE PROTOCOLS</h2>
              <p className="text-slate-400 font-medium">The foundational principles that power the ShopModern ecosystem.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { title: "VELOCITY", desc: "Lightning-fast global logistics and instant interface response times.", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
                { title: "SECURITY", desc: "Military-grade encryption for all transactions and personal data.", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { title: "CURATION", desc: "Only the finest artifacts make it into our exclusive catalog.", icon: Sparkles, color: "text-indigo-400", bg: "bg-indigo-400/10" }
              ].map((val, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${val.bg}`}>
                      <val.icon className={`w-6 h-6 ${val.color}`} />
                   </div>
                   <h4 className="font-black tracking-tight mb-3 text-lg">{val.title}</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-12">
           <h2 className="text-3xl font-black tracking-tighter mb-8">READY TO UPGRADE?</h2>
           <Link href="/products" className="btn-wow inline-flex text-lg px-12 py-5">
              Enter the Gallery
           </Link>
        </section>
      </div>
    </div>
  );
}
