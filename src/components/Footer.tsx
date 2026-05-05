'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-black hover:opacity-70 transition-opacity">
              SHOPMODERN.
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Premium, curated artifacts designed for the modern aesthetic. Elevate your everyday.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Navigation</h3>
            <ul className="space-y-4">
              {['Shop', 'Collections', 'Editorial', 'Account'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Editorial' ? '/about' : '/products'}
                    className="text-gray-500 hover:text-black text-sm font-medium transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Support</h3>
            <ul className="space-y-4">
              {['Contact Us', 'Shipping Info', 'Returns', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-500 hover:text-black text-sm font-medium transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Newsletter</h3>
            <p className="text-gray-500 font-medium text-sm mb-4">
              Join for exclusive access to new collections and drops.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-gray-300 py-3 pr-8 outline-none focus:border-black transition-colors font-medium text-sm text-black placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-0 top-3 text-black hover:opacity-60 transition-opacity"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400">
            &copy; {new Date().getFullYear()} ShopModern. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link href="#" className="text-xs font-medium text-gray-400 hover:text-black transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-xs font-medium text-gray-400 hover:text-black transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
