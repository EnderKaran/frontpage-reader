import { prisma } from "@/lib/db";
import { LayoutGrid, List as ListIcon, SlidersHorizontal } from "lucide-react";
import SyncButton from "@/components/SyncButton";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  if (!prisma) {
    return <div className="p-10 text-red-500">Kritik Hata: Prisma başlatılamadı!</div>;
  }

  // Verileri paralel ve güvenli çekiyoruz
  const [feedCount, items] = await Promise.all([
    prisma.feed.count(),
    // En yeni 50 makaleyi, bağlı olduğu feed (kaynak) bilgisiyle beraber getiriyoruz
    prisma.item.findMany({
      orderBy: { pubDate: 'desc' },
      take: 50,
      include: {
        feed: {
          select: { title: true }
        }
      }
    })
  ]);

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-[--color-border-subtle] pb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-[--color-text-primary]">
            All Items
          </h1>
          <p className="text-[--color-text-tertiary] text-lg font-medium">
            {items.length} latest articles from your {feedCount} subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[--color-bg-secondary] p-1 rounded-md border border-[--color-border]">
            <button className="p-2 rounded-sm text-[--color-text-tertiary] hover:text-[--color-text-secondary] transition-colors">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 rounded-sm bg-white shadow-sm text-[--color-accent]">
              <ListIcon size={18} />
            </button>
          </div>
          <SyncButton /> 
        </div>
      </header>

      {/* Makale Listesi */}
      <main className="space-y-1">
        {items.length === 0 ? (
          // Eğer hiç makale yoksa boş ekran
          <div className="text-center py-20 border-2 border-dashed border-[--color-border] rounded-[--radius-lg]">
            <h2 className="text-xl font-bold text-[--color-text-primary]">No articles found</h2>
            <p className="text-[--color-text-tertiary] mt-2">Click Sync Feeds to fetch data.</p>
          </div>
        ) : (
          // Makaleleri render ediyoruz
          items.map((item) => (
            <ArticleCard key={item.id} item={item} />
          ))
        )}
      </main>
    </div>
  );
}