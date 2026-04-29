import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Makaleyi ve bağlı olduğu feed (kaynak) bilgisini çekiyoruz
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      feed: true,
    },
  });

  if (!item) {
    return notFound();
  }

  const formattedDate = format(new Date(item.pubDate), "MMMM d, yyyy");

  return (
    <div className="min-h-screen bg-[--color-bg-primary]">
      {/* Üst Navigasyon Çubuğu */}
      <header className="sticky top-0 z-10 bg-[--color-bg-primary]/80 backdrop-blur-md border-b border-[--color-border-subtle]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[14px] font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to feed
          </Link>

          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-[--radius-sm] bg-[--color-bg-secondary] text-[--color-text-primary] hover:bg-[--color-border-subtle] transition-colors"
          >
            Read Original
            <ExternalLink size={14} />
          </a>
        </div>
      </header>

      {/* Makale İçeriği */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Makale Başlığı ve Meta Veriler */}
        <div className="mb-10 space-y-6">
          <div className="flex items-center gap-3 text-[13px] font-semibold text-[--color-text-tertiary]">
            <span className="text-[--color-accent] uppercase tracking-wider">{item.feed.title}</span>
            <span className="w-1 h-1 rounded-full bg-[--color-border]"></span>
            <span>{formattedDate}</span>
            {item.author && (
              <>
                <span className="w-1 h-1 rounded-full bg-[--color-border]"></span>
                <span>by {item.author.replace(/by /g, '')}</span>
              </>
            )}
          </div>

          <h1 className="text-[40px] font-extrabold text-[--color-text-primary] leading-[1.1] tracking-tight">
            {item.title}
          </h1>
        </div>

        {/* Tipografi Sınıflarıyla Formatlanmış İçerik */}
        <article className="prose prose-zinc prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[--color-accent] prose-img:rounded-[--radius-lg] prose-img:border prose-img:border-[--color-border-subtle]">
          {item.content ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: item.description || "İçerik bulunamadı." }} />
          )}
        </article>
      </main>
    </div>
  );
}