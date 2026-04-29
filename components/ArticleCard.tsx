import { ExternalLink } from "lucide-react";

interface ArticleCardProps {
  item: {
    title: string;
    link: string;
    description: string | null;
    pubDate: Date;
    feed: {
      title: string;
    };
  };
}

export default function ArticleCard({ item }: ArticleCardProps) {
  // Tarihi zarif bir formata çeviriyoruz (Örn: Apr 28, 2026)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(item.pubDate));

  return (
    <a 
      href={item.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block group outline-none"
    >
      <article className="p-5 -mx-5 rounded-[--radius-lg] border border-transparent hover:border-[--color-border] hover:bg-[--color-bg-secondary]/50 transition-all duration-300">
        {/* Üst Bilgi: Kaynak ve Tarih */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[--color-text-tertiary]">
            {item.feed.title}
          </span>
          <span className="w-1 h-1 rounded-full bg-[--color-border-subtle]"></span>
          <span className="text-[11px] font-medium text-[--color-text-tertiary]">
            {formattedDate}
          </span>
        </div>

        {/* Başlık */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl font-bold text-[--color-text-primary] group-hover:text-[--color-accent] transition-colors leading-snug">
            {item.title}
          </h3>
          <ExternalLink 
            size={16} 
            className="text-[--color-text-tertiary] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" 
          />
        </div>

        {/* Açıklama (Sadece 2 satır gösterilir) */}
        {item.description && (
          <p className="text-[--text-sm] text-[--color-text-secondary] line-clamp-2 leading-relaxed">
            {/* HTML etiketlerini basitçe temizliyoruz */}
            {item.description.replace(/<[^>]*>?/gm, '').trim()}
          </p>
        )}
      </article>
    </a>
  );
}