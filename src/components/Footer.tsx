'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Globe, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="group flex items-center space-x-2 inline-block">
              <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                SHOP<span className="text-primary">MODERN</span>
              </span>
            </Link>
            <p className="text-secondary font-medium leading-relaxed text-sm">
              Elevating your digital lifestyle with premium, curated artifacts designed for the modern aesthetic.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-secondary hover:bg-pink-500 hover:text-white transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Navigation</h3>
            <ul className="space-y-4">
              {['Products', 'Featured Collections', 'Our Narrative', 'Customer Identity'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-secondary hover:text-primary text-sm font-medium transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Support</h3>
            <ul className="space-y-4">
              {['Contact Protocol', 'Shipping Guidelines', 'Return Policy', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-secondary hover:text-primary text-sm font-medium transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Stay Synchronized</h3>
            <p className="text-secondary font-medium text-sm mb-4">
              Join our network for exclusive access to new artifacts and private collections.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="identity@nexus.com" 
                className="w-full bg-slate-50 border-0 rounded-2xl py-3 pl-4 pr-12 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium text-sm"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-xl hover:scale-105 transition-transform"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="h-[1px] bg-slate-100 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} ShopModern Ecosystem. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
