'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { toggleWishlist } from '@/redux/slices/wishlistSlice';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';

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
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some((x) => x._id === product._id);

  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0]?.url
    }));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      discount: product.discount,
      image: product.images[0]?.url,
      quantity: 1,
      stock: product.stock
    }));
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white border border-gray-100 hover:border-gray-300 transition-colors duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs font-medium px-2.5 py-1">
            -{product.discount}%
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transform translate-y-4 group-hover:translate-y-0">
            <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <Link href={`/products/${product._id}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transform translate-y-4 group-hover:translate-y-0">
            <Eye className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <button
            onClick={handleToggleWishlist}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-700 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transform translate-y-4 group-hover:translate-y-0 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{product.brand}</p>
            <Link href={`/products/${product._id}`}>
              <h3 className="font-medium text-black hover:opacity-60 transition-opacity line-clamp-1">{product.title}</h3>
            </Link>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between mt-4">
          <div className="flex space-x-2 items-center">
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price}
              </span>
            )}
            <span className="text-lg font-semibold text-black">
              ${discountedPrice}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="text-xs font-semibold uppercase tracking-wider text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
