import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import BookmarkButton from "./BookmarkButton";

interface ArticleCardProps {
  item: {
    id: string; title: string; link: string; description: string | null; author: string | null; pubDate: Date;
    feed: { title: string; siteUrl: string | null; category?: { name: string } | null; };
    readBy?: any[]; savedBy?: any[];
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
  const relativeTime = formatDistanceToNow(new Date(item.pubDate), { addSuffix: true }).replace('about ', '').replace(' ago', ' ago');
  const publisherName = item.feed.title;
  const categoryTag = item.feed.category?.name || "General Tech"; 
  const isRead = item.readBy && item.readBy.length > 0;
  const isSaved = !!(item.savedBy && item.savedBy.length > 0);

  return (
    <Link href={`/article/${item.id}`} className="block group outline-none h-full">
      <article className={`
        h-full flex flex-col p-5 sm:p-6 rounded-[--radius-lg] transition-all duration-300
        ${viewMode === 'grid' 
          ? 'border border-[--color-border] bg-white hover:shadow-lg sm:hover:-translate-y-1' 
          : 'border border-transparent hover:border-[--color-border] hover:bg-[--color-bg-secondary] lg:-mx-6'
        }
      `}>
        <div className={`flex items-center gap-2.5 mb-3 text-[12px] font-medium transition-opacity ${isRead ? 'opacity-60 text-zinc-400' : 'text-zinc-500'}`}>
          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] uppercase shadow-sm ${isRead ? 'bg-zinc-200 text-zinc-500' : 'bg-zinc-800 text-white'}`}>
            {publisherName.substring(0, 1)}
          </div>
          <span className={`font-bold truncate max-w-[120px] sm:max-w-[180px] ${isRead ? 'text-zinc-500' : 'text-zinc-900'}`}>{publisherName}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
          <span className="truncate">{relativeTime}</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className={`transition-colors leading-tight tracking-tight group-hover:text-blue-600 
            ${isRead ? 'font-semibold text-zinc-500' : 'font-extrabold text-[--color-text-primary]'} 
            ${viewMode === 'grid' ? 'text-lg line-clamp-2' : 'text-xl sm:text-2xl'}`}
          >
            {item.title}
          </h3>
          <ExternalLink size={14} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1 hidden sm:block" />
        </div>

        {item.description && (
          <p className={`text-[14px] sm:text-[15px] leading-relaxed mb-4 transition-colors
            ${isRead ? 'text-zinc-400' : 'text-[--color-text-secondary]'} 
            ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {item.description.replace(/<[^>]*>?/gm, '').trim()}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-transparent group-hover:border-slate-100">
          <div className="flex items-center gap-3">
            <span 
              className="text-[10px] font-extrabold px-2.5 py-1 rounded-[4px] tracking-tight uppercase"
              style={{ backgroundColor: tagColorMap[categoryTag]?.bg || "#f1f5f9", color: tagColorMap[categoryTag]?.text || "#64748b" }}
            >
              {categoryTag}
            </span>
            {item.author && <span className="text-[11px] font-medium text-zinc-400 hidden sm:inline">by {item.author.replace(/by /g, '')}</span>}
          </div>
          <BookmarkButton itemId={item.id} initialSaved={isSaved} />
        </div>
      </article>
    </Link>
  );
}