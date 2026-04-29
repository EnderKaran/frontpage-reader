import { prisma } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";

export default async function SavedPage() {
  const user = await prisma.user.findFirst();

  if (!user) {
    return <div className="p-10 text-center">User not found</div>;
  }

  // 🚨 BURASI DÜZELTİLDİ: savedState yerine savedItem yazıldı
  const savedItems = await prisma.savedItem.findMany({
    where: { userId: user.id },
    include: {
      item: {
        include: {
          feed: {
            select: { title: true, siteUrl: true, category: { select: { name: true } } }
          },
          readBy: { where: { userId: user.id } },
          savedBy: { where: { userId: user.id } }
        }
      }
    },
    orderBy: { createdAt: 'desc' } // En son kaydedilen en üstte
  });

  const items = savedItems.map((saved: { item: any; }) => saved.item);

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col gap-6 border-b border-[--color-border-subtle] pb-7">
        <div className="space-y-1.5">
          <h1 className="text-[34px] font-extrabold tracking-tighter text-[--color-text-primary]">
            Saved Articles
          </h1>
          <p className="text-[18px] font-medium text-[--color-text-tertiary] tracking-tight">
            You have {items.length} articles saved for later.
          </p>
        </div>
      </header>

      <main className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-[--color-border] rounded-[--radius-xl] bg-[--color-bg-secondary]/50">
            <h2 className="text-2xl font-bold text-[--color-text-primary]">No saved articles</h2>
            <p className="text-[16px] text-[--color-text-tertiary] mt-3">Click the bookmark icon on any article to save it here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item: any) => (
              <ArticleCard key={item.id} item={item} viewMode="list" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}