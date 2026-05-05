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
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-3">
              Shop Collection
            </h1>
            <p className="text-gray-500 font-medium">
              Showing {products.length} refined essentials.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden border border-gray-200 px-6 py-2.5 flex items-center space-x-2 font-medium text-sm text-black hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="hidden md:flex items-center border border-gray-200 px-6 py-2.5 space-x-4 hover:border-gray-300 transition-colors bg-white">
              <SlidersHorizontal className="w-4 h-4 text-black" strokeWidth={1.5} />
              <select 
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-transparent text-sm font-medium text-black outline-none cursor-pointer"
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
          <aside className="hidden lg:block space-y-10 sticky top-32 h-fit pr-8">
            <div className="space-y-12">
              {/* Category */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Categories</h3>
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilters({ category: cat })}
                      className={`block w-full text-left text-sm font-medium transition-all ${category === cat ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Price Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                    className="w-full bg-transparent border-b border-gray-200 py-2 text-sm font-medium outline-none focus:border-black transition-colors text-black placeholder:text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                    className="w-full bg-transparent border-b border-gray-200 py-2 text-sm font-medium outline-none focus:border-black transition-colors text-black placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Reset Filters */}
              <button 
                onClick={() => router.push('/products')}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-t border-gray-100"
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
                    <Skeleton className="aspect-[4/5] rounded-none bg-gray-100" />
                    <Skeleton className="h-4 w-1/2 bg-gray-100" />
                    <Skeleton className="h-6 w-full bg-gray-100" />
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
              <div className="flex flex-col items-center justify-center py-32 text-center border border-gray-100 bg-gray-50">
                <Search className="w-8 h-8 text-gray-300 mb-4" strokeWidth={1} />
                <h2 className="text-xl font-medium text-black mb-2">No products found</h2>
                <p className="text-sm text-gray-500">Try adjusting your filters or search keywords.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="mt-20 flex justify-center items-center space-x-6 border-t border-gray-100 pt-8">
                 <button 
                   disabled={Number(searchParams.get('page')) <= 1}
                   onClick={() => updateFilters({ page: (Number(searchParams.get('page')) || 1) - 1 })}
                   className="text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-60 transition-opacity uppercase tracking-widest"
                 >
                   Previous
                 </button>
                 <span className="text-sm font-semibold text-black">
                    {searchParams.get('page') || 1} / {pages}
                 </span>
                 <button 
                   disabled={Number(searchParams.get('page')) >= pages}
                   onClick={() => updateFilters({ page: (Number(searchParams.get('page')) || 1) + 1 })}
                   className="text-sm font-medium text-black disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-60 transition-opacity uppercase tracking-widest"
                 >
                   Next
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl p-8 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-black">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-black">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-10 flex-grow overflow-y-auto">
                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Categories</h3>
                    <div className="flex flex-col space-y-4">
                       {CATEGORIES.map(cat => (
                         <button 
                           key={cat}
                           onClick={() => { updateFilters({ category: cat }); setIsFilterOpen(false); }}
                           className={`text-left text-sm font-medium transition-colors ${category === cat ? 'text-black font-semibold' : 'text-gray-500'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6">Sort By</h3>
                    <div className="flex flex-col space-y-4">
                       {SORT_OPTIONS.map(opt => (
                         <button 
                           key={opt.value}
                           onClick={() => { updateFilters({ sort: opt.value }); setIsFilterOpen(false); }}
                           className={`text-left text-sm font-medium transition-colors ${sort === opt.value ? 'text-black font-semibold' : 'text-gray-500'}`}
                         >
                           {opt.label}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100 mt-auto">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-black text-white py-4 text-sm font-bold hover:bg-gray-900 transition-colors"
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
    <Suspense fallback={<div className="min-h-screen pt-32 px-12 text-center text-sm font-medium text-gray-500 bg-white">Loading Collection...</div>}>
      <ProductListingContent />
    </Suspense>
  );
}
