'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { Filter, X, ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Fitness'];
const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Top Rated', value: 'rating' },
];

function ProductListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States (from URL)
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts({
          category,
          sort,
          minPrice,
          maxPrice,
          keyword,
          pageNumber: searchParams.get('page') || 1,
        });
        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, category, sort, minPrice, maxPrice, keyword]);

  const updateFilters = (newFilters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1'); // Reset to page 1 on filter
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              OUR <span className="gradient-text">COLLECTION</span>
            </h1>
            <p className="text-secondary font-medium tracking-wide">
              Showing {products.length} refined essentials for your lifestyle.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden glass px-6 py-3 rounded-2xl flex items-center space-x-2 font-bold text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="hidden md:flex items-center glass px-6 py-3 rounded-2xl space-x-4 border-white/40">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              <select 
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-transparent text-sm font-bold outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block space-y-10 sticky top-32 h-fit">
            <div className="glass p-8 rounded-[2rem] border-white/50 space-y-10">
              {/* Category */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-secondary mb-6">Discovery</h3>
                <div className="space-y-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilters({ category: cat })}
                      className={`block w-full text-left text-sm font-bold tracking-wide transition-all ${category === cat ? 'text-primary' : 'text-secondary hover:text-foreground'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-secondary mb-6">Price Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                    className="bg-white/50 border border-slate-100 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                    className="bg-white/50 border border-slate-100 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <button 
                onClick={() => router.push('/products')}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:text-primary transition-all border-t border-slate-100 pt-8"
              >
                Clear All
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/5] rounded-[2rem]" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-indigo-500/20" />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">No products found</h2>
                <p className="text-secondary font-medium">Try adjusting your filters or search keywords.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="mt-16 flex justify-center items-center space-x-4">
                 <button 
                   disabled={Number(searchParams.get('page')) <= 1}
                   onClick={() => updateFilters({ page: (Number(searchParams.get('page')) || 1) - 1 })}
                   className="glass px-6 py-3 rounded-xl text-xs font-bold disabled:opacity-50"
                 >
                   Previous
                 </button>
                 <span className="text-sm font-black tracking-widest px-4">
                    {searchParams.get('page') || 1} / {pages}
                 </span>
                 <button 
                   disabled={Number(searchParams.get('page')) >= pages}
                   onClick={() => updateFilters({ page: (Number(searchParams.get('page')) || 1) + 1 })}
                   className="glass px-6 py-3 rounded-xl text-xs font-bold disabled:opacity-50"
                 >
                   Next Page
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Slider */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[101] shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tighter">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Mobile Mobile Filters could be a subset of sidebar */}
              <div className="space-y-12">
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-6">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                       {CATEGORIES.map(cat => (
                         <button 
                           key={cat}
                           onClick={() => { updateFilters({ category: cat }); setIsFilterOpen(false); }}
                           className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${category === cat ? 'bg-primary text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-secondary'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Sorting Mobile */}
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-6">Sort By</h3>
                    <div className="space-y-4">
                       {SORT_OPTIONS.map(opt => (
                         <button 
                           key={opt.value}
                           onClick={() => { updateFilters({ sort: opt.value }); setIsFilterOpen(false); }}
                           className={`block w-full text-left py-2 font-bold tracking-wide transition-all ${sort === opt.value ? 'text-primary' : 'text-secondary'}`}
                         >
                           {opt.label}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full btn-wow py-4"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Ensure searchParams are handled inside Suspense
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 px-12 text-center font-bold">Loading Discovery Engine...</div>}>
      <ProductListingContent />
    </Suspense>
  );
}
