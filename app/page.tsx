import { prisma } from "@/lib/db";
import SyncButton from "@/components/SyncButton";
import ArticleCard from "@/components/ArticleCard";
import ViewToggle from "@/components/ViewToggle";
import SearchBar from "@/components/SearchBar";
import LoadMore from "@/components/LoadMore";
import { format, isToday, isYesterday } from 'date-fns';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; view?: string; q?: string }>;
}) {
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

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: "demo@frontpage.local", password: "password123" }
    });
  }

  const [feedCount, items] = await Promise.all([
    prisma.feed.count(),
    prisma.item.findMany({
      where: whereClause,
      orderBy: { pubDate: 'desc' },
      take: 50,
      include: {
        feed: { select: { title: true, siteUrl: true, category: { select: { name: true } } } },
        readBy: { where: { userId: user.id } },
        savedBy: { where: { userId: user.id } }
      }
    })
  ]);

  const unreadCount = items.filter((item: any) => !item.readBy || item.readBy.length === 0).length;

  const groupedItems: { [key: string]: typeof items } = {};
  items.forEach((item) => {
    const pubDate = new Date(item.pubDate);
    let groupKey = format(pubDate, 'MMMM yyyy');
    if (isToday(pubDate)) groupKey = 'TODAY';
    else if (isYesterday(pubDate)) groupKey = 'YESTERDAY';
    if (!groupedItems[groupKey]) groupedItems[groupKey] = [];
    groupedItems[groupKey].push(item);
  });

  return (
  <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-8 sm:py-10">
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[--color-border-subtle] pb-8">
      {/* Yazı Alanı: Mobilde sola yaslı durması için text-left yaptık */}
      <div className="space-y-2 text-left">
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tighter text-[--color-text-primary] capitalize leading-none">
          {searchQuery ? `Search: "${searchQuery}"` : (activeCategoryName ? activeCategoryName : "All Items")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-medium text-[--color-text-tertiary] tracking-tight">
          {unreadCount > 0 ? `${unreadCount} unread articles` : "All caught up"} 
          <span className="hidden sm:inline"> from your {feedCount} subscriptions</span>.
        </p>
      </div>

      {/* Kontroller: Mobilde düzgün dizilmesi için flex-col ve w-full */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
        <div className="w-full sm:w-[240px]">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Butonları mobilde eşit genişliğe yayar */}
          <div className="flex-1 sm:flex-none">
            <SyncButton />
          </div>
          <div className="flex-none">
            <ViewToggle />
          </div>
        </div>
      </div>
    </header>

    <main className="mt-8 space-y-10">
      {Object.keys(groupedItems).map((groupKey) => (
        <div key={groupKey} className="space-y-4">
          <div className="text-[11px] font-bold text-[--color-text-tertiary] uppercase tracking-widest border-b border-[--color-border-subtle] pb-2">
            {groupKey}
          </div>
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-2"}>
            {groupedItems[groupKey].map((item: any) => (
              <ArticleCard key={item.id} item={item} viewMode={viewMode} />
            ))}
          </div>
        </div>
      ))}

      <LoadMore initialSkip={50} category={activeCategoryName} searchQuery={searchQuery} viewMode={viewMode} />
    </main>
  </div>
  );
}