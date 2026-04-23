'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Skeleton from '@/components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Package, ArrowRight, ShieldAlert, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [discount, setDiscount] = useState('0');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Restricted Access: Admin Identity Required');
      router.push('/');
      return;
    }
    fetchProducts();
  }, [userInfo, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/products');
      setProducts(data.products);
    } catch (err) {
      toast.error('Failed to sync inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setTitle(product.title);
      setPrice(product.price.toString());
      setDescription(product.description);
      setBrand(product.brand);
      setCategory(product.category);
      setStock(product.stock.toString());
      setDiscount(product.discount.toString());
      setImageUrl(product.images[0]?.url || '');
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setBrand('');
    setCategory('');
    setStock('');
    setDiscount('0');
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      title,
      price: Number(price),
      description,
      brand,
      category,
      stock: Number(stock),
      discount: Number(discount),
      images: [{ url: imageUrl, public_id: 'manual_upload' }],
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        toast.success('Product updated in ecosystem');
      } else {
        await api.post('/products', productData);
        toast.success('New product initialized successfully');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transaction failure');
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to terminate this product entry?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product terminated');
        fetchProducts();
      } catch (err) {
        toast.error('Termination failure');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
           <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-900 px-4 py-2 rounded-full mb-4 border border-indigo-700">
                <ShieldAlert className="w-4 h-4 text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Admin Terminal</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                INVENTORY <span className="text-primary">CONTROL</span>
              </h1>
           </div>
           
           <button 
             onClick={() => handleOpenModal()}
             className="btn-wow flex items-center space-x-2 py-4 px-8"
           >
              <Plus className="w-5 h-5" />
              <span>Initialize Product</span>
           </button>
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
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Object</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Identity/Brand</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Price/Disc</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Supply</th>
                         <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-secondary text-right">Protocol</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-slate-50/30 transition-colors group">
                           <td className="p-8">
                              <div className="flex items-center space-x-6">
                                 <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden luxury-border">
                                    <img src={product.images[0]?.url} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <p className="font-black text-sm tracking-tight">{product.title}</p>
                                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{product.category}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-8 font-bold text-slate-800 tracking-wide text-sm">{product.brand}</td>
                           <td className="p-8">
                              <p className="font-black text-slate-900">${product.price}</p>
                              {product.discount > 0 && <p className="text-[10px] font-black text-pink-500">-{product.discount}% OFF</p>}
                           </td>
                           <td className="p-8">
                              <div className="flex items-center space-x-2">
                                 <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-pink-500'}`} />
                                 <span className="font-black text-sm">{product.stock} units</span>
                              </div>
                           </td>
                           <td className="p-8 text-right">
                              <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => handleOpenModal(product)}
                                   className="p-3 bg-white rounded-xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                 >
                                    <Edit className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => deleteProduct(product._id)}
                                   className="p-3 bg-white rounded-xl text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]" />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] p-12 z-[201] overflow-y-auto max-h-[90vh] shadow-2xl"
            >
               <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black tracking-tighter">{editingProduct ? 'EDIT' : 'INITIALIZE'} PRODUCT</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                     <X className="w-6 h-6 text-secondary" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Object Name</label>
                        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="E.g. Nexus Watch Pro" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Value Sum ($)</label>
                        <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="299" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Discount (%)</label>
                        <input required type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="10" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Identity/Brand</label>
                        <input required value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="ModernNexus" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Category Hub</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-bold cursor-pointer">
                           <option value="">Select Domain</option>
                           <option value="Electronics">Electronics</option>
                           <option value="Fashion">Fashion</option>
                           <option value="Home">Home</option>
                           <option value="Beauty">Beauty</option>
                           <option value="Fitness">Fitness</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Stock Supply</label>
                        <input required type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="100" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Image Interface URL</label>
                        <input required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium" placeholder="https://..." />
                     </div>
                     <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Specifications/Description</label>
                        <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium resize-none" placeholder="Elaborate on the refined features..." />
                     </div>
                  </div>

                  <button type="submit" className="w-full btn-wow py-6 text-lg">
                     {editingProduct ? 'Commit Updates' : 'Sync New Object'}
                  </button>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
