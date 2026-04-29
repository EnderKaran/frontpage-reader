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
      category?: { name: string } | null;
    };
    readBy?: any[]; // Okundu bilgisi
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
  const categoryTag = item.feed.category?.name || "General Tech"; 

  // Makale okundu mu? (Okundu dizisi doluysa evet)
  const isRead = item.readBy && item.readBy.length > 0;

  return (
    <Link href={`/article/${item.id}`} className={`block group outline-none h-full`}>
      <article className={`
        h-full flex flex-col p-6 rounded-[--radius-lg] transition-all duration-300
        ${viewMode === 'grid' 
          ? 'border border-[--color-border] bg-white hover:shadow-lg hover:-translate-y-1' 
          : 'border border-transparent hover:border-[--color-border] hover:bg-[--color-bg-secondary] -mx-6'
        }
      `}>
        {/* İKON VE META BÖLÜMÜ (Okunduysa opaklık düşer) */}
        <div className={`flex items-center gap-2.5 mb-3 text-[12px] font-medium transition-opacity ${isRead ? 'opacity-60 text-zinc-400' : 'text-zinc-500'}`}>
          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] uppercase shadow-sm flex-shrink-0 transition-colors ${isRead ? 'bg-zinc-200 text-zinc-500' : 'bg-zinc-800 text-white'}`}>
            {publisherName.substring(0, 1)}
          </div>
          <span className={`font-bold truncate max-w-[140px] transition-colors ${isRead ? 'text-zinc-500' : 'text-zinc-900'}`}>
            {publisherName}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-300 flex-shrink-0"></span>
          <span className="truncate">
            {relativeTime}
          </span>
        </div>

        {/* BAŞLIK (Okunduysa gri ve normal kalınlık, okunmadıysa siyah ve ekstra kalın) */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className={`transition-colors leading-tight tracking-tight group-hover:text-blue-600 
            ${isRead ? 'font-semibold text-zinc-500' : 'font-extrabold text-[--color-text-primary]'} 
            ${viewMode === 'grid' ? 'text-lg line-clamp-2' : 'text-xl'}`}
          >
            {item.title}
          </h3>
          {viewMode === 'list' && (
            <ExternalLink size={14} className="text-[--color-text-tertiary] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
          )}
        </div>

        {/* AÇIKLAMA (Okunduysa daha da silik bir metin rengi) */}
        {item.description && (
          <p className={`text-[14px] leading-relaxed mb-4 transition-colors
            ${isRead ? 'text-zinc-400' : 'text-[--color-text-secondary]'} 
            ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {item.description.replace(/<[^>]*>?/gm, '').trim()}
          </p>
        )}

        {/* TAG VE YAZAR */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-transparent group-hover:border-slate-100 transition-colors">
          <span 
            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-[4px] tracking-tight uppercase transition-opacity ${isRead ? 'opacity-60' : 'opacity-100'}`}
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