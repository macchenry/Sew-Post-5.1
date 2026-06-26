import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Store, ArrowLeft, Tag, Image as ImageIcon } from "lucide-react";

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
  shop_name?: string;
  shop_logo?: string;
}

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data.product);
        setActiveImage(data.product.image_url || "");
        setRelatedProducts(data.relatedProducts || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-stone-500 font-medium">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-stone-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shops" className="text-stone-900 font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shops
        </Link>
      </div>
    );
  }

  let parsedGallery: string[] = [];
  try {
    parsedGallery = JSON.parse(product.gallery_images || "[]");
  } catch (e) {
    console.error("Failed to parse gallery images", e);
  }

  let parsedTags: string[] = [];
  try {
    parsedTags = JSON.parse(product.tags || "[]");
  } catch (e) {
    if (typeof product.tags === "string") {
      parsedTags = product.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }

  const allImages = [product.image_url, ...parsedGallery].filter(Boolean);

  return (
    <div className="space-y-12 pb-12">
      <Link to={`/shops/${product.shop_id}`} className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to {product.shop_name}
      </Link>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 flex items-center justify-center">
              {activeImage ? (
                <img loading="lazy" src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-stone-300" />
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? "border-stone-900 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img loading="lazy" src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover bg-stone-100" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <Link to={`/shops/${product.shop_id}`} className="group inline-flex items-center gap-3 mb-6 p-2 -ml-2 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 bg-stone-100 rounded-full border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                {product.shop_logo ? (
                  <img loading="lazy" src={product.shop_logo} alt={product.shop_name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-5 h-5 text-stone-400" />
                )}
              </div>
              <span className="font-serif font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                {product.shop_name}
              </span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-4">
              {product.name}
            </h1>
            
            <div className="text-3xl font-serif text-stone-900 mb-8">
              ${product.price.toFixed(2)}
            </div>

            <div className="prose prose-stone mb-8">
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>

            <div className="mt-auto pt-8 border-t border-stone-100 space-y-6">
              {product.category && (
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Category</h3>
                  <span className="inline-block px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-medium text-stone-700">
                    {product.category}
                  </span>
                </div>
              )}

              {parsedTags.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {parsedTags.map((tag, idx) => (
                      <span key={idx} className="inline-block px-3 py-1.5 bg-stone-100 text-stone-600 rounded-md text-xs font-medium uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">More from {product.shop_name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} to={`/products/${rp.id}`} className="group block">
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center">
                    {rp.image_url ? (
                      <img loading="lazy" src={rp.image_url} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-stone-300" />
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1 mb-1">
                      {rp.name}
                    </h3>
                    <p className="text-sm font-medium text-stone-500">${rp.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
