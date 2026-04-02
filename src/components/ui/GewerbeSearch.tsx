"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";

interface Result {
  slug: string;
  name: string;
  town: string;
  category: string;
}

export function GewerbeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function search(value: string) {
    setQuery(value);
    setHighlighted(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("businesses")
        .select("slug, name, town, category")
        .eq("status", "active")
        .ilike("name", `%${value.trim()}%`)
        .limit(8);
      setResults(data ?? []);
      setOpen(true);
      setLoading(false);
    }, 250);
  }

  function selectResult(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/gewerbe/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      selectResult(results[highlighted].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center bg-surface-container-low border border-outline-variant/20 px-3 py-2 gap-2 focus-within:border-secondary/40 transition-colors">
        <span className={`material-symbols-outlined text-lg flex-shrink-0 transition-colors ${loading ? "text-secondary animate-pulse" : "text-on-surface-variant/40"}`}>
          search
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Unternehmen suchen…"
          className="bg-transparent outline-none text-sm text-primary placeholder:text-on-surface-variant/40 font-medium w-full"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setOpen(false); inputRef.current?.focus(); }}
            className="material-symbols-outlined text-on-surface-variant/50 hover:text-primary transition-colors text-lg flex-shrink-0"
          >
            close
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-outline-variant/20 shadow-lg z-50 max-h-72 overflow-y-auto">
          {results.map((biz, i) => (
            <button
              key={biz.slug}
              type="button"
              onMouseDown={() => selectResult(biz.slug)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${i === highlighted ? "bg-surface-container" : "hover:bg-surface-container-low"}`}
            >
              <span className="material-symbols-outlined text-on-surface-variant/40 text-base flex-shrink-0">storefront</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary truncate">{biz.name}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{biz.category} · {toDisplayTown(biz.town)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query && !loading && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-outline-variant/20 shadow-lg z-50 px-4 py-3">
          <p className="text-sm text-on-surface-variant">Keine Ergebnisse für „{query}"</p>
        </div>
      )}
    </div>
  );
}
