'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import api from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Clock, CheckCircle2, ShoppingBag, Search } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err: any) {
        toast.error('Identity sync failed');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo, router]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
             <div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-4 border border-indigo-100">
                <Package className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Transit Protocols</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
               MY <span className="text-primary">SHIPMENTS</span>
             </h1>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="glass px-6 py-3 rounded-2xl flex items-center space-x-3 text-secondary">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold whitespace-nowrap">Updated Cycle: Real-time</span>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-[2.5rem]" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
             {orders.map((order) => (
               <motion.div
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 key={order._id}
                 className="glass p-8 md:p-12 rounded-[2.5rem] border-white/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10" />
                  
                  <div className="flex flex-col md:flex-row justify-between gap-12 items-center md:items-center">
                     {/* Metadata */}
                     <div className="flex items-center space-x-8 w-full md:w-auto">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center luxury-border shadow-inner">
                           <Package className="w-8 h-8 text-indigo-500/30" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">IDENTIFIER: #{order._id.slice(-8).toUpperCase()}</p>
                           <h3 className="text-xl font-black tracking-tighter">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                        </div>
                     </div>

                     {/* Stats */}
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full md:w-auto">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">Value Sum</p>
                           <p className="text-xl font-black">${order.totalPrice}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">Status</p>
                           <div className="flex items-center space-x-2">
                              {order.isPaid ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500" />
                              )}
                              <span className={`text-xs font-black uppercase tracking-widest ${order.isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {order.isPaid ? 'AUTHENTICATED' : 'AWAITING PAY'}
                              </span>
                           </div>
                        </div>
                        <div className="hidden md:block">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">Transit</p>
                           <p className="text-xs font-black uppercase tracking-widest text-indigo-500">
                             {order.isDelivered ? 'FINALIZED' : 'IN PROCESSING'}
                           </p>
                        </div>
                     </div>

                     {/* Action */}
                     <Link 
                       href={`/orders/${order._id}`}
                       className="w-full md:w-auto btn-wow py-4 px-8 flex items-center justify-center space-x-3 group"
                     >
                        <span className="text-sm">Inspect Protocol</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>

                  {/* Order Previews */}
                  <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4 overflow-hidden">
                     {order.orderItems.slice(0, 4).map((item: any) => (
                       <div key={item._id} className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden luxury-border opacity-60">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                       </div>
                     ))}
                     {order.orderItems.length > 4 && (
                       <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-secondary">
                          +{order.orderItems.length - 4}
                       </div>
                     )}
                  </div>
               </motion.div>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-[3rem] border-white/20">
             <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                <ShoppingBag className="w-10 h-10 text-indigo-500/20" />
             </div>
             <h2 className="text-3xl font-black mb-4 tracking-tighter">Your logistics tray is empty</h2>
             <p className="text-secondary font-medium max-w-sm mx-auto mb-10 leading-relaxed">
               Secure your first shipment from our curated discovery engine to initialize tracking.
             </p>
             <Link href="/products" className="btn-wow">
               Initialize Discovery
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
