import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  item: {
    id: string;
    title: string;
    link: string;
    description: string | null;
    author: string | null;
    pubDate: Date;
    feed: {
      title: string;
      siteUrl: string | null;
      // 1. Kategori bilgisini type'a ekliyoruz
      category?: { name: string } | null; 
    };
  };
  viewMode?: string;
}

const tagColorMap: { [key: string]: { bg: string, text: string } } = {
  "AI & ML": { bg: "var(--tag-ai-bg)", text: "var(--tag-ai-text)" },
  "Backend & DevOps": { bg: "var(--tag-backend-bg)", text: "var(--tag-backend-text)" },
  "Design": { bg: "var(--tag-design-bg)", text: "var(--tag-design-text)" },
  "Frontend": { bg: "var(--tag-frontend-bg)", text: "var(--tag-frontend-text)" },
  "General Tech": { bg: "var(--tag-general-bg)", text: "var(--tag-general-text)" },
};

export default function ArticleCard({ item, viewMode = "list" }: ArticleCardProps) {
  const relativeTime = formatDistanceToNow(new Date(item.pubDate), { addSuffix: true })
    .replace('about ', '').replace(' ago', ' ago');

  const publisherName = item.feed.title;
  // 2. Artık sabit "Design" değil, veritabanından gelen kendi gerçek kategorisi!
  const categoryTag = item.feed.category?.name || "General Tech"; 

 return (
    <Link href={`/article/${item.id}`} className={`block group outline-none h-full`}>
      <article className={`
        h-full flex flex-col p-6 rounded-[--radius-lg] transition-all duration-300
        ${viewMode === 'grid' 
          ? 'border border-[--color-border] bg-white hover:shadow-lg hover:-translate-y-1' 
          : 'border border-transparent hover:border-[--color-border] hover:bg-[--color-bg-secondary] -mx-6'
        }
      `}>
        {/* 🚨 DÜZELTİLEN İKON VE META BÖLÜMÜ */}
        <div className="flex items-center gap-2.5 mb-3 text-[12px] font-medium text-zinc-500">
          {/* İkon Kutusu: Koyu gri arka plan, beyaz harf */}
          <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-bold text-white text-[11px] uppercase shadow-sm flex-shrink-0">
            {publisherName.substring(0, 1)}
          </div>
          <span className="font-bold text-zinc-900 truncate max-w-[140px]">
            {publisherName}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 flex-shrink-0"></span>
          <span className="truncate">
            {relativeTime}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className={`font-extrabold text-[--color-text-primary] group-hover:text-blue-600 transition-colors leading-tight tracking-tight ${viewMode === 'grid' ? 'text-lg line-clamp-2' : 'text-xl'}`}>
            {item.title}
          </h3>
          {viewMode === 'list' && (
            <ExternalLink size={14} className="text-[--color-text-tertiary] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
          )}
        </div>

        {item.description && (
          <p className={`text-[14px] text-[--color-text-secondary] leading-relaxed mb-4 ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {item.description.replace(/<[^>]*>?/gm, '').trim()}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-transparent group-hover:border-slate-100 transition-colors">
          <span 
            className="text-[10px] font-extrabold px-2.5 py-1 rounded-[4px] tracking-tight uppercase"
            style={{ 
              backgroundColor: tagColorMap[categoryTag]?.bg || "#f1f5f9", 
              color: tagColorMap[categoryTag]?.text || "#64748b" 
            }}
          >
            {categoryTag}
          </span>
          
          {item.author && viewMode === 'list' && (
            <span className="text-[11px] font-medium text-[--color-text-tertiary]">
              by {item.author.replace(/by /g, '')}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}