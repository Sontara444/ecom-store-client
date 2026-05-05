'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import api from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Clock, CheckCircle2, ShoppingBag } from 'lucide-react';
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
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo, router]);

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-b border-gray-100 pb-8">
          <div>
             <h1 className="text-3xl font-semibold tracking-tight text-black mb-2">
               Order History
             </h1>
             <p className="text-sm font-medium text-gray-500">View and track your recent purchases.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-none bg-gray-50" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
             {orders.map((order) => (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 key={order._id}
                 className="bg-white border border-gray-200 p-8 hover:border-black transition-colors group relative overflow-hidden"
               >
                  
                  <div className="flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                     {/* Metadata */}
                     <div className="flex items-center space-x-6 w-full md:w-auto">
                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                           <Package className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                           <h3 className="text-base font-semibold text-black">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                        </div>
                     </div>

                     {/* Stats */}
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full md:w-auto">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                           <p className="text-base font-semibold text-black">${order.totalPrice}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Payment</p>
                           <div className="flex items-center space-x-2">
                              {order.isPaid ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                              ) : (
                                <Clock className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
                              )}
                              <span className={`text-xs font-semibold ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                                {order.isPaid ? 'PAID' : 'PENDING'}
                              </span>
                           </div>
                        </div>
                        <div className="hidden md:block">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</p>
                           <p className="text-xs font-semibold text-gray-600">
                             {order.isDelivered ? 'DELIVERED' : 'PROCESSING'}
                           </p>
                        </div>
                     </div>

                     {/* Action */}
                     <Link 
                       href={`/orders/${order._id}`}
                       className="w-full md:w-auto border border-gray-200 py-3 px-6 flex items-center justify-center space-x-2 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all text-sm font-semibold text-black"
                     >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                     </Link>
                  </div>

                  {/* Order Previews */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4 overflow-hidden">
                     {order.orderItems.slice(0, 4).map((item: any) => (
                       <div key={item._id} className="w-12 h-16 bg-gray-50 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                       </div>
                     ))}
                     {order.orderItems.length > 4 && (
                       <div className="w-12 h-16 bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-100">
                          +{order.orderItems.length - 4}
                       </div>
                     )}
                  </div>
               </motion.div>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 border border-gray-100">
             <ShoppingBag className="w-8 h-8 text-gray-300 mb-6" strokeWidth={1.5} />
             <h2 className="text-xl font-medium mb-2 text-black">No orders yet</h2>
             <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
               When you place an order, it will appear here.
             </p>
             <Link href="/products" className="text-sm font-semibold border-b border-black text-black pb-0.5">
               Start Shopping
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
