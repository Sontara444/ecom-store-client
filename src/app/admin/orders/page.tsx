'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, ShieldAlert, Eye, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Restricted Access');
      router.push('/');
      return;
    }
    fetchOrders();
  }, [userInfo, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to sync global orders');
    } finally {
      setLoading(false);
    }
  };

  const deliverOrder = async (id: string) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      toast.success('Logistics: Item marked as Delivered');
      fetchOrders();
    } catch (err) {
      toast.error('Fulfillment update failure');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
           <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-900 px-4 py-2 rounded-full mb-4 border border-indigo-700">
                <ShieldAlert className="w-4 h-4 text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Logistics Terminal</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                ORDER <span className="text-primary">FULFILLMENT</span>
              </h1>
           </div>
           
           <div className="flex items-center space-x-4">
              <div className="glass px-6 py-3 rounded-2xl flex items-center space-x-3 text-secondary">
                 <Filter className="w-4 h-4" />
                 <span className="text-xs font-bold whitespace-nowrap">Status: All Transits</span>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="glass rounded-[3rem] border-white/50 overflow-hidden shadow-2xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">ID/User</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Date</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Total Sum</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Pay Status</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Delivered</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50/30 transition-colors group">
                           <td className="p-8">
                              <div>
                                 <p className="font-black text-sm tracking-tight text-indigo-500">#{order._id.slice(-6).toUpperCase()}</p>
                                 <p className="text-xs font-bold text-slate-800">{order.user?.name || 'Anonymous'}</p>
                              </div>
                           </td>
                           <td className="p-8 font-bold text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                           <td className="p-8 font-black text-slate-900">${order.totalPrice}</td>
                           <td className="p-8">
                              {order.isPaid ? (
                                <div className="flex items-center space-x-2 text-emerald-500">
                                   <CheckCircle2 className="w-4 h-4" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Authenticated</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 text-amber-500">
                                   <Clock className="w-4 h-4" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                                </div>
                              )}
                           </td>
                           <td className="p-8">
                              {order.isDelivered ? (
                                <div className="flex items-center space-x-2 text-indigo-500">
                                   <Truck className="w-4 h-4" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => deliverOrder(order._id)}
                                  className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors flex items-center space-x-2"
                                >
                                   <span>Mark Transited</span>
                                   <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                           </td>
                           <td className="p-8 text-right">
                              <Link 
                                href={`/orders/${order._id}`}
                                className="inline-flex p-3 bg-white rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 transition-all shadow-sm"
                              >
                                 <Eye className="w-4 h-4" />
                              </Link>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
