import { CheckCircle2, AlertCircle, Library } from 'lucide-react';
import { prisma } from '@/lib/db';
import SidebarNav from './SidebarNav';
import MobileSidebar from './MobileSidebar';

export default async function Sidebar() {
  let categoriesWithCounts: any[] = [];
  let counts = { allUnread: 0, saved: 0 };
  let allFeeds: any[] = [];
  let hasError = false;

  if (!prisma) {
    return <aside className="w-[280px] p-4 text-red-500">Prisma Client Not Initialized</aside>;
  }

  try {
    // Demo kullanıcıyı bul (Okundu/Kaydedildi sayıları için)
    let user = await prisma.user.findFirst();

    // 1. Kategorileri ve içindeki toplam makale sayılarını çek
    const rawCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    categoriesWithCounts = await Promise.all(
      rawCategories.map(async (cat) => {
        const itemCount = await prisma.item.count({
          where: { feed: { categoryId: cat.id } }
        });
        return { ...cat, _count: { feeds: itemCount } }; 
      })
    );

    // 2. Yönetim ekranı için sistemdeki tüm feed'leri çek
    allFeeds = await prisma.feed.findMany({
      orderBy: { title: 'asc' },
    });

    // 3. Okunmamış ve Kaydedilmiş sayılarını hesapla
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
    }

  } catch (error) {
    console.error("[Error] Sidebar Data Fetch:", error);
    hasError = true;
  }

  // Ortak Sidebar İçeriği (Hem Mobil hem Desktop aynı içeriği kullanır)
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white lg:bg-transparent">
      {/* Logo Alanı */}
      <div className="p-7 flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200 shadow-sm">
          <Library size={20} strokeWidth={2.5} className="text-blue-700" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Frontpage
        </h1>
      </div>

      {/* Navigasyon Linkleri */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <SidebarNav 
          categories={categoriesWithCounts} 
          counts={counts} 
          feeds={allFeeds} 
        />
      </div>

      {/* Alt Sağlık Durumu Göstergesi */}
      <div className="p-5 border-t border-zinc-100 bg-zinc-50/50">
        <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasError ? 'text-red-500' : 'text-emerald-600'}`}>
          {hasError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{hasError ? 'Connection Issue' : 'All feeds healthy'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 🖥️ MASAÜSTÜ SIDEBAR: Sadece lg (1024px) ve üzerinde görünür */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-zinc-100 flex-col h-screen fixed left-0 top-0 z-50">
        {sidebarContent}
      </aside>

      {/* 📱 MOBİL HEADER & MENÜ: lg altında görünür, MobileSidebar açılır menüyü yönetir */}
      <MobileSidebar>
        {sidebarContent}
      </MobileSidebar>
    </>
  );
}