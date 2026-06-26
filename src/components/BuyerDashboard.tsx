import React, { useEffect, useState } from 'react';
import { Heart, Trophy, Bell, Activity, Package, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FavoriteShop {
  id: number;
  shop_id: number;
  name: string;
  logo_url: string;
}

interface FavoriteProduct {
  id: number;
  product_id: number;
  name: string;
  image_url: string;
  price: number;
  shop_name: string;
}

interface VotingHistory {
  id: number;
  competition_id: number;
  competition_title: string;
  entry_id: number;
  product_name: string;
  created_at: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function BuyerDashboard({ user }: { user: any }) {
  const [favoriteShops, setFavoriteShops] = useState<FavoriteShop[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profile, setProfile] = useState({ name: user.name, email: user.email });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/users/me/buyer_data')
      .then(res => res.json())
      .then(data => {
        setFavoriteShops(data.favoriteShops || []);
        setFavoriteProducts(data.favoriteProducts || []);
        setVotingHistory(data.votingHistory || []);
        setNotifications(data.notifications || []);
      })
      .catch(err => console.error(err));
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // Simulate save
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-2">
          Profile Settings
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Full Name</label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Email Address</label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
            {saveSuccess && <span className="text-sm text-green-600">Saved Successfully</span>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-stone-600 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-medium">Saved Items</h3>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{favoriteProducts.length}</p>
          <p className="text-sm text-stone-500">Products in your wishlist</p>
        </div>

        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-stone-600 mb-2">
            <Store className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Saved Shops</h3>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{favoriteShops.length}</p>
          <p className="text-sm text-stone-500">Favorite brands</p>
        </div>

        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-stone-600 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Votes Cast</h3>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{votingHistory.length}</p>
          <p className="text-sm text-stone-500">In fashion competitions</p>
        </div>

        <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-stone-600 mb-2">
            <Bell className="w-5 h-5 text-stone-500" />
            <h3 className="font-medium">Notifications</h3>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">{notifications.filter(n => !n.is_read).length}</p>
          <p className="text-sm text-stone-500">Unread alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-stone-400" /> Saved Products
            </h2>
            {favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteProducts.map(fp => (
                  <Link key={fp.id} to={`/products/${fp.product_id}`} className="group flex items-center gap-4 p-3 border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors">
                    <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                      {fp.image_url ? (
                        <img loading="lazy" src={fp.image_url} alt={fp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <Package className="w-6 h-6 m-auto mt-5 text-stone-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-900 line-clamp-1">{fp.name}</h4>
                      <p className="text-xs text-stone-500">{fp.shop_name}</p>
                      <p className="text-sm font-medium text-stone-900 mt-1">${fp.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-500">
                You haven't saved any products yet.
              </div>
            )}
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-stone-400" /> Voting History
            </h2>
            {votingHistory.length > 0 ? (
              <div className="space-y-3">
                {votingHistory.map(vh => (
                  <div key={vh.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-xl bg-stone-50">
                    <div>
                      <p className="text-sm font-medium text-stone-900">Voted for <span className="font-bold">{vh.product_name}</span></p>
                      <p className="text-xs text-stone-500 mt-1">in {vh.competition_title}</p>
                    </div>
                    <span className="text-xs text-stone-400 font-medium">{new Date(vh.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-500">
                You haven't participated in any competitions yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-stone-400" /> Saved Shops
            </h2>
            {favoriteShops.length > 0 ? (
              <div className="space-y-4">
                {favoriteShops.map(fs => (
                  <Link key={fs.id} to={`/shops/${fs.shop_id}`} className="group flex items-center gap-3 p-2 -ml-2 rounded-xl hover:bg-stone-50 transition-colors">
                    <div className="w-10 h-10 bg-stone-100 rounded-full border border-stone-200 overflow-hidden shrink-0">
                      {fs.logo_url ? (
                        <img loading="lazy" src={fs.logo_url} alt={fs.name} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-5 h-5 m-auto mt-2.5 text-stone-300" />
                      )}
                    </div>
                    <span className="font-medium text-stone-900 group-hover:text-stone-600 transition-colors">
                      {fs.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-500">
                No saved shops.
              </div>
            )}
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-serif font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-stone-400" /> Notifications
            </h2>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(notif => (
                  <div key={notif.id} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-medium ${notif.is_read ? 'text-stone-600' : 'text-stone-900 font-bold'}`}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />}
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-stone-400 mt-2 block">{new Date(notif.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-500">
                All caught up!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
