import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Store, ChevronRight, Search, MapPin, Trophy, Filter } from "lucide-react";

interface Shop {
  id: number;
  name: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  category: string | null;
  location: string | null;
  total_votes: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Unique lists for dropdowns (in a real app, these might come from an API)
  const categories = ["Traditional", "Modern", "Luxury", "Streetwear", "Bespoke"];
  const locations = ["Accra", "Kumasi", "Tema", "Takoradi"];

  const fetchShops = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
        ...(searchQuery && { search: searchQuery }),
        ...(category && { category }),
        ...(location && { location }),
        ...(sort && { sort })
      });

      const res = await fetch(`/api/shops?${params}`);
      const data = await res.json();
      setShops(data.shops);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, category, location, sort]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1); // Reset page on filter change
      fetchShops();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, category, location, sort, fetchShops]);

  // Handle page change
  useEffect(() => {
    fetchShops();
  }, [page, fetchShops]);

  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 mb-4">
          Brands & Designers
        </h1>
        <p className="text-lg text-stone-600">
          Discover the creative minds behind the fashion. Explore top-rated shops, exclusive brands, and talented designers in our community.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Search brands or descriptions..."
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow text-base sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full lg:w-auto lg:flex-nowrap">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 flex-1 sm:min-w-[140px]">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select 
              className="bg-transparent text-base sm:text-sm text-stone-700 focus:outline-none w-full min-w-0"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 flex-1 sm:min-w-[140px]">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
            <select 
              className="bg-transparent text-base sm:text-sm text-stone-700 focus:outline-none w-full min-w-0"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 flex-1 sm:min-w-[140px]">
            <select 
              className="bg-transparent text-base sm:text-sm text-stone-700 focus:outline-none w-full min-w-0"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-stone-500 font-medium">
            Loading brands...
          </div>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-500 bg-white border border-stone-200 rounded-2xl shadow-sm">
            <Store className="w-12 h-12 text-stone-300 mb-4" />
            <p className="font-serif text-xl text-stone-900">No shops found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.map((shop) => (
              <Link key={shop.id} to={`/shops/${shop.id}`} className="group block">
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                  {/* Banner & Logo */}
                  <div className="h-32 bg-stone-100 relative">
                    {shop.banner_url ? (
                      <img loading="lazy" src={shop.banner_url} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-stone-200" />
                    )}
                    <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-full p-1 border border-stone-200 shadow-sm">
                      <div className="w-full h-full bg-stone-100 rounded-full flex items-center justify-center overflow-hidden">
                        {shop.logo_url ? (
                          <img loading="lazy" src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-stone-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="pt-12 p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors">
                      {shop.name}
                    </h3>
                    
                    <div className="flex items-center gap-3 mt-2 mb-4 text-xs font-medium text-stone-500 uppercase tracking-widest">
                      {shop.category && <span>{shop.category}</span>}
                      {shop.category && shop.location && <span>&bull;</span>}
                      {shop.location && <span>{shop.location}</span>}
                    </div>

                    <p className="text-sm text-stone-600 line-clamp-3 flex-1 mb-6">
                      {shop.description}
                    </p>
                    
                    {/* Stats Footer */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        {shop.total_votes?.toLocaleString() || 0} Votes
                      </div>
                      <div className="flex items-center font-medium tracking-wide text-stone-900">
                        View Profile
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1 px-4 text-sm font-medium text-stone-600">
            Page <span className="text-stone-900">{page}</span> of <span className="text-stone-900">{pagination.totalPages}</span>
          </div>

          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
