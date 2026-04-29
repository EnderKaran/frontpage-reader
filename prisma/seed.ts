import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import fs from 'fs';
import path from 'path';
import ws from 'ws';

// Node.js ortamı için WebSocket yapılandırması
neonConfig.webSocketConstructor = ws;

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("❌ DATABASE_URL tanımlı değil! .env dosyanızı kontrol edin.");
  }

  // Havuzu ve Client'ı fonksiyon içinde başlatıyoruz
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  const prisma = new PrismaClient({ adapter });

  try {
    const dataPath = path.join(process.cwd(), 'data', 'sample-feeds.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const { categories } = JSON.parse(fileContents);

    console.log('🌱 Seeding started with robust connection check...');

    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { name: categoryData.name },
        update: {},
        create: { name: categoryData.name },
      });

      console.log(`📂 Category: ${category.name}`);

      for (const feedData of categoryData.feeds) {
        await prisma.feed.upsert({
          where: { url: feedData.feedUrl },
          update: {
            title: feedData.title,
            description: feedData.description,
            siteUrl: feedData.siteUrl,
            status: 'active',
          },
          create: {
            url: feedData.feedUrl,
            title: feedData.title,
            description: feedData.description,
            siteUrl: feedData.siteUrl,
            status: 'active',
            categoryId: category.id,
          },
        });
      }
    }

    console.log('✅ Seeding finished! 19 feeds are now in Neon DB.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});