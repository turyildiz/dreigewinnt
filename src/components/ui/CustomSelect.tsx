"use client";

import { useRef, useState, useEffect } from "react";

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Bitte wählen",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center px-4 py-3 bg-surface-container-low gap-3 hover:bg-surface-container transition-colors"
      >
        <span className="text-primary font-bold uppercase text-[10px] tracking-widest flex-1 text-left">
          {selected?.label ?? <span className="text-outline/50 normal-case font-normal text-sm tracking-normal">{placeholder}</span>}
        </span>
        <span className={`material-symbols-outlined text-outline text-sm flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-surface border border-outline-variant/20 shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
          {options.map((o) => {
            const isSelected = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-left font-bold uppercase text-[10px] tracking-widest transition-colors ${
                  isSelected
                    ? "bg-secondary text-on-secondary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-sm flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
                <span className={isSelected ? "" : "ml-[28px]"}>{o.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
