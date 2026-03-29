"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const towns = [
  { value: "raunheim", label: "Raunheim" },
  { value: "kelsterbach", label: "Kelsterbach" },
  { value: "ruesselsheim", label: "Rüsselsheim" },
];

const statuses = [
  { value: "active", label: "Aktiv" },
  { value: "pending", label: "Ausstehend" },
  { value: "expired", label: "Abgelaufen" },
  { value: "rejected", label: "Abgelehnt" },
];

function toDatetimeLocal(ts?: string | null) {
  if (!ts) return "";
  return new Date(ts).toISOString().slice(0, 16);
}

type DefaultValues = Record<string, unknown>;

interface EventFormProps {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
}

export function EventForm({ action, deleteAction, defaultValues }: EventFormProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="flex flex-col gap-px">
      <form action={action}>
        {/* Stammdaten */}
        <Section label="Stammdaten">
          <Field label="Titel *">
            <input name="title" required defaultValue={defaultValues?.title as string ?? ""} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stadt *">
              <select name="town" required defaultValue={defaultValues?.town as string ?? ""} className={inputClass}>
                <option value="">Bitte wählen</option>
                {towns.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Kategorie">
              <input name="category" defaultValue={defaultValues?.category as string ?? ""} className={inputClass} placeholder="z. B. Musik, Kultur…" />
            </Field>
          </div>
        </Section>

        {/* Datum & Ort */}
        <Section label="Datum & Ort">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Beginn *">
              <input name="date_start" type="datetime-local" required defaultValue={toDatetimeLocal(defaultValues?.date_start as string)} className={inputClass} />
            </Field>
            <Field label="Ende">
              <input name="date_end" type="datetime-local" defaultValue={toDatetimeLocal(defaultValues?.date_end as string)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Veranstaltungsort">
              <input name="venue" defaultValue={defaultValues?.venue as string ?? ""} className={inputClass} />
            </Field>
            <Field label="Adresse">
              <input name="address" defaultValue={defaultValues?.address as string ?? ""} className={inputClass} />
            </Field>
          </div>
        </Section>

        {/* Inhalt */}
        <Section label="Inhalt">
          <Field label="Beschreibung">
            <textarea name="description" rows={5} defaultValue={defaultValues?.description as string ?? ""} className={`${inputClass} resize-none`} />
          </Field>
          <Field label="Bild">
            <ImageUploadField fileInputName="image_file" urlInputName="image_url" currentUrl={defaultValues?.image_url as string ?? null} />
          </Field>
        </Section>

        {/* Veranstalter */}
        <Section label="Veranstalter">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name">
              <input name="organiser_name" defaultValue={defaultValues?.organiser_name as string ?? ""} className={inputClass} />
            </Field>
            <Field label="E-Mail">
              <input name="organiser_email" type="email" defaultValue={defaultValues?.organiser_email as string ?? ""} className={inputClass} />
            </Field>
          </div>
        </Section>

        {/* Einstellungen */}
        <Section label="Einstellungen">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select name="status" defaultValue={defaultValues?.status as string ?? "active"} className={inputClass}>
                {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Optionen
              </label>
              <label className="flex items-center gap-3 h-[42px] cursor-pointer">
                <input
                  name="is_featured"
                  type="checkbox"
                  id="is_featured"
                  defaultChecked={defaultValues?.is_featured as boolean ?? false}
                  className="w-4 h-4 accent-secondary"
                />
                <span className="text-sm font-medium text-primary">Featured Boost</span>
              </label>
            </div>
          </div>
        </Section>

        {/* Actions */}
        <div className="bg-surface-container-lowest px-8 py-5 flex items-center gap-3 border-t border-outline-variant/10">
          <button type="submit" className="signature-gradient text-on-secondary px-6 py-2.5 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
            Speichern
          </button>
          <Link href="/admin/events" className="px-5 py-2.5 font-bold uppercase text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>

      {deleteAction && (
        <div className="bg-surface-container-lowest px-8 py-5 mt-6">
          {!showDelete ? (
            <button type="button" onClick={() => setShowDelete(true)} className="text-[11px] font-bold uppercase tracking-widest text-error/60 hover:text-error transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">delete</span>Veranstaltung löschen
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <p className="text-sm text-on-surface-variant">Wirklich löschen?</p>
              <form action={deleteAction} className="flex gap-4">
                <button type="submit" className="text-[11px] font-bold uppercase tracking-widest text-error hover:underline">Ja, löschen</button>
                <button type="button" onClick={() => setShowDelete(false)} className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary">Abbrechen</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest border-b border-outline-variant/10">
      <div className="px-8 pt-6 pb-1">
        <p className="text-[9px] font-black uppercase tracking-widest text-secondary/60">{label}</p>
      </div>
      <div className="px-8 pb-7 pt-4 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}

function ImageUploadField({ fileInputName, urlInputName, currentUrl }: { fileInputName: string; urlInputName: string; currentUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={urlInputName} value={preview && preview.startsWith("http") ? preview : ""} />
      <input ref={inputRef} type="file" name={fileInputName} accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
      {preview ? (
        <div className="relative w-full h-48 bg-surface-container-high overflow-hidden">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="absolute top-2 right-2 bg-primary/80 text-on-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-error transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">close</span>Entfernen
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-primary/80 text-on-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">upload</span>Ändern
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full h-36 border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 hover:border-secondary/40 hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Bild hochladen</span>
        </button>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-surface-container-low px-4 py-2.5 text-sm text-primary placeholder:text-outline/40 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";
