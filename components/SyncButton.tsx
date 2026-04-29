"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    console.log("1️⃣ Butona tıklandı, işlem başlıyor...");
    setIsSyncing(true);
    
    try {
      console.log("2️⃣ API'ye istek atılıyor: /api/sync");
      const response = await fetch('/api/sync', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log("3️⃣ API'den ham yanıt geldi. Status:", response.status);
      
      const text = await response.text();
      console.log("4️⃣ API'den dönen metin:", text.substring(0, 100) + "...");
      
      const data = JSON.parse(text);
      console.log("5️⃣ JSON başarıyla çözümlendi:", data);
      
      if (data.success) {
        alert(`✅ Başarılı! Veritabanına ${data.itemsProcessed} yeni makale eklendi.`);
        window.location.reload(); 
      } else {
        alert(`⚠️ Bir sorun oluştu: ${data.message || data.error}`);
      }
    } catch (error: any) {
      console.error("🚨 KATCH BLOĞU HATASI:", error);
      alert(`❌ İşlem sırasında hata: ${error.message}`);
    } finally {
      console.log("6️⃣ İşlem bitti (finally bloğu).");
      setIsSyncing(false);
    }
  };

  return (
    <button 
      onClick={handleSync}
      disabled={isSyncing}
      // BURAYI DEĞİŞTİRDİK: Standart Tailwind sınıfları kullandık (bg-zinc-900)
      className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-md font-semibold hover:bg-zinc-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw 
        size={18} 
        className={isSyncing ? "animate-spin" : ""} 
      />
      {isSyncing ? "Syncing..." : "Sync Feeds"}
    </button>
  );
}