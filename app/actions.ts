"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Parser from "rss-parser";

export async function toggleBookmark(itemId: string, isCurrentlySaved: boolean) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return { success: false };

    if (isCurrentlySaved) {
      // Zaten kayıtlıysa, favorilerden çıkar
      await (prisma as any).savedItem.delete({
        where: {
          userId_itemId: { userId: user.id, itemId: itemId }
        }
      });
    } else {
      // Kayıtlı değilse, favorilere ekle
      await (prisma as any).savedItem.create({
        data: { userId: user.id, itemId: itemId }
      });
    }

    // Ana sayfanın ve Saved sayfasının verilerini anında yenile
    revalidatePath("/");
    revalidatePath("/saved");
    
    return { success: true };
  } catch (error) {
    console.error("Bookmark hatası:", error);
    return { success: false };
  }
}

export async function addFeed(url: string, categoryId: string) {
  try {
    const parser = new Parser({ timeout: 8000 });
    
    // 1. Önce linki test et (Geçerli bir RSS mi?)
    const feed = await parser.parseURL(url);
    
    if (!feed.title) {
      return { success: false, error: "Geçerli bir RSS kaynağı bulunamadı." };
    }

    // 2. Veritabanına kaydet
    await prisma.feed.create({
      data: {
        url: url,
        title: feed.title,
        description: feed.description || "",
        siteUrl: feed.link || url,
        categoryId: categoryId,
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("RSS Ekleme Hatası:", error);
    return { success: false, error: "Bu URL'den RSS çekilemedi. Bağlantıyı kontrol edin." };
  }
}

// Feed Silme
export async function deleteFeed(feedId: string) {
  try {
    await prisma.feed.delete({
      where: { id: feedId }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Silme işlemi başarısız oldu." };
  }
}
