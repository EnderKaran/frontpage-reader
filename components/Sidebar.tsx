import { Inbox, Bookmark, Hash, CheckCircle2, AlertCircle } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function Sidebar() {
  let categories: any[] = [];
  let hasError = false;

  if (!prisma) {
    return <aside className="w-[--sidebar-width] p-4 text-red-500">Prisma Client Not Initialized</aside>;
  }

  try {
    categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { feeds: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("❌ Sidebar Veri Çekme Hatası:", error);
    hasError = true;
  }
  return (
    <aside className="w-[--sidebar-width] bg-[--color-bg-secondary] border-r border-[--color-border] flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50">
      {/* Marka & Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[--color-accent] rounded-[--radius-md] flex items-center justify-center shadow-sm">
          <div className="w-3.5 h-3.5 bg-white rounded-[2px]" />
        </div>
        <h1 className="text-[--text-lg] font-semibold text-[--color-text-primary] tracking-tight">
          Frontpage
        </h1>
      </div>

      {/* Navigasyon */}
      <nav className="flex-1 px-4 space-y-1">
        <NavItem icon={<Inbox size={18} />} label="All Items" count={0} active />
        <NavItem icon={<Bookmark size={18} />} label="Saved" count={0} />
        
        <div className="mt-8 mb-2 px-3 text-[--text-xs] font-semibold text-[--color-text-tertiary] uppercase tracking-wider">
          Categories
        </div>

        <div className="space-y-0.5">
          {hasError ? (
            <div className="px-3 py-2 text-[10px] text-red-500 bg-red-50 rounded-md">
              Bağlantı sorunu yaşanıyor.
            </div>
          ) : (
            categories.map((category) => (
              <NavItem 
                key={category.id} 
                icon={<Hash size={18} />} 
                label={category.name} 
                count={category._count?.feeds || 0} 
              />
            ))
          )}
        </div>
      </nav>

      {/* Sistem Durumu */}
      <div className="p-4 border-t border-[--color-border-subtle] bg-[--color-bg-primary]">
        <div className={`flex items-center gap-2 text-[--text-xs] font-medium ${hasError ? 'text-red-500' : 'text-emerald-600'}`}>
          {hasError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{hasError ? 'Connection Issue' : 'Systems Online'}</span>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, count, active = false }: { icon: React.ReactNode, label: string, count: number, active?: boolean }) {
  return (
    <div className={`
      flex items-center justify-between px-3 py-2 rounded-[--radius-md] cursor-pointer transition-all duration-200 group
      ${active 
        ? 'bg-[--color-accent-subtle] text-[--color-accent]' 
        : 'text-[--color-text-secondary] hover:bg-[--color-bg-tertiary] hover:text-[--color-text-primary]'}
    `}>
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-[--color-accent]' : 'text-[--color-text-tertiary] group-hover:text-[--color-text-secondary]'}`}>
          {icon}
        </span>
        <span className="text-[--text-sm] font-medium">{label}</span>
      </div>
      {count > 0 && (
        <span className={`text-[--text-xs] font-semibold px-1.5 py-0.5 rounded-full ${active ? 'bg-[--color-accent] text-white' : 'bg-[--color-bg-tertiary] text-[--color-text-tertiary] opacity-80'}`}>
          {count}
        </span>
      )}
    </div>
  );
}