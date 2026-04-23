'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  ArrowRight, 
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Identity authentication failed: Admin required');
      router.push('/');
      return;
    }

    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/orders/summary');
        setSummary(data);
      } catch (err: any) {
        toast.error('Failed to sync dashboard analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [userInfo, router]);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${summary?.totalSales?.toLocaleString() || '0'}`, 
      icon: TrendingUp, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Active Orders', 
      value: summary?.totalOrders || '0', 
      icon: ShoppingBag, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50' 
    },
    { 
      label: 'Product Range', 
      value: summary?.totalProducts || '0', 
      icon: Package, 
      color: 'text-pink-500', 
      bg: 'bg-pink-50' 
    },
    { 
      label: 'Pending Sync', 
      value: summary?.pendingOrders || '0', 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50' 
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
           <div className="inline-flex items-center space-x-2 bg-indigo-900 px-4 py-2 rounded-full mb-4 border border-indigo-700">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">System Operator</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
             ADMIN <span className="text-primary">TERMINAL</span>
           </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
           {loading ? (
             [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)
           ) : (
             stats.map((stat, i) => (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 key={stat.label}
                 className="glass p-8 rounded-[2.5rem] border-white/50 modern-shadow group hover:scale-[1.02] transition-all"
               >
                  <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform`}>
                     <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
               </motion.div>
             ))
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Recent Orders */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex justify-between items-center px-4">
                 <h2 className="text-xl font-black tracking-tight flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>RECENT TRANSACTIONS</span>
                 </h2>
                 <Link href="/admin/orders" className="text-xs font-bold text-secondary hover:text-primary transition-all flex items-center">
                    See All <ArrowRight className="w-4 h-4 ml-2" />
                 </Link>
              </div>

              <div className="glass rounded-[3rem] border-white/50 overflow-hidden shadow-2xl">
                 {loading ? (
                    <div className="p-12 space-y-4">
                       {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                    </div>
                 ) : summary?.recentOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead>
                             <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-secondary">Identifier</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-secondary">Value</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-secondary">Protocol</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-secondary text-right">View</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {summary.recentOrders.map((order: any) => (
                               <tr key={order._id} className="hover:bg-slate-50/30 transition-colors">
                                  <td className="p-8 font-black text-sm tracking-tight text-slate-800">#{order._id.slice(-8).toUpperCase()}</td>
                                  <td className="p-8 font-black text-slate-900">${order.totalPrice}</td>
                                  <td className="p-8">
                                     <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${order.isPaid ? 'border-emerald-100 bg-emerald-50 text-emerald-500' : 'border-amber-100 bg-amber-50 text-amber-500'}`}>
                                        {order.isPaid ? 'SECURED' : 'PENDING'}
                                     </span>
                                  </td>
                                  <td className="p-8 text-right">
                                     <Link href={`/admin/orders/${order._id}`} className="inline-flex p-3 bg-white rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                                        <ExternalLink className="w-4 h-4" />
                                     </Link>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 ) : (
                    <div className="p-20 text-center text-secondary font-bold">No recent transactions detected.</div>
                 )}
              </div>
           </div>

           {/* Quick Actions */}
           <div className="space-y-8">
              <h2 className="text-xl font-black tracking-tight px-4">MANAGEMENT HUB</h2>
              <div className="space-y-4">
                 {[
                   { label: 'Inventory Control', href: '/admin/products', icon: Package, desc: 'Manage product supply and metadata' },
                   { label: 'Order Processing', href: '/admin/orders', icon: ShoppingBag, desc: 'Track and finalize client shipments' },
                   { label: 'User Analytics', href: '/admin/users', icon: Users, desc: 'Monitor active identity profiles' }
                 ].map((link) => (
                   <Link 
                     key={link.href}
                     href={link.href}
                     className="glass p-8 rounded-[2.5rem] border-white/50 flex flex-col group hover:shadow-xl hover:shadow-indigo-500/10 transition-all border-l-4 border-l-transparent hover:border-l-primary"
                   >
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <link.icon className="w-5 h-5 text-primary" />
                         </div>
                         <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-black tracking-tight text-lg mb-1">{link.label}</h3>
                      <p className="text-xs font-medium text-secondary">{link.desc}</p>
                   </Link>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
