"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitClubAction } from "./actions";
import { SPORT_CATEGORIES } from "@/lib/constants";

function CustomSelect({
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

const towns = [
  { value: "raunheim", label: "Raunheim" },
  { value: "kelsterbach", label: "Kelsterbach" },
  { value: "ruesselsheim", label: "Rüsselsheim" },
];

const sports = SPORT_CATEGORIES;

const inputClass =
  "w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";

type FormState = {
  name: string;
  town: string;
  sport: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  contact_email: string;
};

export function EinreichenForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "", town: "", sport: "", address: "",
    phone: "", website: "", description: "", contact_email: "",
  });

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      const result = await submitClubAction(fd);
      if (result.success) {
        router.push("/sport/einreichen?success=1");
      } else {
        setError(result.error);
      }
    });
  }

  const step1Valid = form.name.trim() && form.town && form.sport;
  const step2Valid = form.contact_email.trim();

  const progress = (step / 2) * 100;
  const stepLabel = step === 1 ? "Vereinsdetails" : "Kontakt & Absenden";

  return (
    <div className="flex flex-col gap-8">

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          <span>Schritt {step} von 2</span>
          <span>{stepLabel}</span>
        </div>
        <div className="h-1 bg-surface-container-low">
          <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── STEP 1: Details ── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Ihr Verein</h2>
            <p className="text-sm text-on-surface-variant">Grundlegende Informationen zu Ihrem Sportverein.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Vereinsname *</label>
            <input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)}
              placeholder="z. B. TuS Raunheim 1862 e.V." className={inputClass} autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stadt *</label>
              <CustomSelect
                value={form.town}
                onChange={(v) => setField("town", v)}
                options={towns}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sportart *</label>
              <CustomSelect
                value={form.sport}
                onChange={(v) => setField("sport", v)}
                options={sports}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Adresse</label>
            <input type="text" value={form.address} onChange={(e) => setField("address", e.target.value)}
              placeholder="Sportplatzweg 1, 65479 Raunheim" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Telefon</label>
              <input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)}
                placeholder="+49 6142 …" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Website</label>
              <input type="url" value={form.website} onChange={(e) => setField("website", e.target.value)}
                placeholder="https://beispiel.de" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kurzbeschreibung</label>
            <textarea value={form.description} onChange={(e) => setField("description", e.target.value)}
              rows={3} placeholder="Was macht Ihren Verein besonders?"
              className={`${inputClass} resize-none`} />
          </div>

          <button type="button" onClick={() => setStep(2)} disabled={!step1Valid}
            className="signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-40 mt-2">
            Weiter
          </button>
        </div>
      )}

      {/* ── STEP 2: Kontakt & Absenden ── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Kontakt & Absenden</h2>
            <p className="text-sm text-on-surface-variant">Fast geschafft!</p>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-low p-4 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Zusammenfassung</p>
            {[
              ["Verein", form.name],
              ["Stadt", towns.find((t) => t.value === form.town)?.label ?? ""],
              ["Sportart", sports.find((s) => s.value === form.sport)?.label ?? ""],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-on-surface-variant">{label}</span>
                <span className="font-bold text-primary">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ihre E-Mail-Adresse *</label>
            <input type="email" value={form.contact_email} onChange={(e) => setField("contact_email", e.target.value)}
              placeholder="ihre@email.de" className={inputClass} autoFocus />
            <p className="text-[10px] text-on-surface-variant/60">Wird nicht veröffentlicht. Nur für Rückfragen und Aktivierungsbenachrichtigung.</p>
          </div>

          {error && <p className="text-sm text-error bg-error/5 px-4 py-3">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-shrink-0 px-6 py-4 border border-outline-variant/30 text-on-surface-variant font-bold uppercase text-xs tracking-widest hover:bg-surface-container-low transition-colors">
              Zurück
            </button>
            <button type="button" onClick={handleSubmit} disabled={!step2Valid || isPending}
              className="flex-1 signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Wird gesendet…
                </>
              ) : (
                "Verein einreichen"
              )}
            </button>
          </div>

          <p className="text-[10px] text-on-surface-variant text-center">
            Alle Einträge werden redaktionell geprüft. <strong>Kostenlos.</strong>
          </p>
        </div>
      )}
    </div>
  );
}
