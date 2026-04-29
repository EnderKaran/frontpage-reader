import { prisma } from "@/lib/db";
import { LayoutGrid, List as ListIcon, SlidersHorizontal, RefreshCw } from "lucide-react";
import SyncButton from "@/components/SyncButton"; // 🚨 Butonu buraya import ediyoruz

export default async function Home() {
  let feedCount = 0;
  
  if (!prisma) {
    return <div className="p-10 text-red-500">Kritik Hata: Prisma başlatılamadı!</div>;
  }

  try {
    feedCount = await prisma.feed.count();
  } catch (error: any) {
    console.error("❌ Veri çekme hatası:", error.message);
  }

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-[--color-text-primary]">
            All Items
          </h1>
          <p className="text-[--color-text-tertiary] text-lg font-medium">
            Everything from your {feedCount} subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Görünüm Değiştirici */}
          <div className="flex bg-[--color-bg-secondary] p-1 rounded-[--radius-md] border border-[--color-border]">
            <button className="p-2 rounded-[--radius-sm] bg-white shadow-sm text-[--color-accent]">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 rounded-[--radius-sm] text-[--color-text-tertiary] hover:text-[--color-text-secondary] transition-colors">
              <ListIcon size={18} />
            </button>
          </div>
          
          {/* 🚨 EKSİK OLAN BUTONUMUZ BURADA */}
          <SyncButton /> 
        </div>
      </header>

      {/* Makale Beslemesi (Şu anki boş state) */}
      <main className="min-h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-[--color-border] rounded-[--radius-lg] bg-[--color-bg-secondary]/30 transition-colors hover:bg-[--color-bg-secondary]/50 group">
        <div className="text-center space-y-5 p-8">
          <div className="w-16 h-16 bg-[--color-bg-tertiary] rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-6 transition-transform duration-300">
            <RefreshCw size={32} className="text-[--color-text-tertiary]" />
          </div>
          <h2 className="text-2xl font-bold text-[--color-text-primary]">Your library is ready</h2>
          <p className="text-[--color-text-tertiary] max-w-sm mx-auto leading-relaxed text-balance">
            We've found {feedCount} feeds in your database. Click the "Sync Feeds" button to fetch the latest articles.
          </p>
          
          <div className="pt-4">
            <button className="text-[--text-sm] font-semibold text-[--color-accent] hover:underline flex items-center gap-2 mx-auto">
              <SlidersHorizontal size={14} />
              Manage Subscriptions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}