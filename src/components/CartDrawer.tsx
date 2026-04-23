'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { removeFromCart, addToCart } from '@/redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => {
     const discountedPrice = Math.round(item.price * (1 - item.discount / 100));
     return acc + discountedPrice * item.quantity;
  }, 0);

  const handleUpdateQuantity = (item: any, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty > 0 && newQty <= item.stock) {
      dispatch(addToCart({ ...item, quantity: newQty }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                 <div className="bg-indigo-500/10 p-3 rounded-2xl">
                    <ShoppingBag className="w-6 h-6 text-indigo-500" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black tracking-tighter">SECURE CART</h2>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{cartItems.length} Selection(s)</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item._id} className="flex space-x-6 group">
                     <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 luxury-border">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     </div>
                     <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[8px] font-black uppercase tracking-widest text-secondary mb-1">{item.brand}</p>
                              <h3 className="font-bold text-sm tracking-tight line-clamp-1">{item.title}</h3>
                           </div>
                           <button 
                             onClick={() => dispatch(removeFromCart(item._id))}
                             className="text-slate-300 hover:text-pink-500 transition-colors p-1"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                           {/* Qty Selector */}
                           <div className="flex items-center glass px-1.5 py-1 rounded-xl">
                              <button 
                                onClick={() => handleUpdateQuantity(item, -1)}
                                className="p-1 hover:bg-white rounded-lg transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateQuantity(item, 1)}
                                className="p-1 hover:bg-white rounded-lg transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                           </div>
                           
                           <div className="text-right">
                              <span className="text-sm font-black text-foreground">
                                ${Math.round(item.price * (1 - item.discount / 100)) * item.quantity}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                   <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-indigo-500" />
                   </div>
                   <p className="text-xs font-bold uppercase tracking-[0.3em]">Your cart is currently empty</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-white border-t border-slate-100 space-y-6 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
               <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] mb-1">Subtotal</span>
                     <span className="text-3xl font-black tracking-tighter text-foreground">${subtotal}</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-loose">Calculated at Checkout</span>
               </div>

               <Link 
                 href="/checkout"
                 onClick={onClose}
                 className="w-full btn-wow py-5 flex items-center justify-center space-x-3 text-lg group"
               >
                 <span>Proceed to Identity & Pay</span>
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               
               <p className="text-[10px] text-center text-slate-400 font-medium">
                 Secure checkout powered by <span className="font-black text-indigo-500">RAZORPAY</span>
               </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
