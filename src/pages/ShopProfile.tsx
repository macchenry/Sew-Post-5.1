import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Store, Instagram, Twitter, Globe, Phone, Mail, Trophy, MapPin, ExternalLink } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface CompetitionEntry {
  id: number;
  competition_id: number;
  competition_title: string;
  competition_status: string;
  product_name: string;
  votes: number;
}

interface Shop {
  id: number;
  name: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  email: string | null;
  phone: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  products: Product[];
  entries: CompetitionEntry[];
}

export function ShopProfile() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    fetch(`/api/shops/${id}`)
      .then((res) => res.json())
      .then((data) => setShop(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!shop)
    return <div className="py-20 text-center">Loading shop profile...</div>;

  const totalVotes = shop.entries?.reduce((sum, entry) => sum + entry.votes, 0) || 0;

  return (
    <div className="space-y-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="h-48 md:h-64 w-full bg-stone-200 relative">
           {shop.banner_url ? (
             <img loading="lazy" src={shop.banner_url} alt={`${shop.name} Banner`} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
               No Banner
             </div>
           )}
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="-mt-16 bg-white p-2 rounded-full border border-stone-200 shrink-0 shadow-sm relative z-10">
              <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center overflow-hidden">
                {shop.logo_url ? (
                  <img loading="lazy" src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-12 h-12 text-stone-400" />
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-6 flex-1">
              <h1 className="text-4xl font-serif tracking-tight text-stone-900 mb-2">
                {shop.name}
              </h1>
              <p className="text-lg text-stone-600 max-w-3xl leading-relaxed">{shop.description}</p>
            </div>
            <div className="mt-4 md:mt-6 flex flex-col gap-4 min-w-[200px] shrink-0">
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 text-center">
                    <p className="text-2xl font-serif font-bold text-stone-900">{shop.products?.length || 0}</p>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Products</p>
                 </div>
                 <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 text-center">
                    <p className="text-2xl font-serif font-bold text-stone-900">{totalVotes}</p>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Votes</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-100 flex flex-wrap gap-6 text-sm">
             {shop.email && (
               <a href={`mailto:${shop.email}`} className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                  <Mail className="w-4 h-4" /> {shop.email}
               </a>
             )}
             {shop.phone && (
               <a href={`tel:${shop.phone}`} className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                  <Phone className="w-4 h-4" /> {shop.phone}
               </a>
             )}
             {shop.website_url && (
               <a href={`https://${shop.website_url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                  <Globe className="w-4 h-4" /> {shop.website_url.replace(/^https?:\/\//, '')}
               </a>
             )}
             {shop.instagram_url && (
               <a href={`https://instagram.com/${shop.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                  <Instagram className="w-4 h-4" /> {shop.instagram_url}
               </a>
             )}
             {shop.twitter_url && (
               <a href={`https://twitter.com/${shop.twitter_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                  <Twitter className="w-4 h-4" /> {shop.twitter_url}
               </a>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shop Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif tracking-tight text-stone-900">
              Collection
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {shop.products?.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-stone-100 mb-4 overflow-hidden rounded-2xl relative">
                  {product.image_url ? (
                    <img loading="lazy" src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-stone-200 flex items-center justify-center text-stone-400 group-hover:scale-105 transition-transform duration-500">
                      Image Not Found
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-stone-900">{product.name}</h3>
                <p className="text-sm text-stone-500 line-clamp-1">
                  {product.description}
                </p>
                <p className="mt-2 text-stone-900 font-medium">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
            {(!shop.products || shop.products.length === 0) && (
              <div className="col-span-full py-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-100 shadow-sm">
                No products added yet.
              </div>
            )}
          </div>
        </div>

        {/* Competition Entries */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif tracking-tight text-stone-900">
            Competitions
          </h2>
          <div className="space-y-4">
            {shop.entries?.map((entry) => (
              <Link to={`/competitions/${entry.competition_id}`} key={entry.id} className="block group bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${entry.competition_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                    {entry.competition_status}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-stone-900 mb-1 group-hover:text-stone-600 transition-colors">{entry.competition_title}</h4>
                <p className="text-sm text-stone-500 mb-4">Entry: {entry.product_name}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {entry.votes.toLocaleString()} Votes
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-900 flex items-center gap-1">
                    View <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
            {(!shop.entries || shop.entries.length === 0) && (
              <div className="py-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-100 shadow-sm">
                No competition entries yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
