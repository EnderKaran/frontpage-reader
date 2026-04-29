"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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