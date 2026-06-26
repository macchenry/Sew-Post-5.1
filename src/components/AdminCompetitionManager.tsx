import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Pencil, X, Check } from 'lucide-react';

interface Competition {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  start_date: string;
  end_date: string;
  status: string;
  voting_enabled: boolean;
}

export function AdminCompetitionManager() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentComp, setCurrentComp] = useState<Partial<Competition> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    fetchCompetitions();
    fetch('/api/users/me').then(r => r.json()).then(u => setUserRole(u?.role || ''));
  }, []);

  const fetchCompetitions = () => {
    fetch("/api/competitions")
      .then((res) => res.json())
      .then((data) => setCompetitions(data))
      .catch((err) => console.error(err));
  };

  const handleEdit = (comp: Competition) => {
    setCurrentComp({ ...comp });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentComp({
      title: "",
      description: "",
      category: "General",
      image_url: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "upcoming",
      voting_enabled: true,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentComp) return;
    setIsSaving(true);
    try {
      const payload = {
        ...currentComp,
        start_date: new Date(currentComp.start_date || "").toISOString(),
        end_date: new Date(currentComp.end_date || "").toISOString(),
      };

      if (currentComp.id) {
        await fetch(`/api/competitions/${currentComp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`/api/competitions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsEditing(false);
      setCurrentComp(null);
      fetchCompetitions();
    } catch (err) {
      console.error("Failed to save competition", err);
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
            Manage Competitions
          </h2>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Competition
        </button>
      </div>

      <div className="space-y-4">
        {competitions.map((comp) => (
          <div key={comp.id} className="flex items-center gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50 hover:bg-white hover:shadow-sm transition-all">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-stone-900 truncate">{comp.title}</h3>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${comp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'}`}>
                  {comp.status}
                </span>
                {!comp.voting_enabled && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    Voting Disabled
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500 line-clamp-1">{comp.description}</p>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-xs text-stone-400 font-medium">
                <span>Start: {new Date(comp.start_date).toLocaleDateString()}</span>
                <span>End: {new Date(comp.end_date).toLocaleDateString()}</span>
                <span>Category: {comp.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-4 border-l border-stone-200">
              <button
                onClick={() => handleEdit(comp)}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                title="Edit Competition"
              >
                <Pencil className="w-4 h-4" />
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this competition?')) {
                      await fetch(`/api/competitions/${comp.id}`, { method: 'DELETE' });
                      fetchCompetitions();
                    }
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Competition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isEditing && currentComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {currentComp.id ? "Edit Competition" : "New Competition"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form id="comp-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={currentComp.title || ""}
                    onChange={(e) => setCurrentComp({ ...currentComp, title: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={currentComp.description || ""}
                    onChange={(e) => setCurrentComp({ ...currentComp, description: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
                    <select
                      value={currentComp.status || "upcoming"}
                      onChange={(e) => setCurrentComp({ ...currentComp, status: e.target.value })}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={currentComp.category || ""}
                      onChange={(e) => setCurrentComp({ ...currentComp, category: e.target.value })}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={currentComp.start_date ? new Date(currentComp.start_date).toISOString().split('T')[0] : ""}
                      onChange={(e) => setCurrentComp({ ...currentComp, start_date: e.target.value })}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={currentComp.end_date ? new Date(currentComp.end_date).toISOString().split('T')[0] : ""}
                      onChange={(e) => setCurrentComp({ ...currentComp, end_date: e.target.value })}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={currentComp.image_url || ""}
                    onChange={(e) => setCurrentComp({ ...currentComp, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="voting_enabled"
                    checked={!!currentComp.voting_enabled}
                    onChange={(e) => setCurrentComp({ ...currentComp, voting_enabled: e.target.checked })}
                    className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300 rounded"
                  />
                  <label htmlFor="voting_enabled" className="text-sm font-medium text-stone-700">
                    Enable Voting
                  </label>
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
                form="comp-form"
                disabled={isSaving}
                className="flex items-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : <><Check className="w-4 h-4" /> Save Competition</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
