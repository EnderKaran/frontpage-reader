import { CheckCircle2, AlertCircle, Library } from 'lucide-react';
import { prisma } from '@/lib/db';
import SidebarNav from './SidebarNav';

export default async function Sidebar() {
  let categoriesWithCounts: any[] = [];
  let counts = { allUnread: 0, saved: 0 };
  let hasError = false;

  if (!prisma) {
    return <aside className="w-[--sidebar-width] p-4 text-red-500">Prisma Client Not Initialized</aside>;
  }

  try {
    // Demo kullanıcıyı bul
    let user = await prisma.user.findFirst();

    // Tüm kategorileri isim sırasına göre çek
    const rawCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    // Kategorilerin içindeki toplam makale sayıları
    categoriesWithCounts = await Promise.all(
      rawCategories.map(async (cat) => {
        const itemCount = await prisma.item.count({
          where: { feed: { categoryId: cat.id } }
        });
        return { ...cat, _count: { feeds: itemCount } }; 
      })
    );

    // 🚨 YENİ: Gerçek okunmamış ve kaydedilmiş sayıları veritabanından çekiliyor
    if (user) {
      const [unreadCount, savedCount] = await Promise.all([
        prisma.item.count({
          where: { NOT: { readBy: { some: { userId: user.id } } } }
        }),
        prisma.savedItem.count({
          where: { userId: user.id }
        })
      ]);
      counts = { allUnread: unreadCount, saved: savedCount };
    } else {
      const allItemsCount = await prisma.item.count();
      counts = { allUnread: allItemsCount, saved: 0 };
    }

  } catch (error) {
    console.error("[Error] Sidebar Data Fetch:", error);
    hasError = true;
  }

  return (
    <aside className="w-[--sidebar-width] bg-[--color-bg-primary] border-r border-[--color-border] flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-7 flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200 shadow-sm">
          <Library size={20} strokeWidth={2.5} className="text-blue-700" />
        </div>
        <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
          Frontpage
        </h1>
      </div>

      {hasError ? (
        <div className="px-7 py-4 text-sm text-red-500">Connection Failed</div>
      ) : (
        <SidebarNav categories={categoriesWithCounts} counts={counts} />
      )}

      <div className="p-5 mt-auto border-t border-[--color-border-subtle] bg-[--color-bg-secondary]">
        <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasError ? 'text-red-500' : 'text-emerald-600'}`}>
          {hasError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{hasError ? 'Connection Issue' : 'All feeds healthy'}</span>
        </div>
      </div>
    </aside>
  );
}