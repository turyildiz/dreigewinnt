"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitBusinessAction } from "./actions";
import { BUSINESS_CATEGORIES } from "@/lib/constants";

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

const categories = BUSINESS_CATEGORIES;

const inputClass =
  "w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";

type FormState = {
  name: string;
  town: string;
  category: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  contact_email: string;
  tier: string;
};

type InitialValues = Partial<Pick<FormState, "name" | "town" | "category" | "address">>;

export function EinreichenForm({ initialValues, isUpgrade = false, existingId }: { initialValues?: InitialValues; isUpgrade?: boolean; existingId?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const initTown = towns.some((t) => t.value === initialValues?.town) ? (initialValues?.town ?? "") : "";
  const initCategory = categories.some((c) => c.value === initialValues?.category) ? (initialValues?.category ?? "") : "";

  const [form, setForm] = useState<FormState>({
    name: initialValues?.name ?? "",
    town: initTown,
    category: initCategory,
    address: initialValues?.address ?? "",
    phone: "", website: "", description: "",
    contact_email: "", tier: "standard",
  });

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 3;

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleHeroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  }

  function removeHero() {
    setHeroFile(null);
    setHeroPreview(null);
    if (heroInputRef.current) heroInputRef.current.value = "";
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const toAdd = files.slice(0, 5 - galleryFiles.length);
    setGalleryFiles((p) => [...p, ...toAdd]);
    setGalleryPreviews((p) => [...p, ...toAdd.map((f) => URL.createObjectURL(f))]);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  function removeGallery(i: number) {
    setGalleryFiles((p) => p.filter((_, idx) => idx !== i));
    setGalleryPreviews((p) => p.filter((_, idx) => idx !== i));
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (existingId) fd.append("existing_id", existingId);
      if (heroFile) fd.append("hero_image", heroFile);
      galleryFiles.forEach((f) => fd.append("gallery_images", f));

      const result = await submitBusinessAction(fd);
      if (result.success) {
        router.push("/gewerbe/einreichen?success=1");
      } else {
        setError(result.error);
      }
    });
  }

  const step1Valid = form.name.trim() && form.town && form.category;
  const step3Valid = form.contact_email.trim();

  const progress = (step / totalSteps) * 100;

  const stepLabel = step === 1 ? "Unternehmen"
    : step === 2 ? "Fotos"
    : "Kontakt & Absenden";

  return (
    <div className="flex flex-col gap-8">

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          <span>Schritt {step} von {totalSteps}</span>
          <span>{stepLabel}</span>
        </div>
        <div className="h-1 bg-surface-container-low">
          <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── STEP 1: Details ───────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Ihr Unternehmen</h2>
            <p className="text-sm text-on-surface-variant">Grundlegende Informationen zu Ihrem Betrieb.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Unternehmensname *</label>
            <input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)}
              placeholder="z. B. Bäckerei Müller" className={inputClass} autoFocus />
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kategorie *</label>
              <CustomSelect
                value={form.category}
                onChange={(v) => setField("category", v)}
                options={categories}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Adresse</label>
            <input type="text" value={form.address} onChange={(e) => setField("address", e.target.value)}
              placeholder="Musterstraße 1, 65479 Raunheim" className={inputClass} />
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
              rows={3} placeholder="Was macht Ihr Unternehmen besonders?"
              className={`${inputClass} resize-none`} />
          </div>

          <button type="button" onClick={() => setStep(2)} disabled={!step1Valid}
            className="cursor-pointer signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-default mt-2">
            Weiter
          </button>
        </div>
      )}

      {/* ── STEP 2: Fotos ─────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Fotos hochladen</h2>
            <p className="text-sm text-on-surface-variant">
              Titelbild + bis zu 5 Galeriefotos (optional)
            </p>
          </div>

          {/* Hero */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">Titelbild</label>
            {heroPreview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroPreview} alt="Vorschau" className="w-full h-48 object-cover" />
                <button type="button" onClick={removeHero}
                  className="cursor-pointer absolute top-2 right-2 bg-surface/90 backdrop-blur text-primary p-1.5 hover:bg-surface transition-colors">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => heroInputRef.current?.click()}
                className="cursor-pointer w-full h-40 border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 hover:border-outline-variant/60 hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Titelbild auswählen</span>
                <span className="text-[10px] text-on-surface-variant/40">JPG, PNG, WebP · max. 5 MB</span>
              </button>
            )}
            <input ref={heroInputRef} type="file" accept="image/*" onChange={handleHeroChange} className="hidden" />
          </div>

          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Galerie <span className="text-on-surface-variant/50">({galleryFiles.length}/5)</span>
              </label>
              {galleryFiles.length < 5 && (
                <button type="button" onClick={() => galleryInputRef.current?.click()}
                  className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                  + Foto hinzufügen
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {galleryPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Galerie ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGallery(i)}
                    className="cursor-pointer absolute top-1 right-1 bg-surface/90 p-1 hover:bg-surface transition-colors">
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </div>
              ))}
              {galleryFiles.length < 5 && (
                <button type="button" onClick={() => galleryInputRef.current?.click()}
                  className="cursor-pointer aspect-square border-2 border-dashed border-outline-variant/30 flex items-center justify-center hover:border-outline-variant/60 hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined text-on-surface-variant/40">add</span>
                </button>
              )}
            </div>
            <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setStep(1)}
              className="cursor-pointer flex-shrink-0 px-6 py-4 border border-outline-variant/30 text-on-surface-variant font-bold uppercase text-xs tracking-widest hover:bg-surface-container-low transition-colors">
              Zurück
            </button>
            <button type="button" onClick={() => setStep(3)}
              className="cursor-pointer flex-1 signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Kontakt & Absenden ────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Kontakt & Absenden</h2>
            <p className="text-sm text-on-surface-variant">Fast geschafft!</p>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-low p-4 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Zusammenfassung</p>
            {[
              ["Unternehmen", form.name],
              ["Stadt", towns.find((t) => t.value === form.town)?.label ?? ""],
              ["Kategorie", categories.find((c) => c.value === form.category)?.label ?? ""],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-on-surface-variant">{label}</span>
                <span className="font-bold text-primary">{value}</span>
              </div>
            ))}
            {heroFile && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Titelbild</span>
                <span className="font-bold text-secondary">✓</span>
              </div>
            )}
            {galleryFiles.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Galeriefotos</span>
                <span className="font-bold text-secondary">{galleryFiles.length}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ihre E-Mail-Adresse *</label>
            <input type="email" value={form.contact_email} onChange={(e) => setField("contact_email", e.target.value)}
              placeholder="ihre@email.de" className={inputClass} autoFocus />
            <p className="text-[10px] text-on-surface-variant/60">Wird nicht veröffentlicht. Nur für Rückfragen und Aktivierungsbenachrichtigung.</p>
          </div>

          {error && <p className="text-sm text-error bg-error/5 px-4 py-3">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="cursor-pointer flex-shrink-0 px-6 py-4 border border-outline-variant/30 text-on-surface-variant font-bold uppercase text-xs tracking-widest hover:bg-surface-container-low transition-colors">
              Zurück
            </button>
            <button type="button" onClick={handleSubmit} disabled={!step3Valid || isPending}
              className="cursor-pointer flex-1 signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-default flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Wird gesendet…
                </>
              ) : (
                "Kostenlos einreichen"
              )}
            </button>
          </div>

          <p className="text-[10px] text-on-surface-variant text-center">
            Alle Einträge werden redaktionell geprüft. <strong>Kein Spam.</strong>
          </p>
        </div>
      )}
    </div>
  );
}
