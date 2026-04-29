"use client";

import { LayoutGrid, List as ListIcon } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL'de bir şey yoksa varsayılan olarak 'list' görünümü
  const currentView = searchParams.get("view") || "list";

  const setView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-[--color-bg-secondary] p-1.5 rounded-[--radius-md] border border-[--color-border] self-stretch">
      <button
        onClick={() => setView("grid")}
        className={`p-2.5 rounded-[--radius-sm] transition-all duration-200 ${
          currentView === 'grid' 
            ? 'bg-white shadow-sm text-[--color-accent]' 
            : 'text-[--color-text-tertiary] hover:text-[--color-text-secondary]'
        }`}
        title="Grid View"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => setView("list")}
        className={`p-2.5 rounded-[--radius-sm] transition-all duration-200 ${
          currentView === 'list' 
            ? 'bg-white shadow-sm text-[--color-accent]' 
            : 'text-[--color-text-tertiary] hover:text-[--color-text-secondary]'
        }`}
        title="List View"
      >
        <ListIcon size={18} />
      </button>
    </div>
  );
}