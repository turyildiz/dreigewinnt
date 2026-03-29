"use client";

import Link from "next/link";
import { useState } from "react";

const towns = [
  { value: "raunheim", label: "Raunheim" },
  { value: "kelsterbach", label: "Kelsterbach" },
  { value: "ruesselsheim", label: "Rüsselsheim" },
  { value: "region", label: "Gesamte Region" },
];

type DefaultValues = Record<string, unknown>;

interface ArticleFormProps {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
}

export function ArticleForm({ action, deleteAction, defaultValues }: ArticleFormProps) {
  const [showDelete, setShowDelete] = useState(false);
  const townValue = (defaultValues?.towns as string[])?.[0] ?? "";

  return (
    <div className="flex flex-col gap-8">
      <form action={action} className="flex flex-col gap-5">
        <Field label="Titel *">
          <input name="title" required defaultValue={defaultValues?.title as string ?? ""} className={inputClass} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Stadt *">
            <select name="town" required defaultValue={townValue} className={inputClass}>
              <option value="">Bitte wählen</option>
              {towns.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={defaultValues?.status as string ?? "draft"} className={inputClass}>
              <option value="draft">Entwurf</option>
              <option value="published">Veröffentlicht</option>
            </select>
          </Field>
        </div>

        <Field label="Zusammenfassung">
          <textarea name="excerpt" rows={2} defaultValue={defaultValues?.excerpt as string ?? ""} className={`${inputClass} resize-none`} />
        </Field>

        <Field label="Inhalt (Text)">
          <textarea name="body" rows={12} defaultValue={defaultValues?.body as string ?? ""} className={`${inputClass} resize-y font-mono text-xs`} placeholder="Vollständiger Artikeltext…" />
        </Field>

        <Field label="Hero-Bild URL">
          <input name="hero_image_url" type="url" defaultValue={defaultValues?.hero_image_url as string ?? ""} className={inputClass} placeholder="https://…" />
        </Field>

        <Field label="Meta-Titel (SEO)">
          <input name="meta_title" defaultValue={defaultValues?.meta_title as string ?? ""} className={inputClass} />
        </Field>

        <Field label="Meta-Beschreibung (SEO)">
          <textarea name="meta_description" rows={2} defaultValue={defaultValues?.meta_description as string ?? ""} className={`${inputClass} resize-none`} />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="signature-gradient text-on-secondary px-6 py-3 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
            Speichern
          </button>
          <Link href="/admin/articles" className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low">
            Abbrechen
          </Link>
        </div>
      </form>

      {deleteAction && (
        <div className="border-t border-outline-variant/15 pt-6">
          {!showDelete ? (
            <button type="button" onClick={() => setShowDelete(true)} className="text-[11px] font-bold uppercase tracking-widest text-error/70 hover:text-error transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">delete</span>Artikel löschen
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-sm text-on-surface-variant">Wirklich löschen?</p>
              <form action={deleteAction} className="flex gap-3">
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full bg-white px-4 py-3 text-sm text-primary placeholder:text-outline/40 outline-none border border-outline-variant/25 focus:border-secondary/60 focus:bg-white transition-colors";
