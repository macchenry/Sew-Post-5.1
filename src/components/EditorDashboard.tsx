import React, { useState, useEffect } from 'react';
import { Store, Trophy, Activity, Package, Edit, LayoutDashboard, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { AdminCompetitionManager } from './AdminCompetitionManager';

export function EditorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchShops();
    fetchProducts();
  }, []);

  const fetchStats = () => fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  const fetchShops = () => fetch('/api/admin/shops').then(r => r.json()).then(setShops);
  const fetchProducts = () => fetch('/api/admin/products').then(r => r.json()).then(setProducts);

  const handleToggleStatus = (id: number, type: 'shop' | 'product', currentStatus: string) => {
    // Mock moderation action
    const verb = currentStatus === 'Active' ? 'suspend' : 'approve';
    if (!confirm(`Are you sure you want to ${verb} this ${type}?`)) return;
    
    alert(`Mock: ${type} ${id} has been ${verb}d.`);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'shops', name: 'Moderate Shops', icon: Store },
    { id: 'products', name: 'Moderate Products', icon: Package },
    { id: 'competitions', name: 'Competitions', icon: Trophy },
  ];

  return (
    <div className="space-y-8">
      {/* Editor Header */}
      <div className="bg-stone-800 text-white p-8 rounded-3xl flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
            Editor Dashboard
          </h1>
          <p className="text-stone-400">Moderate platform content, manage shops, and review listings.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-stone-900/50 backdrop-blur px-4 py-2 rounded-xl text-center border border-stone-700">
            <p className="text-xs text-stone-400 font-bold tracking-widest uppercase mb-1">Your Role</p>
            <p className="text-blue-400 font-medium">Content Editor</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-200 overflow-x-auto pb-[1px] scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
                <Store className="w-6 h-6 text-purple-500 mb-3" />
                <p className="text-3xl font-serif font-bold text-stone-900">{stats?.shopsCount || 0}</p>
                <p className="text-sm font-medium text-stone-500">Active Shops</p>
              </div>
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
                <Package className="w-6 h-6 text-orange-500 mb-3" />
                <p className="text-3xl font-serif font-bold text-stone-900">{stats?.productsCount || 0}</p>
                <p className="text-sm font-medium text-stone-500">Products Listed</p>
              </div>
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
                <Trophy className="w-6 h-6 text-yellow-500 mb-3" />
                <p className="text-3xl font-serif font-bold text-stone-900">{stats?.competitionsCount || 0}</p>
                <p className="text-sm font-medium text-stone-500">Competitions</p>
              </div>
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
                <Activity className="w-6 h-6 text-red-500 mb-3" />
                <p className="text-3xl font-serif font-bold text-stone-900">{stats?.votesCount || 0}</p>
                <p className="text-sm font-medium text-stone-500">Total Votes Cast</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Recent Pending Submissions</h3>
              <div className="text-center py-12 text-stone-500">
                <CheckCircle className="w-12 h-12 mx-auto text-stone-300 mb-4" />
                <p>All clear! There are no pending submissions requiring your review right now.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shops' && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-stone-900">Moderate Shops</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Shop Name</th>
                    <th className="px-6 py-4 font-semibold">Owner</th>
                    <th className="px-6 py-4 font-semibold">Products</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {shops.map((s) => (
                    <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                          {s.logo_url ? <img loading="lazy" src={s.logo_url} alt="" className="w-full h-full object-cover" /> : <Store className="w-4 h-4 m-auto mt-2 text-stone-400" />}
                        </div>
                        {s.name}
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {s.owner_name} <br/> <span className="text-xs">{s.owner_email}</span>
                      </td>
                      <td className="px-6 py-4 font-medium">{s.product_count} listed</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(s.id, 'shop', 'Active')}
                          className="p-2 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Suspend Shop"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-stone-900">Moderate Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Shop</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden border border-stone-200">
                          {p.image_url ? <img loading="lazy" src={p.image_url} alt="" className="w-full h-full object-cover" /> : <Package className="w-4 h-4 m-auto mt-3 text-stone-400" />}
                        </div>
                        {p.name}
                      </td>
                      <td className="px-6 py-4 text-stone-500">{p.shop_name}</td>
                      <td className="px-6 py-4 font-medium">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-stone-500">{p.category || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(p.id, 'product', 'Active')}
                          className="p-2 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Suspend Product"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'competitions' && (
          <div className="space-y-6">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-stone-900">Competition Management</h4>
              <p className="text-sm text-stone-600">As an Editor, you can manage active competitions and moderate entries.</p>
            </div>
            <AdminCompetitionManager />
          </div>
        )}
      </div>
    </div>
  );
}
