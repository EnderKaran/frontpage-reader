"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { toggleBookmark } from "@/app/actions";

export default function BookmarkButton({ itemId, initialSaved }: { itemId: string; initialSaved: boolean }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // 🚨 KRİTİK: Tıklamayı durdurur, yoksa bizi makale detay sayfasına atar!
    if (isPending) return;

    setIsPending(true);
    setIsSaved(!isSaved); // Kullanıcı beklemesin diye ikonu anında değiştiriyoruz (Optimistic UI)

    const result = await toggleBookmark(itemId, isSaved);
    
    // Eğer sunucuda hata olursa, ikonu eski haline geri çevir
    if (!result.success) {
      setIsSaved(isSaved);
    }
    
    setIsPending(false);
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={isPending}
      className="p-1.5 rounded-md hover:bg-zinc-200/50 transition-colors group/btn"
      title={isSaved ? "Remove from saved" : "Save for later"}
    >
      <Bookmark 
        size={16} 
        strokeWidth={2}
        className={`transition-all duration-300 ${
          isSaved 
            ? "fill-blue-600 text-blue-600" // Kaydedilmişse içi dolu mavi
            : "text-zinc-400 group-hover/btn:text-zinc-600" // Kaydedilmemişse boş gri
        }`} 
      />
    </button>
  );
}