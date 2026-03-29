"use client";

import Link from "next/link";
import { useState } from "react";

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

// Convert timestamptz to datetime-local value
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
    <div className="flex flex-col gap-8">
      <form action={action} className="flex flex-col gap-5">
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

        <Field label="Beschreibung">
          <textarea name="description" rows={4} defaultValue={defaultValues?.description as string ?? ""} className={`${inputClass} resize-none`} />
        </Field>

        <Field label="Bild URL">
          <input name="image_url" type="url" defaultValue={defaultValues?.image_url as string ?? ""} className={inputClass} placeholder="https://…" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Veranstalter Name">
            <input name="organiser_name" defaultValue={defaultValues?.organiser_name as string ?? ""} className={inputClass} />
          </Field>
          <Field label="Veranstalter E-Mail">
            <input name="organiser_email" type="email" defaultValue={defaultValues?.organiser_email as string ?? ""} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select name="status" defaultValue={defaultValues?.status as string ?? "active"} className={inputClass}>
              {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <div className="flex items-center gap-3 pt-7">
            <input
              name="is_featured"
              type="checkbox"
              id="is_featured"
              defaultChecked={defaultValues?.is_featured as boolean ?? false}
              className="w-4 h-4 accent-secondary"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-primary">
              Featured Boost
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="signature-gradient text-on-secondary px-6 py-3 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
            Speichern
          </button>
          <Link href="/admin/events" className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low">
            Abbrechen
          </Link>
        </div>
      </form>

      {deleteAction && (
        <div className="border-t border-outline-variant/15 pt-6">
          {!showDelete ? (
            <button type="button" onClick={() => setShowDelete(true)} className="text-[11px] font-bold uppercase tracking-widest text-error/70 hover:text-error transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">delete</span>Veranstaltung löschen
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
