'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { saveShippingAddress, clearCart } from '@/redux/slices/cartSlice';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2, PackageCheck } from 'lucide-react';
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
      toast.error('Identity authentication required for checkout');
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
      // 1. Create Order on Backend
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

      // 2. Trigger Razorpay SDK
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'placeholder_key_id',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ShopModern',
        description: 'Premium Lifestyle Payment',
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            await api.put(`/orders/${order._id}/pay`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(clearCart());
            toast.success('Protocol Complete. Order Secured!');
            router.push(`/orders/${order._id}`);
          } catch (err) {
            toast.error('Payment verification failed. Security override check.');
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Identity link failure');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
         <h2 className="text-3xl font-black mb-6">Cart is empty</h2>
         <button onClick={() => router.push('/products')} className="btn-wow">Continue Discovery</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
       {/* Inject razorpay script */}
       <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

       <div className="max-w-4xl mx-auto">
          {/* Multi-step Header */}
          <div className="flex items-center justify-center space-x-4 mb-20">
             {[
               { id: 1, label: 'Identity/Ship', icon: Truck },
               { id: 2, label: 'Review & Pay', icon: PackageCheck }
             ].map((s) => (
               <React.Fragment key={s.id}>
                 <div className={`flex items-center space-x-3 transition-all ${step >= s.id ? 'text-primary' : 'text-slate-300'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= s.id ? 'border-primary bg-indigo-50 shadow-lg shadow-indigo-500/10' : 'border-slate-200'}`}>
                       <s.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest hidden sm:block">{s.label}</span>
                 </div>
                 {s.id === 1 && <div className={`w-12 h-0.5 rounded-full ${step > 1 ? 'bg-primary' : 'bg-slate-100'}`} />}
               </React.Fragment>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
             {/* Left Column: Forms */}
             <div className="space-y-12">
                <AnimatePresence mode="wait">
                   {step === 1 ? (
                     <motion.div
                       key="step1"
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: 20 }}
                       className="space-y-8"
                     >
                        <h2 className="text-3xl font-black tracking-tighter">SHIP TO <span className="text-primary">IDENTITY</span></h2>
                        <form onSubmit={handleNext} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Universal Address</label>
                              <input required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="Street, Apt" />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Metropolis</label>
                                 <input required value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="City" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Zone Code</label>
                                 <input required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="123456" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">Region/Country</label>
                              <input required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="Global Region" />
                           </div>
                           <button type="submit" className="w-full btn-wow py-5 flex items-center justify-center space-x-3 group text-lg">
                              <span>Configure Summary</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                           </button>
                        </form>
                     </motion.div>
                   ) : (
                     <motion.div
                       key="step2"
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: 20 }}
                       className="space-y-10"
                     >
                        <h2 className="text-3xl font-black tracking-tighter">REVIEW <span className="text-primary">TRANSIT</span></h2>
                        
                        <div className="glass p-8 rounded-3xl border-white/50 space-y-6">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2">Destination</span>
                              <p className="font-bold text-slate-800 leading-relaxed">
                                {address}, {city}<br />
                                {postalCode}, {country}
                              </p>
                           </div>
                           <div className="h-[1px] bg-slate-100" />
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2">Execution Protocol</span>
                              <p className="font-black text-indigo-500">Secure Razorpay Network</p>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button 
                             onClick={() => setStep(1)}
                             className="glass p-5 rounded-2xl text-secondary hover:text-foreground transition-all"
                           >
                             <ArrowLeft className="w-6 h-6" />
                           </button>
                           <button 
                             disabled={loading}
                             onClick={handlePlaceOrder} 
                             className="flex-1 btn-wow py-5 flex items-center justify-center space-x-3 text-lg group shadow-indigo-500/30"
                           >
                              {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                              ) : (
                                <>
                                  <span>Finalize Order</span>
                                  <CreditCard className="w-5 h-5" />
                                </>
                              )}
                           </button>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>

             {/* Right Column: Order Summary */}
             <div className="space-y-10">
                <div className="glass p-10 rounded-[2.5rem] border-white/50 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10" />
                   
                   <h3 className="text-xl font-black tracking-tighter mb-8 border-b border-slate-100 pb-6">SUMMARY</h3>
                   
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-secondary">Items Subtotal</span>
                         <span className="font-black">${itemsPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-secondary">Logistics/Shipping</span>
                         <span className="font-black text-emerald-500">{shippingPrice === 0 ? 'COMPLIMENTARY' : `$${shippingPrice}`}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-secondary">Tax Protocol (18%)</span>
                         <span className="font-black">${taxPrice}</span>
                      </div>
                      <div className="h-[1px] bg-slate-100 my-2" />
                      <div className="flex justify-between items-end">
                         <span className="text-sm font-black uppercase tracking-widest text-primary">Final Balance</span>
                         <span className="text-3xl font-black tracking-tighter">${totalPrice}</span>
                      </div>
                   </div>

                   <div className="mt-12 flex items-center space-x-3 text-xs font-bold text-secondary bg-slate-50 p-4 rounded-2xl">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span>Encrypted Transaction Secure via SSL Protocol</span>
                   </div>
                </div>

                {/* Mini Item List */}
                <div className="space-y-6 px-4">
                   {cartItems.map((item) => (
                     <div key={item._id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-xs font-black line-clamp-1">{item.title}</p>
                              <p className="text-[10px] font-bold text-secondary">Qty: {item.quantity}</p>
                           </div>
                        </div>
                        <span className="text-xs font-black">${Math.round(item.price * (1 - item.discount / 100)) * item.quantity}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CheckoutPage;
