import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getReviewsForProduct } from '@/lib/data/store';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { ProductCard } from '@/components/products/ProductCard';
import { Sparkles } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | BazaarHub',
    };
  }

  const primaryImage = product.images?.[0]?.image_url;

  return {
    title: `${product.title} - Best Price in Pakistan`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | BazaarHub Pakistan`,
      description: product.description.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = getReviewsForProduct(product.id);

  // Fetch related products from same category or general featured
  const relatedProducts = getProducts({
    sort: 'popular',
  })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 lg:pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-orange-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Info View (Gallery, Variants, Cart, Reviews) */}
      <ProductDetailView product={product} initialReviews={reviews} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Frequently Bought Together
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Customers who viewed this item also loved these
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
