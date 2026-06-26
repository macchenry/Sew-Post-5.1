import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Check, X, Package } from 'lucide-react';

interface ShopProduct {
  id: number;
  name: string;
}

interface Competition {
  id: number;
  title: string;
  status: string;
}

interface CompetitionEntry {
  id: number;
  competition_id: number;
  competition_title: string;
  competition_status: string;
  product_id: number;
  product_name: string;
  image_url: string;
  votes: number;
}

export function ShopCompetitionEntries({ shopId, initialEntries, products }: { shopId: number, initialEntries: CompetitionEntry[], products: ShopProduct[] }) {
  const [entries, setEntries] = useState<CompetitionEntry[]>(initialEntries);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isEntering, setIsEntering] = useState(false);
  const [selectedCompId, setSelectedCompId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/competitions")
      .then((res) => res.json())
      .then((data) => setCompetitions(data.filter((c: any) => c.status !== 'completed')))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompId || !selectedProductId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/competitions/${selectedCompId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop_id: shopId, product_id: parseInt(selectedProductId) })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to enter competition");
      } else {
        setIsEntering(false);
        // Refresh the page or fetch entries again
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-stone-500" />
          <h2 className="text-xl font-serif font-semibold text-stone-900">
            Competition Entries
          </h2>
        </div>
        <button
          onClick={() => setIsEntering(true)}
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Enter Competition
        </button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50">
            <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden shrink-0 border border-stone-200">
              {entry.image_url ? (
                <img loading="lazy" src={entry.image_url} alt={entry.product_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <Package className="w-6 h-6" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-stone-900 truncate">{entry.product_name}</h3>
              <p className="text-sm text-stone-500 line-clamp-1">{entry.competition_title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${entry.competition_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'}`}>
                  {entry.competition_status}
                </span>
                <span className="text-xs font-medium text-stone-600">{entry.votes} Votes</span>
              </div>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 text-stone-500 border-2 border-dashed border-stone-200 rounded-xl">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-stone-300" />
            <p>You haven't entered any competitions yet.</p>
          </div>
        )}
      </div>

      {isEntering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Enter a Competition
              </h3>
              <button
                onClick={() => setIsEntering(false)}
                className="text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Select Competition</label>
                  <select
                    required
                    value={selectedCompId}
                    onChange={(e) => setSelectedCompId(e.target.value)}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="" disabled>Choose a competition...</option>
                    {competitions.map((comp) => (
                      <option key={comp.id} value={comp.id}>{comp.title} ({comp.status})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Select Product</label>
                  <select
                    required
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="" disabled>Choose a product...</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>{prod.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEntering(false)}
                  className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !selectedCompId || !selectedProductId}
                  className="flex items-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Entering..." : <><Check className="w-4 h-4" /> Submit Entry</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
