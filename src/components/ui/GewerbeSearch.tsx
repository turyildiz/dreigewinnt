"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef, useEffect, useTransition } from "react";

export function GewerbeSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";

  // Keep input in sync if URL changes externally
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== currentSearch) {
      inputRef.current.value = currentSearch;
    }
  }, [currentSearch]);

  function updateSearch(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300);
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    updateSearch("");
  }

  return (
    <div className="flex items-center bg-surface-container-low border border-outline-variant/20 px-3 py-2 gap-2 focus-within:border-secondary/40 transition-colors">
      <span className={`material-symbols-outlined text-lg flex-shrink-0 transition-colors ${isPending ? "text-secondary animate-pulse" : "text-on-surface-variant/40"}`}>
        search
      </span>
      <input
        ref={inputRef}
        type="text"
        defaultValue={currentSearch}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder="Unternehmen suchen…"
        className="bg-transparent outline-none text-sm text-primary placeholder:text-on-surface-variant/40 font-medium w-full"
      />
      {currentSearch && (
        <button
          type="button"
          onClick={handleClear}
          className="material-symbols-outlined text-on-surface-variant/50 hover:text-primary transition-colors text-lg flex-shrink-0"
        >
          close
        </button>
      )}
    </div>
  );
}
