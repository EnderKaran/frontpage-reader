"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getMoreItems } from "@/app/actions";
import ArticleCard from "./ArticleCard";
import { format, isToday, isYesterday } from 'date-fns';
import { Loader2 } from "lucide-react";

interface LoadMoreProps {
  initialSkip: number;
  category?: string;
  searchQuery?: string;
  viewMode: string;
}

export default function LoadMore({ initialSkip, category, searchQuery, viewMode }: LoadMoreProps) {
  const { ref, inView } = useInView();
  const [items, setItems] = useState<any[]>([]);
  const [skip, setSkip] = useState(initialSkip);
  const [hasMore, setHasMore] = useState(true);

  // Ekranda göründüğünde ve daha makale varsa yeni veri çek
  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore]);

  const loadMore = async () => {
    const newItems = await getMoreItems(skip, category, searchQuery);
    
    if (newItems.length === 0) {
      setHasMore(false); // Daha makale kalmadıysa durdur
    } else {
      setItems((prev) => [...prev, ...newItems]);
      setSkip((prev) => prev + 50); // Bir sonraki tur için atlama sayısını artır
    }
  };

  // Yeni gelen makaleleri de ana sayfadaki gibi tarihe göre grupla
  const groupedItems: { [key: string]: any[] } = {};
  items.forEach((item) => {
    const pubDate = new Date(item.pubDate);
    let groupKey = format(pubDate, 'MMMM yyyy');

    if (isToday(pubDate)) groupKey = 'TODAY';
    else if (isYesterday(pubDate)) groupKey = 'YESTERDAY';

    if (!groupedItems[groupKey]) groupedItems[groupKey] = [];
    groupedItems[groupKey].push(item);
  });

  return (
    <>
      {/* Yeni gelen makaleleri gruplu şekilde render et */}
      {Object.keys(groupedItems).map((groupKey) => (
        <div key={groupKey} className="space-y-4 mt-10">
          <div className="text-[11px] font-bold text-[--color-text-tertiary] uppercase tracking-widest border-b border-[--color-border-subtle] pb-2">
            {groupKey}
          </div>
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-2"}>
            {groupedItems[groupKey].map((item: any) => (
              <ArticleCard key={item.id} item={item} viewMode={viewMode} />
            ))}
          </div>
        </div>
      ))}

      {/* Sayfanın en altındaki yükleme animasyonu (Tetikleyici) */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-10 mt-6">
          <Loader2 className="animate-spin text-zinc-300" size={28} />
        </div>
      )}
    </>
  );
}