"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // 🚨 DEVRE KESİCİ: URL'deki veri ile kullanıcının yazdığı aynıysa, işlemi iptal et (Sonsuz döngüyü kırar)
      const currentUrlQuery = searchParams.get("q") || "";
      if (query === currentUrlQuery) return; 

      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      
      // Kaydırma pozisyonunu sıfırlamaması için scroll: false ekleyebiliriz
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, pathname, searchParams]);

  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary]" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-[240px] pl-11 pr-4 py-2.5 bg-[--color-bg-secondary] border border-[--color-border] rounded-[--radius-md] text-[14px] font-medium outline-none focus:border-[--color-accent] transition-colors"
      />
    </div>
  );
}