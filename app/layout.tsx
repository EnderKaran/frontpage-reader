import { Suspense } from "react";
import Sidebar from '@/components/Sidebar';
import './tailwind.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[--color-bg-primary] text-[--color-text-primary] antialiased">
        {/* Sidebar 'fixed' (Desktop) ve 'sticky' (Mobile Header) olduğu için 
            main içeriğiyle yan yana 'flex' olmalarına aslında gerek yok. 
            Bu yapı daha güvenlidir.
        */}
        <Suspense fallback={<div className="fixed inset-y-0 left-0 w-[280px] bg-white border-r animate-pulse" />}>
          <Sidebar />
        </Suspense>

        {/* İçerik Alanı:
            - lg:pl-[280px] -> Masaüstünde sidebar'ın yerini ayırır.
            - pt-16 lg:pt-0 -> Mobilde header'ın altında kalmasını engeller.
        */}
        <div className="min-h-screen lg:pl-[280px]">
          <main className="min-h-screen pt-16 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}