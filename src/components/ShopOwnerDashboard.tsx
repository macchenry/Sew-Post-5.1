import React, { useState } from 'react';
import { Package, Trophy, Activity, Settings, Save, Check, Users, Eye, Bell, ChevronRight } from 'lucide-react';
import { ProductManager } from './ProductManager';
import { ShopCompetitionEntries } from './ShopCompetitionEntries';

export function ShopOwnerDashboard({ shop, onShopUpdate, fetchShop }: { shop: any, onShopUpdate: (shopData: any) => Promise<boolean>, fetchShop: () => void }) {
  const [shopData, setShopData] = useState(shop);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock data for new features
  const stats = {
    views: 12450,
    uniqueVisitors: 8230,
    competitionWins: 2,
    totalVotes: 3450,
  };

  const notifications = [
    { id: 1, title: "Competition Results", message: "Summer Elegance competition results are out. You ranked #3!", date: "2 hours ago", unread: true },
    { id: 2, title: "Platform Update", message: "New analytics features are now available for shop owners.", date: "1 day ago", unread: false },
    { id: 3, title: "New Milestone", message: "Your shop reached 10,000 profile views!", date: "3 days ago", unread: false },
  ];

  const handleShopUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await onShopUpdate(shopData);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <h3 className="font-medium text-sm">Total Views</h3>
            <Eye className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{stats.views.toLocaleString()}</p>
          <div className="flex items-center text-xs font-medium text-green-600">
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <h3 className="font-medium text-sm">Unique Visitors</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{stats.uniqueVisitors.toLocaleString()}</p>
          <div className="flex items-center text-xs font-medium text-green-600">
            <span>+5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <h3 className="font-medium text-sm">Total Votes</h3>
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{stats.totalVotes.toLocaleString()}</p>
          <p className="text-xs text-stone-500">Across all active competitions</p>
        </div>

        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <h3 className="font-medium text-sm">Competition Wins</h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{stats.competitionWins}</p>
          <p className="text-xs text-stone-500">Top 3 placements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shop Settings */}
          <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-stone-500" />
              <h2 className="text-xl font-serif font-semibold text-stone-900">
                Shop Profile
              </h2>
            </div>
            
            <form onSubmit={handleShopUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Shop Name</label>
                  <input
                    type="text"
                    value={shopData.name || ""}
                    onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Website URL</label>
                  <input
                    type="text"
                    value={shopData.website_url || ""}
                    onChange={(e) => setShopData({ ...shopData, website_url: e.target.value })}
                    placeholder="e.g., www.myshop.com"
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-stone-700">Description</label>
                  <textarea
                    value={shopData.description || ""}
                    onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Logo Image URL</label>
                  <input
                    type="url"
                    value={shopData.logo_url || ""}
                    onChange={(e) => setShopData({ ...shopData, logo_url: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Banner Image URL</label>
                  <input
                    type="url"
                    value={shopData.banner_url || ""}
                    onChange={(e) => setShopData({ ...shopData, banner_url: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-4">
                {saveSuccess && <span className="text-sm text-green-600 flex items-center gap-1.5"><Check className="w-4 h-4" /> Saved Successfully</span>}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>

          <ProductManager 
            shopId={shop.id} 
            initialProducts={shop.products || []} 
            onProductsChange={fetchShop} 
          />

          <ShopCompetitionEntries 
            shopId={shop.id}
            initialEntries={shop.entries || []}
            products={shop.products || []}
          />
        </div>

        <div className="space-y-8">
          {/* Notifications Panel */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-stone-500" />
                Announcements
              </h2>
            </div>
            
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="relative pl-4 border-l-2 border-stone-200 pb-4 last:pb-0">
                  {notif.unread && (
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-red-500" />
                  )}
                  <h4 className={`text-sm font-medium mb-1 ${notif.unread ? 'text-stone-900' : 'text-stone-600'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-stone-500 mb-2">{notif.message}</p>
                  <span className="text-[10px] text-stone-400 font-medium">{notif.date}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
              View All Notifications
            </button>
          </div>
          
          {/* Recent Activity / Mini Leaderboard */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-stone-500" />
              Recent Votes
            </h2>
            <div className="space-y-4">
              {shop.entries?.slice(0, 5).map((entry: any) => (
                <div key={entry.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-md bg-stone-100 overflow-hidden shrink-0">
                      {entry.image_url ? (
                        <img loading="lazy" src={entry.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-4 h-4 m-auto mt-2 text-stone-300" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-stone-900 truncate">{entry.product_name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{entry.competition_title}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-stone-900">{entry.votes}</span>
                    <span className="text-[10px] text-stone-400 block -mt-1">votes</span>
                  </div>
                </div>
              ))}
              {(!shop.entries || shop.entries.length === 0) && (
                <p className="text-sm text-stone-500 text-center py-4">No competition entries yet.</p>
              )}
            </div>
            {shop.entries && shop.entries.length > 0 && (
              <button className="w-full mt-6 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center justify-center gap-1">
                View All Entries <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
