"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Inbox, Bookmark, Hash, Settings2 } from "lucide-react";
import React, { useState } from "react";
import ManageFeedsModal from "./ManageFeedsModal";

const categoryColorMap: { [key: string]: string } = {
  "AI & ML": "var(--tag-ai-text)",
  "Backend & DevOps": "var(--tag-backend-text)",
  "Design": "var(--tag-design-text)",
  "Frontend": "var(--tag-frontend-text)",
  "General Tech": "var(--tag-general-text)",
};

export default function SidebarNav({ categories, counts, feeds }: { categories: any[], counts: any, feeds: any[] }) {
  const searchParams = useSearchParams();
  const currentCategoryName = searchParams.get("category");
  
  // Açılır pencere durumu
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="flex-1 px-4 space-y-1">
        <NavItem
          href="/"
          icon={<Inbox size={18} />}
          label="All Items"
          count={counts.allUnread || 0}
          active={!currentCategoryName}
        />
        <NavItem 
          href="/saved" 
          icon={<Bookmark size={18} />} 
          label="Saved" 
          count={counts.saved || 0} 
          active={false} 
        />

        {/* Kategoriler Başlığı ve Ayarlar İkonu */}
       <div className="mt-9 mb-2 px-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[--color-text-tertiary] uppercase tracking-widest">
            Categories
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            // 🚨 DEĞİŞİM BURADA: opacity-0 kaldırıldı, her zaman zarif bir gri olacak, üzerine gelince maviye dönecek
            className="text-zinc-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-all"
            title="Manage Subscriptions"
          >
            <Settings2 size={16} />
          </button>
        </div>

        <div className="space-y-0.5">
          {categories.map((category) => (
            <NavItem
              key={category.id}
              href={`/?category=${encodeURIComponent(category.name)}`}
              icon={<Hash size={18} />}
              label={category.name}
              count={category._count?.feeds || 0}
              active={currentCategoryName === category.name}
              color={categoryColorMap[category.name] || "var(--color-text-tertiary)"}
            />
          ))}
        </div>
      </nav>

      {/* Kaynak Yönetimi Açılır Penceresi */}
      <ManageFeedsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories} 
        feeds={feeds} 
      />
    </>
  );
}

function NavItem({ icon, label, count, active = false, href, color }: { icon: React.ReactNode, label: string, count: number, active?: boolean, href: string, color?: string }) {
  return (
    <Link href={href} className="block outline-none">
      <div className={`
        flex items-center justify-between px-3 py-2.5 rounded-[--radius-md] cursor-pointer transition-all duration-200 group
        ${active
          ? 'bg-[--color-accent-subtle] text-[--color-accent]' 
          : 'text-[--color-text-secondary] hover:bg-[--color-bg-tertiary] hover:text-[--color-text-primary]'}
      `}>
        <div className="flex items-center gap-3">
          <span className={`${active ? 'text-[--color-accent]' : 'text-[--color-text-tertiary] group-hover:text-[--color-text-secondary]'}`} style={!active ? { color }: {}}>
            {icon}
          </span>
          <span className="text-[14px] font-semibold">{label}</span>
        </div>
        
        {/* Sayının arkasındaki background kaldırıldı. Sadece aktifse mavi, değilse gri font */}
        {count > 0 && (
          <span className={`text-[12px] font-bold ${active ? 'text-[--color-accent]' : 'text-[--color-text-tertiary] opacity-80'}`}>
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}