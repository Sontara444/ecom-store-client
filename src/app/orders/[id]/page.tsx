'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getOrderById } from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, CreditCard, ArrowLeft, ShieldCheck, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-3xl font-black mb-4 tracking-tighter">ORDER NOT FOUND</h2>
        <Link href="/products" className="btn-wow">Return to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/orders" className="inline-flex items-center space-x-2 text-secondary hover:text-primary transition-all font-bold text-sm mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Track all Shipments</span>
        </Link>

        {/* Status Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-10 rounded-[3rem] border-white/50 mb-12 relative overflow-hidden text-center md:text-left shadow-2xl shadow-indigo-500/5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl -z-10" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
             <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verification Success</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">ORDER <span className="text-primary">CONFIRMED</span></h1>
                <p className="text-secondary font-medium tracking-wide">ID: <span className="font-black text-slate-900">#{order._id.slice(-8).toUpperCase()}</span> • {new Date(order.createdAt).toLocaleDateString()}</p>
             </div>
             
             <div className="text-center md:text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2 block">Total Fulfilled</span>
                <span className="text-5xl font-black tracking-tighter">${order.totalPrice}</span>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Section: Status */}
           <div className="md:col-span-2 space-y-8">
              {/* Timeline Display */}
              <div className="glass p-10 rounded-[2.5rem] border-white/50 space-y-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-secondary mb-8">LOGISTICS PROTOCOL</h3>
                 
                 <div className="space-y-12">
                    <div className="flex items-start space-x-6 relative">
                       <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100" />
                       <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 z-10 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-black tracking-tight mb-1">Payment & Security Verification</p>
                          <p className="text-xs font-bold text-secondary">Completed at {new Date(order.paidAt).toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="flex items-start space-x-6 relative">
                       <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100" />
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all shrink-0 z-10 ${order.isDelivered ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-slate-100 text-slate-300'}`}>
                          <Package className="w-5 h-5" />
                       </div>
                       <div>
                          <p className={`font-black tracking-tight mb-1 ${!order.isDelivered ? 'text-slate-400' : ''}`}>Item Preparation & Sorting</p>
                          <p className="text-xs font-bold text-secondary">{order.isDelivered ? `Finalized at ${new Date(order.deliveredAt).toLocaleString()}` : 'Queue initiated'}</p>
                       </div>
                    </div>

                    <div className="flex items-start space-x-6">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all shrink-0 z-10 ${order.isDelivered ? 'bg-indigo-500 text-white shadow-indigo-500/20' : 'bg-slate-100 text-slate-300'}`}>
                          <Truck className="w-5 h-5" />
                       </div>
                       <div>
                          <p className={`font-black tracking-tight mb-1 ${!order.isDelivered ? 'text-slate-400' : ''}`}>Outbound Transit</p>
                          <p className="text-xs font-bold text-secondary">Awaiting dispatch confirmation</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Order Items */}
              <div className="glass p-10 rounded-[2.5rem] border-white/50 space-y-8">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-secondary mb-8">SECURED SHIPMENTS</h3>
                 <div className="space-y-6">
                    {order.orderItems.map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between group">
                         <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden luxury-border">
                               <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                               <p className="font-bold text-sm tracking-tight">{item.title}</p>
                               <p className="text-[10px] font-black text-secondary">QTY: {item.quantity} • ${item.price}/ea</p>
                            </div>
                         </div>
                         <span className="font-black">${item.price * item.quantity}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Section: Secondary Info */}
           <div className="space-y-8">
              {/* Delivery Address */}
              <div className="glass p-8 rounded-[2.5rem] border-white/50 space-y-6">
                 <MapPin className="w-6 h-6 text-primary" />
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2">Transit Destination</h4>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                       {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                       {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                 </div>
              </div>

              {/* Billing Info */}
              <div className="glass p-8 rounded-[2.5rem] border-white/50 space-y-6">
                 <CreditCard className="w-6 h-6 text-indigo-500" />
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2">Payment Verification</h4>
                    <p className="text-sm font-bold text-slate-800 mb-1">Global Secure Pay (Razorpay)</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Authenticated</p>
                 </div>
              </div>

              {/* Support */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 text-center shadow-xl">
                 <Zap className="w-8 h-8 text-primary mx-auto" />
                 <p className="text-xs font-bold leading-relaxed opacity-80">Need specialized assistance with this protocol?</p>
                 <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:scale-105 transition-all">ESTABLISH COMMMS</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
