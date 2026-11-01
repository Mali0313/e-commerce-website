import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProducts, getCategories } from '@/lib/data/store';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductSortSelect } from '@/components/products/ProductSortSelect';
import { Layers } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const allCategories = getCategories();
  // If viewing a subcategory, link back to parent department
  const parentCategory = category.parent_id
    ? allCategories.find((c) => c.id === category.parent_id)
    : null;
  const rootCategory = parentCategory || category;
  const subcategories = rootCategory.subcategories || [];

  const products = getProducts({
    category: slug,
    sort: resolvedSearchParams.sort || 'newest',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font-sans">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-3 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-orange-600">Categories</Link>
        {parentCategory && (
          <>
            <span>/</span>
            <Link href={`/category/${parentCategory.slug}`} className="hover:text-orange-600">
              {parentCategory.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-bold">{category.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50/50 to-white border border-orange-100 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-950 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              <span>Department</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl font-medium">
              {category.description || 'Explore our verified range of products in this department.'}
            </p>
          </div>

          {/* Subcategories pills if available (With Vibrant Active Focus Highlight) */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
              {/* All in Department Pill */}
              <Link
                href={`/category/${rootCategory.slug}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  slug === rootCategory.slug
                    ? 'bg-orange-500 text-white border border-orange-500 shadow-md shadow-orange-500/25 ring-2 ring-orange-300/40 scale-105'
                    : 'bg-white border border-orange-200 text-orange-950 hover:bg-orange-50 hover:border-orange-400'
                }`}
              >
                All {rootCategory.name}
              </Link>

              {/* Subcategory Pills */}
              {subcategories.map((sub) => {
                const isActive = slug === sub.slug;
                return (
                  <Link
                    key={sub.id}
                    href={`/category/${sub.slug}`}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                      isActive
                        ? 'bg-orange-500 text-white border border-orange-500 shadow-md shadow-orange-500/25 ring-2 ring-orange-300/40 scale-105'
                        : 'bg-white border border-orange-200 text-orange-950 hover:bg-orange-50 hover:border-orange-400'
                    }`}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clean Header Bar: Items Count + Sort */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/80">
        <p className="text-xs sm:text-sm text-gray-600 font-semibold">
          Showing <strong className="text-gray-950 font-black">{products.length}</strong> items in {category.name}
        </p>

        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <ProductSortSelect currentSort={resolvedSearchParams.sort || 'newest'} />
          </Suspense>
        </div>
      </div>

      {/* Full-Width Product Grid (User only sees products!) */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto my-8">
          <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
          <p className="text-xs text-gray-500 mb-4">
            No items currently available in this category.
          </p>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600"
          >
            Explore All Products
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
