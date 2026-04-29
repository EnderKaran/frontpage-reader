"use client";

import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { addFeed, deleteFeed } from "@/app/actions";

export default function ManageFeedsModal({ isOpen, onClose, categories, feeds }: { isOpen: boolean, onClose: () => void, categories: any[], feeds: any[] }) {
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !categoryId) return;
    
    setIsLoading(true);
    setError("");

    const res = await addFeed(url, categoryId);
    if (res.success) {
      setUrl(""); // Formu temizle
    } else {
      setError(res.error || "Bir hata oluştu.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu kaynağı ve içindeki tüm makaleleri silmek istediğinize emin misiniz?")) {
      await deleteFeed(id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-800">Manage Subscriptions</h2>
          <button onClick={onClose} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar">
          {/* Hata Mesajı */}
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>}

          {/* Ekleme Formu */}
          <form onSubmit={handleAdd} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">RSS URL</label>
              <input 
                type="url" 
                value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/feed.xml" 
                required
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Category</label>
              <select 
                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {isLoading ? "Adding Feed..." : "Add Subscription"}
            </button>
          </form>

          {/* Mevcut Kaynaklar Listesi */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Your Subscriptions ({feeds.length})</h3>
            <div className="space-y-2">
              {feeds.map(feed => (
                <div key={feed.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-colors group">
                  <div className="overflow-hidden pr-3">
                    <p className="text-sm font-bold text-zinc-800 truncate">{feed.title}</p>
                    <p className="text-[11px] font-medium text-zinc-500 truncate">{feed.url}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(feed.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    title="Delete Feed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {feeds.length === 0 && <p className="text-sm text-zinc-500 text-center py-4">No subscriptions yet.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}