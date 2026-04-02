"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitEventAction } from "./actions";

const towns = [
  { value: "raunheim", label: "Raunheim" },
  { value: "kelsterbach", label: "Kelsterbach" },
  { value: "ruesselsheim", label: "Rüsselsheim" },
];

const categories = [
  "Konzert & Musik", "Sport & Fitness", "Kunst & Kultur",
  "Märkte & Festivals", "Kinder & Familie", "Vortrag & Workshop",
  "Gastronomie", "Sonstiges",
];

const inputClass =
  "w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";

const TOTAL_STEPS = 3;
const stepLabels = ["Veranstaltung", "Bild & Beschreibung", "Kontakt & Absenden"];

type FormState = {
  title: string;
  town: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  organiser_name: string;
  organiser_email: string;
  featured_boost: boolean;
};

export function EventEinreichenForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    town: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    organiser_name: "",
    organiser_email: "",
    featured_boost: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)); }
  function prevStep() { setStep((s) => Math.max(s - 1, 1)); }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append("image", imageFile);

      const result = await submitEventAction(fd);
      if (result.success) {
        router.push("/events/einreichen?success=1");
      } else {
        setError(result.error);
      }
    });
  }

  const step1Valid = form.title.trim().length > 0 && form.town && form.category && form.date;
  const step3Valid = form.organiser_name.trim().length > 0 && form.organiser_email.trim().length > 0;
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="flex flex-col gap-8">

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
          <span>Schritt {step} von {TOTAL_STEPS}</span>
          <span>{stepLabels[step - 1]}</span>
        </div>
        <div className="h-1 bg-surface-container-low">
          <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── STEP 1: Event details ─────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Veranstaltung</h2>
            <p className="text-sm text-on-surface-variant">Eckdaten Ihrer Veranstaltung.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Titel *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="z. B. Raunheimer Sommerfest 2026"
              className={inputClass}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stadt *</label>
              <select value={form.town} onChange={(e) => set("town", e.target.value)} className={inputClass}>
                <option value="">Bitte wählen</option>
                {towns.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kategorie *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
                <option value="">Bitte wählen</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Datum *</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Uhrzeit</label>
              <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Veranstaltungsort</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="Name & Adresse des Veranstaltungsortes"
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={nextStep}
            disabled={!step1Valid}
            className="signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-40 mt-2"
          >
            Weiter
          </button>
        </div>
      )}

      {/* ── STEP 2: Image & Description ───────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Bild & Beschreibung</h2>
            <p className="text-sm text-on-surface-variant">Optional, aber empfohlen für mehr Aufmerksamkeit.</p>
          </div>

          {/* Image */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">Veranstaltungsbild</label>
            {imagePreview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Vorschau" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-surface/90 backdrop-blur text-primary p-1.5 hover:bg-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 hover:border-outline-variant/60 hover:bg-surface-container-low transition-all"
              >
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">Bild auswählen</span>
                <span className="text-[10px] text-on-surface-variant/40">JPG, PNG, WebP · max. 5 MB</span>
              </button>
            )}
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Beschreibung</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              placeholder="Was erwartet die Besucher?"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Featured boost */}
          <label className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${
            form.featured_boost ? "border-tertiary bg-tertiary/5" : "border-outline-variant/20 hover:border-outline-variant/50"
          }`}>
            <input
              type="checkbox"
              checked={form.featured_boost}
              onChange={(e) => set("featured_boost", e.target.checked)}
              className="mt-0.5 accent-secondary"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-sm text-primary">Featured Boost</span>
                <span className="text-[10px] font-black text-tertiary uppercase tracking-widest bg-tertiary/10 px-2 py-0.5">+€12</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Hervorgehobene Platzierung im Veranstaltungskalender für 7 Tage.</p>
            </div>
          </label>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={prevStep} className="flex-shrink-0 px-6 py-4 border border-outline-variant/30 text-on-surface-variant font-bold uppercase text-xs tracking-widest hover:bg-surface-container-low transition-colors">
              Zurück
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Contact & Submit ──────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-headline font-black text-primary mb-1">Kontakt & Absenden</h2>
            <p className="text-sm text-on-surface-variant">Wer ist der Veranstalter?</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Name des Veranstalters *</label>
            <input
              type="text"
              value={form.organiser_name}
              onChange={(e) => set("organiser_name", e.target.value)}
              placeholder="Verein, Organisation oder Ihr Name"
              className={inputClass}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">E-Mail *</label>
            <input
              type="email"
              value={form.organiser_email}
              onChange={(e) => set("organiser_email", e.target.value)}
              placeholder="ihre@email.de"
              className={inputClass}
            />
            <p className="text-[10px] text-on-surface-variant/60">Wird nicht veröffentlicht. Nur für Rückfragen.</p>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-low p-4 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Zusammenfassung</p>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Titel</span>
              <span className="font-bold text-primary">{form.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Datum</span>
              <span className="font-bold text-primary">
                {form.date ? new Date(form.date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                {form.time ? `, ${form.time} Uhr` : ""}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Stadt</span>
              <span className="font-bold text-primary">{towns.find((t) => t.value === form.town)?.label}</span>
            </div>
            {imageFile && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Bild</span>
                <span className="font-bold text-secondary">✓ hochgeladen</span>
              </div>
            )}
            {form.featured_boost && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Featured Boost</span>
                <span className="font-bold text-tertiary">+€12</span>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-error bg-error/5 px-4 py-3">{error}</p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={prevStep} className="flex-shrink-0 px-6 py-4 border border-outline-variant/30 text-on-surface-variant font-bold uppercase text-xs tracking-widest hover:bg-surface-container-low transition-colors">
              Zurück
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!step3Valid || isPending}
              className="flex-1 signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Wird gesendet…
                </>
              ) : (
                form.featured_boost ? "Kostenpflichtig einreichen (+€12)" : "Kostenlos einreichen"
              )}
            </button>
          </div>

          <p className="text-[10px] text-on-surface-variant text-center">
            Alle Veranstaltungen werden redaktionell geprüft. <strong>Kein Spam.</strong>
          </p>
        </div>
      )}
    </div>
  );
}
