import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id }, include: { feed: true } });
  if (!item) return notFound();

  let user = await prisma.user.findFirst();
  if (!user) user = await prisma.user.create({ data: { email: "demo@frontpage.local", password: "password123" } });

  await prisma.readState.upsert({
    where: { userId_itemId: { userId: user.id, itemId: item.id } },
    update: {},
    create: { userId: user.id, itemId: item.id }
  });

  const formattedDate = format(new Date(item.pubDate), "MMMM d, yyyy");

  return (
    <div className="min-h-screen bg-[--color-bg-primary]">
      <header className="sticky top-0 z-50 bg-[--color-bg-primary]/90 backdrop-blur-md border-b border-[--color-border-subtle]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to feed</span>
          </Link>
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12px] font-bold px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors">
            Original <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-zinc-400">
            <span className="text-blue-600 uppercase tracking-widest">{item.feed.title}</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-300"></span>
            <span>{formattedDate}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
            {item.title}
          </h1>
          {item.author && <p className="text-sm font-medium text-zinc-500">by {item.author.replace(/by /g, '')}</p>}
        </div>

        <article className="prose prose-zinc prose-base sm:prose-lg max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight 
          prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-sm">
          <div dangerouslySetInnerHTML={{ __html: item.content || item.description || "" }} />
        </article>
      </main>
    </div>
  );
}