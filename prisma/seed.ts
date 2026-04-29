import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('[Info] Connecting to Neon via native Prisma Client...');

  try {
    const dataPath = path.join(process.cwd(), 'data', 'sample-feeds.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const { categories } = JSON.parse(fileContents);
    console.log('[Info] Seeding process started...');

    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { name: categoryData.name },
        update: {},
        create: { name: categoryData.name },
      });
      console.log(`[Success] Category: ${category.name}`);

      for (const feedData of categoryData.feeds) {
        await prisma.feed.upsert({
          where: { url: feedData.feedUrl },
          update: { 
            title: feedData.title, 
            description: feedData.description, 
            siteUrl: feedData.siteUrl, 
            status: 'active' 
          },
          create: { 
            url: feedData.feedUrl, 
            title: feedData.title, 
            description: feedData.description, 
            siteUrl: feedData.siteUrl, 
            status: 'active', 
            categoryId: category.id 
          },
        });
      }
    }
    console.log('[Success] Seeding finished successfully!');
  } catch (error) {
    console.error('[Error] Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { 
  console.error('[Fatal] Critical failure:', e); 
  process.exit(1); 
});