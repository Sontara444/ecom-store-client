'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  brand: string;
  price: number;
  discount: number;
  rating: number;
  numReviews: number;
  images: { url: string }[];
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            -{product.discount}%
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
           <button className="p-3 bg-white rounded-2xl text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl">
             <ShoppingCart className="w-5 h-5" />
           </button>
           <Link href={`/products/${product._id}`} className="p-3 bg-white rounded-2xl text-slate-900 hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl">
             <Eye className="w-5 h-5" />
           </Link>
           <button className="p-3 bg-white rounded-2xl text-slate-900 hover:bg-pink-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-700 shadow-xl">
             <Heart className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{product.brand}</p>
            <Link href={`/products/${product._id}`}>
              <h3 className="font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
            </Link>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">({product.numReviews})</span>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ${product.price}
              </span>
            )}
            <span className="text-xl font-black text-foreground">
              ${discountedPrice}
            </span>
          </div>
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all">
            Quick Add +
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
