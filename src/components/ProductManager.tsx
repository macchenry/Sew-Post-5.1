import React, { useState } from 'react';
import { Package, Plus, Pencil, Trash2, X, Image as ImageIcon, Check } from 'lucide-react';

interface Product {
  id: number;
  shop_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  gallery_images: string; // JSON string
  category: string;
  tags: string; // JSON string
}

interface ProductManagerProps {
  shopId: number;
  initialProducts: Product[];
  onProductsChange: () => void;
}

export function ProductManager({ shopId, initialProducts, onProductsChange }: ProductManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const products = initialProducts;

  const categories = ["Traditional", "Modern", "Luxury", "Streetwear", "Bespoke"];

  const handleEdit = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentProduct({
      shop_id: shopId,
      name: "",
      description: "",
      price: 0,
      image_url: "",
      gallery_images: "[]",
      category: categories[0],
      tags: "[]",
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        onProductsChange();
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    setIsSaving(true);
    try {
      let parsedTags = [];
      try {
        parsedTags = typeof currentProduct.tags === 'string' ? JSON.parse(currentProduct.tags) : currentProduct.tags;
      } catch {
        // If it's a comma separated string, try to split
        if (typeof currentProduct.tags === 'string') {
           parsedTags = currentProduct.tags.split(',').map(t => t.trim()).filter(Boolean);
        }
      }

      const payload = {
        ...currentProduct,
        tags: parsedTags,
        gallery_images: typeof currentProduct.gallery_images === 'string' ? JSON.parse(currentProduct.gallery_images || '[]') : currentProduct.gallery_images
      };

      if (currentProduct.id) {
        await fetch(`/api/products/${currentProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsEditing(false);
      setCurrentProduct(null);
      onProductsChange();
    } catch (err) {
      console.error("Failed to save product", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-stone-500" />
          <h2 className="text-xl font-serif font-semibold text-stone-900">
            Product Management
          </h2>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50 hover:bg-white hover:shadow-sm transition-all">
            <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden shrink-0 border border-stone-200">
              {product.image_url ? (
                <img loading="lazy" src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-stone-900 truncate">{product.name}</h3>
              <p className="text-sm text-stone-500 line-clamp-1">{product.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium text-stone-900">${product.price.toFixed(2)}</span>
                {product.category && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-4 border-l border-stone-200">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {deleteConfirm === product.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-12 text-stone-500 border-2 border-dashed border-stone-200 rounded-xl">
            <Package className="w-8 h-8 mx-auto mb-3 text-stone-300" />
            <p>No products found. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isEditing && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {currentProduct.id ? "Edit Product" : "New Product"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form id="product-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={currentProduct.name || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={currentProduct.description || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={currentProduct.price || 0}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                    <select
                      value={currentProduct.category || categories[0]}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={typeof currentProduct.tags === 'string' ? currentProduct.tags : (currentProduct.tags ? JSON.parse(currentProduct.tags).join(', ') : '')}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, tags: e.target.value })}
                    placeholder="e.g., summer, casual, traditional"
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={currentProduct.image_url || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Gallery Images URLs (JSON array string)</label>
                  <input
                    type="text"
                    value={currentProduct.gallery_images || "[]"}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, gallery_images: e.target.value })}
                    placeholder='["url1", "url2"]'
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono text-sm"
                  />
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-stone-100 flex items-center justify-end gap-3 bg-stone-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={isSaving}
                className="flex items-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : <><Check className="w-4 h-4" /> Save Product</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
