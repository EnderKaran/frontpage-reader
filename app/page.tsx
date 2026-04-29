import { prisma } from "@/lib/db";
import { Search } from "lucide-react";
import SyncButton from "@/components/SyncButton";
import ArticleCard from "@/components/ArticleCard";
import ViewToggle from "@/components/ViewToggle";
import { format, isToday, isYesterday, subMonths } from 'date-fns';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; view?: string }>;
}) {
  if (!prisma) {
    return <div className="p-10 text-red-500">Kritik Hata: Prisma başlatılamadı!</div>;
  }

  const params = await searchParams;
  const activeCategoryName = params.category;
  const viewMode = params.view || "list"; // Varsayılan görünüm: list

  const whereClause = activeCategoryName
    ? {
        feed: {
          category: {
            name: activeCategoryName,
          },
        },
      }
    : {};

  const [feedCount, items] = await Promise.all([
    prisma.feed.count(),
    prisma.item.findMany({
      where: { ...whereClause, pubDate: { gte: subMonths(new Date(), 12) } },
      orderBy: { pubDate: 'desc' },
      take: 50,
      include: {
        feed: {
          select: { title: true, siteUrl: true }
        }
      }
    })
  ]);

  // Makaleleri tarih gruplarına ayırma
  const groupedItems: { [key: string]: typeof items } = {};
  items.forEach((item) => {
    const pubDate = new Date(item.pubDate);
    let groupKey = format(pubDate, 'MMMM yyyy');

    if (isToday(pubDate)) {
      groupKey = 'TODAY';
    } else if (isYesterday(pubDate)) {
      groupKey = 'YESTERDAY';
    }

    if (!groupedItems[groupKey]) {
      groupedItems[groupKey] = [];
    }
    groupedItems[groupKey].push(item);
  });

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-[--color-border-subtle] pb-7">
        <div className="space-y-1.5">
          <h1 className="text-[34px] font-extrabold tracking-tighter text-[--color-text-primary] capitalize">
            {activeCategoryName ? activeCategoryName : "All Items"}
          </h1>
          <p className="text-[18px] font-medium text-[--color-text-tertiary] tracking-tight">
            {items.length} latest articles {activeCategoryName ? `in ${activeCategoryName}` : `from your ${feedCount} subscriptions`}.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary]" />
            <input 
              type="search" 
              placeholder="Search articles..." 
              className="w-[240px] pl-11 pr-4 py-2.5 bg-[--color-bg-secondary] border border-[--color-border] rounded-[--radius-md] text-[14px] font-medium outline-none focus:border-[--color-accent] transition-colors"
            />
          </div>
          <SyncButton /> 
          <ViewToggle />
        </div>
      </header>

      <main className="space-y-10">
        {items.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-[--color-border] rounded-[--radius-xl] bg-[--color-bg-secondary]/50">
            <h2 className="text-2xl font-bold text-[--color-text-primary]">No articles found</h2>
            <p className="text-[16px] text-[--color-text-tertiary] mt-3">Click Sync Feeds to fetch data.</p>
          </div>
        ) : (
          Object.keys(groupedItems).map((groupKey) => (
            <div key={groupKey} className="space-y-4">
              <div className="text-[11px] font-bold text-[--color-text-tertiary] uppercase tracking-widest border-b border-[--color-border-subtle] pb-2">
                {groupKey}
              </div>
              
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-2"}>
                {groupedItems[groupKey].map((item) => (
                  <ArticleCard key={item.id} item={item} viewMode={viewMode} />
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}