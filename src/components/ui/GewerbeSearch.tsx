"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef } from "react";

export function GewerbeSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSearch = searchParams.get("search") ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-xl">
      <div className="flex-1 flex items-center bg-surface-container-low border border-outline-variant/20 px-4 py-2.5 gap-3 focus-within:border-secondary/40 transition-colors">
        <span className="material-symbols-outlined text-on-surface-variant/50 text-lg flex-shrink-0">search</span>
        <input
          ref={inputRef}
          type="text"
          defaultValue={currentSearch}
          placeholder="Unternehmensname suchen…"
          className="bg-transparent outline-none text-sm text-primary placeholder:text-on-surface-variant/40 font-medium w-full"
        />
        {currentSearch && (
          <button type="button" onClick={handleClear} className="material-symbols-outlined text-on-surface-variant/50 hover:text-primary transition-colors text-lg flex-shrink-0">
            close
          </button>
        )}
      </div>
      <button
        type="submit"
        className="signature-gradient text-on-secondary text-[10px] font-black uppercase tracking-widest px-5 py-3 hover:brightness-110 transition-all flex-shrink-0"
      >
        Suchen
      </button>
    </form>
  );
}
