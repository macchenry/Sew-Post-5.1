import React, { useEffect, useState, useCallback } from "react";
import { LayoutDashboard, Package, Trophy, Activity, Settings, Save, Check } from "lucide-react";
import { AdminCompetitionManager } from "../components/AdminCompetitionManager";
import { BuyerDashboard } from "../components/BuyerDashboard";
import { ShopOwnerDashboard } from "../components/ShopOwnerDashboard";
import { SuperAdminDashboard } from "../components/SuperAdminDashboard";
import { EditorDashboard } from "../components/EditorDashboard";

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchShop = useCallback(() => {
    fetch("/api/users/me/shop")
      .then((res) => res.json())
      .then((data) => setShop(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error(err));

    fetchShop();
  }, [fetchShop]);

  const handleShopUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/shops/${shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shop),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user)
    return <div className="py-20 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif tracking-tight text-stone-900 mb-2">
          Dashboard
        </h1>
        <p className="text-stone-500">
          Welcome back, {user.name}. Here is your overview.
        </p>
      </div>

      {user.role === 'admin' ? (
        <SuperAdminDashboard />
      ) : user.role === 'editor' ? (
        <EditorDashboard />
      ) : user.role === 'voter' ? (
        <BuyerDashboard user={user} />
      ) : (
        <>
          {shop ? (
            <ShopOwnerDashboard shop={shop} onShopUpdate={async (shopData) => {
              try {
                const res = await fetch(`/api/shops/${shopData.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(shopData),
                });
                return res.ok;
              } catch (err) {
                console.error(err);
                return false;
              }
            }} fetchShop={fetchShop} />
          ) : (
            <div className="py-20 text-center">Loading shop details...</div>
          )}
        </>
      )}
    </div>
  );
}
