'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { getAllProductsAdmin, saveProduct, deleteProduct, getCategories } from '@/lib/data/store';
import { Product, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState<Product[]>(getAllProductsAdmin());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = getCategories();

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stockQuantity, setStockQuantity] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Variants state for modal
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice(1999);
    setCompareAtPrice(2499);
    setSku(`BH-PROD-${Date.now().toString().slice(-4)}`);
    setCategoryId(categories[0]?.id || '');
    setStockQuantity(20);
    setIsActive(true);
    setIsFeatured(false);
    setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
    setVariants([
      { id: 'v-1', product_id: '', title: 'Standard / Medium', sku: 'BH-V1', price: 1999, compare_at_price: 2499, stock_quantity: 10, size: 'Medium', color: 'Default', image_url: null },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setCompareAtPrice(p.compare_at_price || undefined);
    setSku(p.sku || '');
    setCategoryId(p.category_id || categories[0]?.id || '');
    setStockQuantity(p.stock_quantity);
    setIsActive(p.is_active);
    setIsFeatured(p.is_featured);
    setImageUrl(p.images?.[0]?.image_url || '');
    setVariants(p.variants || []);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || price <= 0) {
      toastError('Please provide a valid product title and price.');
      return;
    }

    const saved = saveProduct({
      id: editingProduct?.id,
      title,
      slug: editingProduct?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      price: Number(price),
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      sku,
      category_id: categoryId,
      stock_quantity: Number(stockQuantity),
      is_active: isActive,
      is_featured: isFeatured,
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: editingProduct?.id || '',
          image_url: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          alt_text: title,
          display_order: 1,
          is_primary: true,
        },
      ],
      variants,
    });

    setProducts(getAllProductsAdmin());
    setIsModalOpen(false);
    success(editingProduct ? `Product "${saved.title}" updated!` : `New product created!`);
  };

  const handleDuplicate = (p: Product) => {
    const duplicated = saveProduct({
      ...p,
      id: undefined,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${p.sku}-CP`,
    });
    setProducts(getAllProductsAdmin());
    success(`Duplicated "${duplicated.title}"!`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(id);
      setProducts(getAllProductsAdmin());
      success(`Deleted "${title}".`);
    }
  };

  const toggleActive = (p: Product) => {
    saveProduct({
      id: p.id,
      is_active: !p.is_active,
    });
    setProducts(getAllProductsAdmin());
    success(`Product set to ${!p.is_active ? 'Active' : 'Draft'}`);
  };

  const handleBulkCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock CSV ingestion feedback
      success(`Bulk CSV "${file.name}" simulated! Processed 5 new SKUs into warehouse catalog.`);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category_id === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Add new lifestyle items, edit variants, manage inventory SKUs, and toggle visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-3.5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors">
            <FileSpreadsheet className="w-4 h-4 text-orange-600" />
            <span>Bulk CSV Import</span>
            <input type="file" accept=".csv" onChange={handleBulkCSVImport} className="hidden" />
          </label>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU..."
            className="w-full text-xs p-2.5 pl-9 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs p-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price (PKR)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Variants</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border shrink-0">
                        <Image
                          src={p.images?.[0]?.image_url || 'https://placehold.co/100x100'}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-gray-900 truncate">{p.title}</p>
                        <p className="text-[11px] text-gray-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-gray-700">{p.sku || 'N/A'}</td>

                  <td className="p-4">
                    <span className="font-black text-orange-950 block">{formatPrice(p.price)}</span>
                    {p.compare_at_price && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {formatPrice(p.compare_at_price)}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        p.stock_quantity <= 0
                          ? 'bg-rose-100 text-rose-800'
                          : p.stock_quantity <= 5
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-orange-100 text-orange-900'
                      }`}
                    >
                      {p.stock_quantity} left
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        p.is_active
                          ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{p.is_active ? 'Active' : 'Draft'}</span>
                    </button>
                  </td>

                  <td className="p-4 text-gray-500">
                    {p.variants && p.variants.length > 0 ? (
                      <span className="font-medium text-xs text-gray-700">
                        {p.variants.length} options
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">Single SKU</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Duplicate Product"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 text-gray-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-fade-in"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Lifestyle Product' : 'Add New Product to Bazaar'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pure Cotton Men Kurta - Ban Collar"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Price (PKR) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Compare at Price (Strike-through)</label>
                <input
                  type="number"
                  value={compareAtPrice || ''}
                  onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 3499"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Department / Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Total Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Image URL (Unsplash or Supabase)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed material, specifications, sizing guide..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span>Publish as Active (Visible in Store)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

