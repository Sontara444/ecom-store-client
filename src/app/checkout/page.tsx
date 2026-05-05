'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { saveShippingAddress, clearCart } from '@/redux/slices/cartSlice';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Script from 'next/script';

const CheckoutPage = () => {
   const router = useRouter();
   const dispatch = useDispatch();

   const { cartItems, shippingAddress } = useSelector((state: RootState) => state.cart);
   const { userInfo } = useSelector((state: RootState) => state.auth);

   const [step, setStep] = useState(1);
   const [loading, setLoading] = useState(false);

   // Form states
   const [address, setAddress] = useState(shippingAddress.address || '');
   const [city, setCity] = useState(shippingAddress.city || '');
   const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
   const [country, setCountry] = useState(shippingAddress.country || '');

   useEffect(() => {
      if (!userInfo) {
         toast.error('Please sign in to continue checkout');
         router.push('/login?redirect=checkout');
      }
   }, [userInfo, router]);

   const itemsPrice = cartItems.reduce((acc, item) => {
      const discountedPrice = Math.round(item.price * (1 - item.discount / 100));
      return acc + discountedPrice * item.quantity;
   }, 0);
   const shippingPrice = itemsPrice > 500 ? 0 : 50;
   const taxPrice = Math.round(itemsPrice * 0.18);
   const totalPrice = itemsPrice + shippingPrice + taxPrice;

   const handleNext = (e: React.FormEvent) => {
      e.preventDefault();
      if (step === 1) {
         dispatch(saveShippingAddress({ address, city, postalCode, country }));
      }
      setStep(step + 1);
   };

   const handlePlaceOrder = async () => {
      setLoading(true);
      try {
         const { data } = await api.post('/orders', {
            orderItems: cartItems.map(x => ({
               title: x.title,
               quantity: x.quantity,
               image: x.image,
               price: Math.round(x.price * (1 - x.discount / 100)),
               product: x._id
            })),
            shippingAddress: { address, city, postalCode, country },
            paymentMethod: 'Razorpay',
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
         });

         const { order, razorpayOrder } = data;

         const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'placeholder_key_id',
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'ShopModern',
            description: 'Order Payment',
            order_id: razorpayOrder.id,
            handler: async (response: any) => {
               try {
                  await api.put(`/orders/${order._id}/pay`, {
                     razorpay_payment_id: response.razorpay_payment_id,
                     razorpay_order_id: response.razorpay_order_id,
                     razorpay_signature: response.razorpay_signature,
                  });
                  dispatch(clearCart());
                  toast.success('Payment successful. Order Placed!');
                  router.push(`/orders/${order._id}`);
               } catch (err) {
                  toast.error('Payment verification failed.');
               }
            },
            prefill: {
               name: userInfo.name,
               email: userInfo.email,
            },
            theme: {
               color: '#000000',
            },
         };

         const rzp = new (window as any).Razorpay(options);
         rzp.open();
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Failed to initialize payment');
      } finally {
         setLoading(false);
      }
   };

   if (cartItems.length === 0) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-black">Your cart is empty</h2>
            <button onClick={() => router.push('/products')} className="text-sm font-semibold border-b border-black pb-0.5 text-black hover:opacity-60 transition-opacity">Continue Shopping</button>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
         <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

         <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-semibold tracking-tight text-black mb-12 text-center">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
               {/* Left Column: Forms */}
               <div className="lg:col-span-7 space-y-12">
                  {/* Step Indicator */}
                  <div className="flex items-center space-x-6 border-b border-gray-100 pb-4">
                     <div className={`text-sm font-semibold ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>1. Shipping</div>
                     <div className="w-8 h-[1px] bg-gray-200"></div>
                     <div className={`text-sm font-semibold ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>2. Payment</div>
                  </div>

                  <AnimatePresence mode="wait">
                     {step === 1 ? (
                        <motion.div
                           key="step1"
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 10 }}
                           className="space-y-8"
                        >
                           <h2 className="text-xl font-semibold text-black">Shipping Address</h2>
                           <form onSubmit={handleNext} className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Address</label>
                                 <input required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" placeholder="Street, Apt, Suite" />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
                                    <input required value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" placeholder="City" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Postal Code</label>
                                    <input required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" placeholder="Postal Code" />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Country</label>
                                 <input required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-colors font-medium text-black placeholder:text-gray-400 text-sm" placeholder="Country" />
                              </div>
                              <div className="pt-4">
                                 <button type="submit" className="w-full bg-black text-white py-4 flex items-center justify-center space-x-2 text-sm font-semibold hover:bg-gray-900 transition-colors">
                                    <span>Continue to Payment</span>
                                    <ArrowRight className="w-4 h-4" />
                                 </button>
                              </div>
                           </form>
                        </motion.div>
                     ) : (
                        <motion.div
                           key="step2"
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 10 }}
                           className="space-y-10"
                        >
                           <h2 className="text-xl font-semibold text-black">Payment Details</h2>

                           <div className="border border-gray-200 p-6 space-y-6">
                              <div className="flex flex-col">
                                 <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Ship To</span>
                                 <p className="font-medium text-black text-sm">
                                    {address}, {city}<br />
                                    {postalCode}, {country}
                                 </p>
                              </div>
                              <div className="h-[1px] bg-gray-100" />
                              <div className="flex flex-col">
                                 <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Method</span>
                                 <p className="font-medium text-black text-sm">Credit Card / UPI / Netbanking (Razorpay)</p>
                              </div>
                           </div>

                           <div className="flex gap-4">
                              <button
                                 onClick={() => setStep(1)}
                                 className="px-6 py-4 border border-gray-200 text-gray-500 hover:text-black hover:border-black transition-colors"
                              >
                                 <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                              </button>
                              <button
                                 disabled={loading}
                                 onClick={handlePlaceOrder}
                                 className="flex-1 bg-black text-white py-4 flex items-center justify-center space-x-2 text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
                              >
                                 {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                 ) : (
                                    <span>Pay Now</span>
                                 )}
                              </button>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               {/* Right Column: Order Summary */}
               <div className="lg:col-span-5">
                  <div className="bg-gray-50 border border-gray-100 p-8 space-y-8 sticky top-32">
                     <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-4">Order Summary</h3>

                     {/* Mini Item List */}
                     <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-hide">
                        {cartItems.map((item) => (
                           <div key={item._id} className="flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                 <div className="w-16 h-20 bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-medium text-black line-clamp-1">{item.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                 </div>
                              </div>
                              <span className="text-sm font-semibold text-black">${Math.round(item.price * (1 - item.discount / 100)) * item.quantity}</span>
                           </div>
                        ))}
                     </div>

                     <div className="h-[1px] bg-gray-200" />

                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-gray-600">Subtotal</span>
                           <span className="font-semibold text-black">${itemsPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-gray-600">Shipping</span>
                           <span className="font-semibold text-black">{shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-gray-600">Tax</span>
                           <span className="font-semibold text-black">${taxPrice}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                           <span className="text-sm font-bold uppercase tracking-widest text-black">Total</span>
                           <span className="text-2xl font-bold text-black">${totalPrice}</span>
                        </div>
                     </div>

                     <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 pt-4">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span>Secure encrypted checkout</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckoutPage;
