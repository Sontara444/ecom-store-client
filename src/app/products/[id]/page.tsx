'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, ShieldCheck, Zap, ArrowLeft, Plus, Minus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addToCart } from '@/redux/slices/cartSlice';
import { toggleWishlist } from '@/redux/slices/wishlistSlice';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some((x) => x._id === id);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Review States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id as string);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      _id: product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      discount: product.discount,
      image: product.images[0]?.url,
      quantity,
      stock: product.stock
    }));
    toast.success('Inventory segment secured in cart');
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0]?.url
    }));
    if (isWishlisted) {
      toast('Identity link removed from wishlist', { icon: '🗑️' });
    } else {
      toast.success('Masterpiece secured in wishlist');
    }
  };

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Identity authentication required to share experience');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Experience synchronized with ecosystem');
      setShowReviewModal(false);
      setComment('');
      // Refresh product data
      const data = await getProductById(id as string);
      setProduct(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Synchronization failure');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square rounded-[3rem]" />
          <div className="space-y-8">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-3xl font-black mb-4">Product Not Found</h2>
        <Link href="/products" className="btn-wow">Return to Gallery</Link>
      </div>
    );
  }

  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs / Back navigation */}
        <Link href="/products" className="inline-flex items-center space-x-2 text-secondary hover:text-primary transition-all font-bold text-sm mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              layoutId={`product-img-${product._id}`}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-white luxury-border modern-shadow"
            >
              <img 
                src={product.images[selectedImage]?.url} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                 <div className="absolute top-8 left-8 bg-pink-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl">
                    LIMITED OFFER: -{product.discount}%
                 </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-24 h-24 rounded-2xl flex-shrink-0 overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-10">
            <div>
               <div className="flex items-center space-x-4 mb-4">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-secondary">{product.brand}</span>
                  <div className="h-1 w-1 bg-slate-300 rounded-full" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">{product.category}</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                 {product.title}
               </h1>
               
               <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-amber-600">{product.rating}</span>
                  </div>
                  <span className="text-sm font-bold text-secondary">{product.numReviews} Verified Reviews</span>
               </div>
            </div>

            <div className="flex flex-col space-y-2">
               {product.discount > 0 && (
                 <span className="text-xl text-slate-400 font-bold line-through tracking-tight">${product.price}</span>
               )}
               <div className="flex items-end space-x-4">
                 <span className="text-5xl font-black text-foreground tracking-tighter">${discountedPrice}</span>
                 <span className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2">Inclusive of Taxes</span>
               </div>
            </div>

            <p className="text-base text-secondary leading-relaxed font-medium">
               {product.description}
            </p>

            <div className="h-[1px] bg-slate-100" />

            {/* Quantity Selector */}
            <div className="space-y-4">
               <span className="text-xs font-black uppercase tracking-widest text-secondary">Adjust Quantity</span>
               <div className="flex items-center space-x-4">
                  <div className="flex items-center glass px-2 py-2 rounded-2xl border-white/50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-white rounded-xl transition-all"><Minus className="w-4 h-4" /></button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-white rounded-xl transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                  <span className="text-xs font-bold text-secondary">
                    {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                  </span>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
               <button 
                 disabled={product.stock === 0}
                 onClick={handleAddToCart}
                 className="btn-wow flex-1 py-5 text-lg group disabled:opacity-50"
               >
                 <ShoppingCart className="mr-3 w-5 h-5" />
                 Secure to Cart
               </button>
               <button 
                 onClick={handleToggleWishlist}
                 className={`glass px-10 py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 group ${isWishlisted ? 'bg-pink-500 text-white' : 'hover:bg-pink-50 hover:text-pink-500 text-foreground'}`}
               >
                  <Heart className={`${isWishlisted ? 'fill-current' : 'group-hover:fill-pink-500'} transition-colors`} />
               </button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-8 pt-10">
               <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="text-xs font-bold text-secondary leading-tight">Authentic <br /> Guarantee</span>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-pink-500" />
                  </div>
                  <span className="text-xs font-bold text-secondary leading-tight">Priority <br /> Fulfillment</span>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section Placeholder */}
        <section className="mt-32 border-t border-slate-100 pt-32">
           <div className="flex items-center justify-between mb-16">
              <h2 className="text-4xl font-black tracking-tight">Voices of <span className="gradient-text">Experiences</span></h2>
              <button 
                onClick={() => userInfo ? setShowReviewModal(true) : toast.error('Sign in to share your experience')}
                className="glass px-8 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all">Review Product</button>
           </div>
           
           {product.reviews?.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {product.reviews.map((review: any) => (
                 <div key={review._id} className="glass p-10 rounded-[2.5rem] border-white/50 space-y-4">
                    <div className="flex justify-between items-start">
                       <span className="font-bold text-slate-900">{review.name}</span>
                       <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-100'}`} />
                          ))}
                       </div>
                    </div>
                    <p className="text-sm text-secondary font-medium leading-relaxed italic">"{review.comment}"</p>
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest block pt-4">Verified Purchase — {new Date(review.createdAt).toLocaleDateString()}</span>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center py-20 text-center glass rounded-[3rem] border-white/20">
                <MessageCircle className="w-12 h-12 text-indigo-500/20 mb-6" />
                <p className="text-secondary font-bold tracking-wide">Become the first to shared your thoughts on this masterpiece.</p>
             </div>
           )}
        </section>

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]" />
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[3rem] p-12 z-[201] shadow-2xl"
              >
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black tracking-tighter text-foreground">SHARE <span className="text-primary">EXPERIENCE</span></h2>
                    <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                       <Plus className="w-6 h-6 text-secondary rotate-45" />
                    </button>
                 </div>

                 <form onSubmit={submitReviewHandler} className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Satisfaction Rating</label>
                       <div className="flex space-x-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none transition-transform active:scale-90"
                            >
                              <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">Detailed Narrative</label>
                       <textarea 
                         required
                         rows={4}
                         value={comment}
                         onChange={(e) => setComment(e.target.value)}
                         className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium resize-none"
                         placeholder="Describe your interaction with this artifact..."
                       />
                    </div>

                    <button 
                      type="submit" 
                      disabled={submittingReview}
                      className="w-full btn-wow py-5 flex items-center justify-center space-x-3"
                    >
                       {submittingReview ? <Plus className="w-6 h-6 animate-spin" /> : <span>Synchronize Review</span>}
                    </button>
                 </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
