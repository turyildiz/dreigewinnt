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
    <div className="flex flex-col gap-px">
      <form action={action}>
        {/* Stammdaten */}
        <Section label="Stammdaten">
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
        </Section>

        {/* Inhalt */}
        <Section label="Inhalt">
          <Field label="Zusammenfassung">
            <textarea name="excerpt" rows={2} defaultValue={defaultValues?.excerpt as string ?? ""} className={`${inputClass} resize-none`} />
          </Field>
          <Field label="Artikeltext">
            <textarea name="body" rows={14} defaultValue={defaultValues?.body as string ?? ""} className={`${inputClass} resize-y font-mono text-xs`} placeholder="Vollständiger Artikeltext…" />
          </Field>
          <Field label="Hero-Bild URL">
            <input name="hero_image_url" type="url" defaultValue={defaultValues?.hero_image_url as string ?? ""} className={inputClass} placeholder="https://…" />
          </Field>
        </Section>

        {/* SEO */}
        <Section label="SEO">
          <Field label="Meta-Titel">
            <input name="meta_title" defaultValue={defaultValues?.meta_title as string ?? ""} className={inputClass} />
          </Field>
          <Field label="Meta-Beschreibung">
            <textarea name="meta_description" rows={2} defaultValue={defaultValues?.meta_description as string ?? ""} className={`${inputClass} resize-none`} />
          </Field>
        </Section>

        {/* Actions */}
        <div className="bg-surface-container-lowest px-8 py-5 flex items-center gap-3 border-t border-outline-variant/10">
          <button type="submit" className="signature-gradient text-on-secondary px-6 py-2.5 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
            Speichern
          </button>
          <Link href="/admin/articles" className="px-5 py-2.5 font-bold uppercase text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>

      {deleteAction && (
        <div className="bg-surface-container-lowest px-8 py-5 mt-6">
          {!showDelete ? (
            <button type="button" onClick={() => setShowDelete(true)} className="text-[11px] font-bold uppercase tracking-widest text-error/60 hover:text-error transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">delete</span>Artikel löschen
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

const inputClass =
  "w-full bg-surface-container-low px-4 py-2.5 text-sm text-primary placeholder:text-outline/40 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";
