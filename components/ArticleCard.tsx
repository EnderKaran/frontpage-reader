import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  item: {
    title: string;
    link: string;
    description: string | null;
    author: string | null;
    pubDate: Date;
    feed: {
      title: string;
      siteUrl: string | null;
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
    .replace('about ', '')
    .replace(' ago', ' ago');

  const publisherName = item.feed.title;
  // Kategori etiketi için geçici placeholder (Kendi kategorisini çekmek için veritabanı ilişkisi geliştirilebilir)
  const categoryTag = "Design"; 

  return (
    <a 
      href={item.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`block group outline-none h-full`}
    >
      <article className={`
        h-full flex flex-col p-6 rounded-[--radius-lg] transition-all duration-300
        ${viewMode === 'grid' 
          ? 'border border-[--color-border] bg-white hover:shadow-lg hover:-translate-y-1' 
          : 'border border-transparent hover:border-[--color-border] hover:bg-[--color-bg-secondary] -mx-6'
        }
      `}>
        {/* Meta Satırı */}
        <div className="flex items-center gap-3 mb-3 text-[12px] font-medium text-[--color-text-tertiary]">
          <div className="w-5 h-5 rounded-[4px] bg-[--color-accent] flex items-center justify-center font-bold text-white text-[10px] uppercase">
            {publisherName.substring(0, 1)}
          </div>
          <span className="font-bold text-[--color-text-primary] truncate max-w-[120px]">
            {publisherName}
          </span>
          <span className="w-1 h-1 rounded-full bg-[--color-border-subtle]"></span>
          <span className="truncate">
            {relativeTime}
          </span>
        </div>

        {/* Başlık */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className={`font-extrabold text-[--color-text-primary] group-hover:text-[--color-accent] transition-colors leading-tight tracking-tight ${viewMode === 'grid' ? 'text-lg line-clamp-2' : 'text-xl'}`}>
            {item.title}
          </h3>
          {viewMode === 'list' && (
            <ExternalLink size={14} className="text-[--color-text-tertiary] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Açıklama */}
        {item.description && (
          <p className={`text-[14px] text-[--color-text-secondary] leading-relaxed mb-4 ${viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {item.description.replace(/<[^>]*>?/gm, '').trim()}
          </p>
        )}

        {/* Alt Kısım: Tag ve Opsiyonel Bilgiler */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span 
            className="text-[10px] font-extrabold px-2.5 py-1 rounded-[4px] tracking-tight uppercase"
            style={{ 
              backgroundColor: tagColorMap[categoryTag]?.bg || "var(--color-bg-tertiary)", 
              color: tagColorMap[categoryTag]?.text || "var(--color-text-tertiary)" 
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
    </a>
  );
}