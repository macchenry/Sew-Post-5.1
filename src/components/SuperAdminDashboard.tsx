import React, { useState, useEffect } from 'react';
import { Users, Store, Trophy, Activity, Settings, Package, Trash2, Edit, Shield, LayoutDashboard, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { AdminCompetitionManager } from './AdminCompetitionManager';

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchShops();
    fetchProducts();
    fetchAuditLogs();
  }, []);

  const fetchStats = () => fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  const fetchUsers = () => fetch('/api/users').then(r => r.json()).then(setUsers);
  const fetchShops = () => fetch('/api/admin/shops').then(r => r.json()).then(setShops);
  const fetchProducts = () => fetch('/api/admin/products').then(r => r.json()).then(setProducts);
  const fetchAuditLogs = () => fetch('/api/admin/audit-logs').then(r => r.json()).then(setAuditLogs);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? All their data will be lost.')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
    fetchStats();
  };

  const handleUpdateRole = async (id: number, role: string) => {
    await fetch(`/api/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    fetchUsers();
  };

  const handleDeleteShop = async (id: number) => {
    if (!confirm('Are you sure you want to delete this shop and all its products?')) return;
    await fetch(`/api/shops/${id}`, { method: 'DELETE' });
    fetchShops();
    fetchStats();
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
    fetchStats();
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'shops', name: 'Shops', icon: Store },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'competitions', name: 'Competitions', icon: Trophy },
    { id: 'audit', name: 'Audit Logs', icon: Shield },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-8">
      {/* Super Admin Header */}
      <div className="bg-stone-900 text-white p-8 rounded-3xl flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-yellow-500" />
            Super Admin Control Panel
          </h1>
          <p className="text-stone-400">Manage all platform data, users, content, and system configurations.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-stone-800/50 backdrop-blur px-4 py-2 rounded-xl text-center border border-stone-700">
            <p className="text-xs text-stone-400 font-bold tracking-widest uppercase mb-1">System Status</p>
            <p className="text-green-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> All Systems Operational
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white p-6 border border-stone-200 rounded-2xl shadow-sm">
                <Users className="w-6 h-6 text-blue-500 mb-3" />
                <p className="text-3xl font-serif font-bold text-stone-900">{stats?.usersCount || 0}</p>
                <p className="text-sm font-medium text-stone-500">Total Users</p>
              </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Recent Platform Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5 text-stone-500" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">New shop registered</p>
                      <p className="text-sm text-stone-500">"Modern Trends GH" joined the platform.</p>
                      <p className="text-xs text-stone-400 mt-1">10 mins ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-stone-500" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">Competition started</p>
                      <p className="text-sm text-stone-500">"Summer Elegance" is now active for voting.</p>
                      <p className="text-xs text-stone-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">System Health</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-stone-700">Database Storage</span>
                      <span className="text-stone-500">45% used</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-stone-900 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-stone-700">Media CDN Storage</span>
                      <span className="text-stone-500">72% used</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-stone-700">Server Load</span>
                      <span className="text-stone-500">Normal</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-stone-900">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-900">{u.name}</td>
                      <td className="px-6 py-4 text-stone-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-2 focus:outline-none focus:ring-0 ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            u.role === 'editor' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            u.role === 'shop_owner' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          <option value="voter">Voter</option>
                          <option value="shop_owner">Shop Owner</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-stone-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'shops' && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-stone-900">Shop Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Shop Name</th>
                    <th className="px-6 py-4 font-semibold">Owner</th>
                    <th className="px-6 py-4 font-semibold">Products</th>
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
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteShop(s.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Shop"
                        >
                          <Trash2 className="w-4 h-4" />
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
              <h3 className="text-lg font-serif font-bold text-stone-900">Product Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Shop</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
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
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-stone-900">Administrator Control</h4>
                <p className="text-sm text-stone-600">You have full permission to create, edit, or delete any competition across the platform.</p>
              </div>
            </div>
            <AdminCompetitionManager />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold text-stone-900">System Audit Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                    <th className="px-6 py-4 font-semibold">Resource</th>
                    <th className="px-6 py-4 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-stone-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-stone-900">
                        {log.user_name}
                        <div className="text-xs text-stone-500 font-normal">{log.user_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-stone-100 text-stone-700">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600">{log.resource}</td>
                      <td className="px-6 py-4 text-stone-500">{log.details || '-'}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-stone-500">No audit logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-stone-500" />
              Platform Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="font-bold text-stone-900 border-b border-stone-100 pb-2">General Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">Allow New Shop Registrations</p>
                      <p className="text-sm text-stone-500">Enable or disable new users from creating shops.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">Maintenance Mode</p>
                      <p className="text-sm text-stone-500">Put the platform into maintenance mode.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-stone-900 border-b border-stone-100 pb-2">Voting Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Max Votes per User per Competition</label>
                    <input type="number" defaultValue={1} className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">Anonymous Voting</p>
                      <p className="text-sm text-stone-500">Allow users to vote without logging in.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
              <button className="bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
