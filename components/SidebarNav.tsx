"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Inbox, Bookmark, Hash } from "lucide-react";
import React from "react";

const categoryColorMap: { [key: string]: string } = {
  "AI & ML": "var(--tag-ai-text)",
  "Backend & DevOps": "var(--tag-backend-text)",
  "Design": "var(--tag-design-text)",
  "Frontend": "var(--tag-frontend-text)",
  "General Tech": "var(--tag-general-text)",
};

export default function SidebarNav({ categories, counts }: { categories: any[], counts: any }) {
  const searchParams = useSearchParams();
  const currentCategoryName = searchParams.get("category");

  return (
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

      <div className="mt-9 mb-2 px-3 text-[11px] font-bold text-[--color-text-tertiary] uppercase tracking-widest">
        Categories
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
        
        {/* 🚨 DÜZELTİLDİ: Sayının arkasındaki background kaldırıldı. Sadece aktifse mavi, değilse gri font */}
        {count > 0 && (
          <span className={`text-[12px] font-bold ${active ? 'text-[--color-accent]' : 'text-[--color-text-tertiary] opacity-80'}`}>
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}