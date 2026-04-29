"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* Mobil Header — lg'de gizli, sticky, tam genişlik */}
      <header className="lg:hidden h-16 border-b border-[--color-border-subtle] bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 left-0 w-full z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">
            F
          </div>
          <span className="font-bold tracking-tight text-[--color-text-primary]">Frontpage</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-[--color-text-tertiary] hover:bg-[--color-bg-secondary] rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`
          lg:hidden fixed inset-y-0 left-0 w-[280px] bg-white z-[70] shadow-2xl
          transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-5 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}