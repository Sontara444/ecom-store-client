'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ArrowLeft, Plus, Minus, X } from 'lucide-react';
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
    toast.success('Added to cart');
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
      toast('Removed from wishlist');
    } else {
      toast.success('Added to wishlist');
    }
  };

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Sign in required to review');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully');
      setShowReviewModal(false);
      setComment('');
      // Refresh product data
      const data = await getProductById(id as string);
      setProduct(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square bg-gray-50 rounded-none" />
          <div className="space-y-8">
            <Skeleton className="h-4 w-1/4 bg-gray-50" />
            <Skeleton className="h-10 w-3/4 bg-gray-50" />
            <Skeleton className="h-6 w-1/2 bg-gray-50" />
            <Skeleton className="h-32 w-full bg-gray-50" />
            <Skeleton className="h-16 w-full bg-gray-50" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-white">
        <h2 className="text-2xl font-medium mb-4 text-black">Product Not Found</h2>
        <Link href="/products" className="border-b border-black text-black pb-1">Return to Shop</Link>
      </div>
    );
  }

  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/products" className="inline-flex items-center space-x-2 text-gray-500 hover:text-black transition-colors font-medium text-sm mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          <span>Back to Collection</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Gallery */}
          <div className="space-y-6 lg:sticky lg:top-32">
            <motion.div 
              layoutId={`product-img-${product._id}`}
              className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100"
            >
              <img 
                src={product.images[selectedImage]?.url} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                 <div className="absolute top-6 left-6 bg-black text-white text-xs font-medium px-3 py-1.5">
                    -{product.discount}% OFF
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
                    className={`w-24 h-24 flex-shrink-0 overflow-hidden border transition-all ${selectedImage === i ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-10 flex flex-col pt-4">
            <div>
               <div className="flex items-center space-x-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.brand}</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-black">
                 {product.title}
               </h1>
               
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-black text-black" />
                    <span className="text-sm font-semibold text-black">{product.rating}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">({product.numReviews} Reviews)</span>
               </div>
            </div>

            <div className="flex flex-col space-y-1">
               {product.discount > 0 && (
                 <span className="text-lg text-gray-400 font-medium line-through">${product.price}</span>
               )}
               <div className="flex items-end space-x-4">
                 <span className="text-4xl font-semibold text-black">${discountedPrice}</span>
               </div>
            </div>

            <p className="text-base text-gray-600 leading-relaxed font-medium">
               {product.description}
            </p>

            <div className="h-[1px] bg-gray-100" />

            {/* Quantity Selector */}
            <div className="space-y-4">
               <span className="text-xs font-bold uppercase tracking-widest text-black">Quantity</span>
               <div className="flex items-center space-x-6">
                  <div className="flex items-center border border-gray-200">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors"><Minus className="w-4 h-4" strokeWidth={1.5} /></button>
                    <span className="w-12 text-center font-semibold text-sm text-black">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors"><Plus className="w-4 h-4" strokeWidth={1.5} /></button>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
               <button 
                 disabled={product.stock === 0}
                 onClick={handleAddToCart}
                 className="bg-black text-white hover:bg-gray-900 flex-1 py-4 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
               >
                 Add to Cart
               </button>
               <button 
                 onClick={handleToggleWishlist}
                 className={`px-6 py-4 font-semibold text-sm transition-all border ${isWishlisted ? 'border-black text-black' : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'}`}
               >
                  <Heart className={`w-5 h-5 mx-auto ${isWishlisted ? 'fill-current' : ''}`} strokeWidth={1.5} />
               </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-32 pt-24 border-t border-gray-100">
           <div className="flex items-center justify-between mb-16">
              <h2 className="text-2xl font-semibold tracking-tight text-black">Customer Reviews</h2>
              <button 
                onClick={() => userInfo ? setShowReviewModal(true) : toast.error('Sign in to leave a review')}
                className="border-b border-black pb-0.5 text-sm font-semibold text-black hover:opacity-60 transition-opacity">Write a Review</button>
           </div>
           
           {product.reviews?.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {product.reviews.map((review: any) => (
                 <div key={review._id} className="space-y-4">
                    <div className="flex justify-between items-start">
                       <span className="font-semibold text-black">{review.name}</span>
                       <div className="flex text-black">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                       </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">"{review.comment}"</p>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block pt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center py-24 text-center bg-gray-50 border border-gray-100">
                <p className="text-gray-500 font-medium mb-4">No reviews yet.</p>
                <button 
                  onClick={() => userInfo ? setShowReviewModal(true) : toast.error('Sign in to leave a review')}
                  className="text-sm font-semibold border-b border-black text-black pb-0.5"
                >
                  Be the first to review
                </button>
             </div>
           )}
        </section>

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]" />
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 20 }}
                 className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-10 z-[201] shadow-2xl"
              >
                 <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-black">Write a Review</h2>
                    <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-black transition-colors">
                       <X className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                 </div>

                 <form onSubmit={submitReviewHandler} className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Rating</label>
                       <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none transition-transform active:scale-95"
                            >
                              <Star className={`w-6 h-6 ${star <= rating ? 'fill-black text-black' : 'text-gray-200'}`} />
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Your Review</label>
                       <textarea 
                         required
                         rows={4}
                         value={comment}
                         onChange={(e) => setComment(e.target.value)}
                         className="w-full bg-transparent border border-gray-200 p-4 outline-none focus:border-black transition-colors font-medium resize-none text-sm text-black placeholder:text-gray-400"
                         placeholder="What did you like or dislike?"
                       />
                    </div>

                    <button 
                      type="submit" 
                      disabled={submittingReview}
                      className="w-full bg-black text-white py-4 font-semibold text-sm hover:bg-gray-900 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                       {submittingReview ? <span className="animate-pulse">Submitting...</span> : <span>Submit Review</span>}
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
