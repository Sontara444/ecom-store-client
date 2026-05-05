'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { removeFromCart, addToCart } from '@/redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ArrowRight, Trash2 } from 'lucide-react';
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold tracking-tight text-black">Your Cart ({cartItems.length})</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8 scrollbar-hide">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item._id} className="flex space-x-6">
                    <div className="w-24 h-32 bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{item.brand}</p>
                          <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <h3 className="font-medium text-black text-sm leading-tight pr-4">{item.title}</h3>
                      </div>

                      <div className="flex items-end justify-between pt-4">
                        {/* Qty Selector */}
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => handleUpdateQuantity(item, -1)}
                            className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-black">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, 1)}
                            className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-black">
                          ${Math.round(item.price * (1 - item.discount / 100)) * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-sm font-medium text-gray-500">Your cart is empty.</p>
                  <button onClick={onClose} className="text-sm font-semibold border-b border-black text-black pb-0.5">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-white border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-gray-500">Subtotal</span>
                <span className="text-2xl font-bold text-black">${subtotal}</span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-black text-white py-4 flex items-center justify-center space-x-2 text-sm font-semibold hover:bg-gray-900 transition-colors"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-center text-gray-400 font-medium mt-4 uppercase tracking-widest">
                Taxes and shipping calculated at checkout.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
