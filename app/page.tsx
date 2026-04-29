import { prisma } from "@/lib/db";
import SyncButton from "@/components/SyncButton";
import ArticleCard from "@/components/ArticleCard";
import ViewToggle from "@/components/ViewToggle";
import SearchBar from "@/components/SearchBar";
import { format, isToday, isYesterday, subMonths } from 'date-fns';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; view?: string; q?: string }>;
}) {
  if (!prisma) {
    return <div className="p-10 text-red-500">Kritik Hata: Prisma başlatılamadı!</div>;
  }

  const params = await searchParams;
  const activeCategoryName = params.category;
  const viewMode = params.view || "list";
  const searchQuery = params.q || "";

  const whereClause: any = {
    ...(activeCategoryName ? { feed: { category: { name: activeCategoryName } } } : {}),
    ...(searchQuery ? {
      OR: [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ]
    } : {})
  };

  // Demo kullanıcıyı bul (Okundu bilgisi için)
  const user = await prisma.user.findFirst();

  const [feedCount, items] = await Promise.all([
    prisma.feed.count(),
    prisma.item.findMany({
      where: { ...whereClause, pubDate: { gte: subMonths(new Date(), 12) } },
      orderBy: { pubDate: 'desc' },
      take: 50,
      include: {
        feed: {
          select: { title: true, siteUrl: true, category: { select: { name: true } } }
        },
        // Kullanıcı varsa bu makaleye ait readState'leri getir
        readBy: user ? { where: { userId: user.id } } : false
      }
    })
  ]);

  // Sadece okunmamış makalelerin sayısını hesapla
  const unreadCount = items.filter((item: any) => !item.readBy || item.readBy.length === 0).length;

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
            {searchQuery ? `Search: "${searchQuery}"` : (activeCategoryName ? activeCategoryName : "All Items")}
          </h1>
          <p className="text-[18px] font-medium text-[--color-text-tertiary] tracking-tight">
            {unreadCount} unread articles {activeCategoryName ? `in ${activeCategoryName}` : `from your ${feedCount} subscriptions`}.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <SearchBar />
          <SyncButton /> 
          <ViewToggle />
        </div>
      </header>

      <main className="space-y-10">
        {items.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-[--color-border] rounded-[--radius-xl] bg-[--color-bg-secondary]/50">
            <h2 className="text-2xl font-bold text-[--color-text-primary]">No articles found</h2>
            <p className="text-[16px] text-[--color-text-tertiary] mt-3">Try clearing your search or syncing feeds.</p>
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