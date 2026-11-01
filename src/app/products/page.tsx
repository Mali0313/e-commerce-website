import React, { Suspense } from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/data/store';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductSortSelect } from '@/components/products/ProductSortSelect';
import { Search } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categories = getCategories();

  const products = getProducts({
    category: resolvedParams.category,
    search: resolvedParams.search,
    sort: resolvedParams.sort || 'newest',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans">
      {/* Breadcrumb & Title */}
      <div className="mb-6">
        <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Catalog</span>
          {resolvedParams.search && (
            <>
              <span>/</span>
              <span className="text-orange-600 font-bold">&quot;{resolvedParams.search}&quot;</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {resolvedParams.search
                ? `Results for "${resolvedParams.search}"`
                : 'All Products & Everyday Essentials'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'} ready for fast dispatch across Pakistan
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Suspense fallback={null}>
              <ProductSortSelect currentSort={resolvedParams.sort || 'newest'} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Clean Category Filter Chips (Instead of bulky sidebar) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            !resolvedParams.category
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Departments
        </Link>
        {categories.map((cat) => {
          const isActive = resolvedParams.category === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Full-Width Product Cards Grid (Clean 4-column layout like Daraz & Amazon) */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
          <p className="text-xs text-gray-500 mb-6">
            We couldn&apos;t find any items matching your search or filters.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-xs"
          >
            View All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
