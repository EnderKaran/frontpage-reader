import { CheckCircle2, AlertCircle, Library } from 'lucide-react';
import { prisma } from '@/lib/db';
import SidebarNav from './SidebarNav';


export default async function Sidebar() {
  let categories: any[] = [];
  let counts = { allUnread: 0, saved: 0 };
  let hasError = false;

  if (!prisma) {
    return <aside className="w-[--sidebar-width] p-4 text-red-500">Prisma Client Not Initialized</aside>;
  }

  try {
    // Verileri paralel ve güvenli çekiyoruz
    const [categoriesData, allUnreadCount, savedCount] = await Promise.all([
      prisma.category.findMany({
        include: {
          _count: {
            select: { feeds: { where: { status: 'active' } } }
          }
        },
        orderBy: { name: 'asc' }
      }),
      // Gelecekte User ID ile okunmamış takibi yapacağız, şimdilik toplam makale sayısı
      prisma.item.count(), 
      // Gelecekte User ID ile "Saved" takibi yapacağız, şimdilik 0
      0 
    ]);
    categories = categoriesData;
    counts = { allUnread: allUnreadCount, saved: savedCount };
  } catch (error) {
    console.error("[Error] Sidebar Data Fetch:", error);
    hasError = true;
  }

  return (
    <aside className="w-[--sidebar-width] bg-[--color-bg-primary] border-r border-[--color-border] flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-7 flex items-center gap-3">
        <div className="w-9 h-9 bg-[--color-accent] rounded-[--radius-md] flex items-center justify-center shadow-sm text-white">
          <Library size={20} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold text-[--color-text-primary] tracking-tight">
          Frontpage
        </h1>
      </div>

      {hasError ? (
        <div className="px-7 py-4 text-sm text-red-500">Connection Failed</div>
      ) : (
        <SidebarNav categories={categories} counts={counts} />
      )}

      {/* Referans görseldeki gibi daha cilalı system status */}
      <div className="p-5 mt-auto border-t border-[--color-border-subtle] bg-[--color-bg-secondary]">
        <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasError ? 'text-red-500' : 'text-emerald-600'}`}>
          {hasError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{hasError ? 'Connection Issue' : 'All feeds healthy'}</span>
        </div>
      </div>
    </aside>
  );
}