import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'creator'],
  }
});

// ÇELİK KALKAN: Next.js ve Bot Korumalarına karşı kesin zaman aşımı
const fetchWithTimeout = async (url: string, timeoutMs: number = 8000) => {
  const timeoutPromise = new Promise<any>((_, reject) => {
    setTimeout(() => reject(new Error("Yanıt süresi aşıldı (Bot korumasına takıldı veya site yavaş)")), timeoutMs);
  });
  
  return Promise.race([
    parser.parseURL(url),
    timeoutPromise
  ]);
};

export async function POST() {
  try {
    const feeds = await prisma.feed.findMany({
      where: { status: 'active' }
    });

    if (feeds.length === 0) {
      return NextResponse.json({ success: false, message: "Aktif feed bulunamadı." }, { status: 404 });
    }

    let newItemsCount = 0;

    for (const feed of feeds) {
      try {
        console.log(`[Bilgi] Çekiliyor: ${feed.title}...`);
        
        // parser.parseURL yerine kendi güvenli fonksiyonumuzu kullanıyoruz
        const parsedFeed = await fetchWithTimeout(feed.url, 8000);

        for (const item of parsedFeed.items) {
          if (!item.link || !item.title) continue;

          await prisma.item.upsert({
            where: { link: item.link },
            update: {}, 
            create: {
              title: item.title,
              link: item.link,
              description: item.contentSnippet?.substring(0, 300) || item.summary?.substring(0, 300) || '',
              content: item['content:encoded'] || item.content || '',
              author: item.creator || item.author || feed.title,
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              feedId: feed.id
            }
          });
          newItemsCount++;
        }

        // Feed güncellenme tarihini yenile
        await prisma.feed.update({
          where: { id: feed.id },
          data: { lastFetchedAt: new Date() }
        });

      } catch (error: any) {
        // Hata alan kaynağı konsola yazdır ama sistemi durdurma, diğerine geç
        console.error(`[Atlandı] ${feed.title} kaynağı pas geçildi:`, error.message);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Senkronizasyon tamamlandı.",
      itemsProcessed: newItemsCount
    });

  } catch (error: any) {
    console.error("[Kritik Hata] API Sync başarısız:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}