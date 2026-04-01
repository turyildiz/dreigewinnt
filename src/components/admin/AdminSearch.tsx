"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface AdminSearchProps {
  placeholder?: string;
  paramName?: string;
}

export function AdminSearch({ placeholder = "Suchen…", paramName = "q" }: AdminSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-3 mb-4">
      <span className="material-symbols-outlined text-outline text-xl flex-shrink-0">search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="flex-1 bg-transparent text-sm text-primary placeholder:text-outline/50 outline-none font-medium"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="material-symbols-outlined text-outline hover:text-primary transition-colors text-xl"
        >
          close
        </button>
      )}
    </div>
  );
}
