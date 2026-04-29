import { prisma } from "@/lib/db";

export default async function Home() {
  // 1. Prisma nesnesi null mı kontrol et
  if (!prisma) {
    return <div className="p-10 text-red-500">Kritik Hata: Prisma başlatılamadı!</div>;
  }

  let feedCount = 0;

  try {
    // 2. Sadece prisma varsa count çalıştır
    feedCount = await prisma.feed.count();
  } catch (error: any) {
    console.error("❌ Veri çekme hatası:", error.message);
    // Hata durumunda kullanıcıya bilgi ver ama uygulamayı çökertme
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold">All Items</h1>
      <p className="text-xl mt-2">Everything from your {feedCount} subscriptions.</p>
    </div>
  );
}