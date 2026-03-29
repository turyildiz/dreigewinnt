"use client";

import Link from "next/link";
import { useState } from "react";

const towns = [
  { value: "raunheim", label: "Raunheim" },
  { value: "kelsterbach", label: "Kelsterbach" },
  { value: "ruesselsheim", label: "Rüsselsheim" },
];

const jobTypes = [
  { value: "vollzeit", label: "Vollzeit" },
  { value: "teilzeit", label: "Teilzeit" },
  { value: "minijob", label: "Minijob" },
  { value: "ausbildung", label: "Ausbildung" },
  { value: "praktikum", label: "Praktikum" },
  { value: "freelance", label: "Freelance" },
];

const statuses = [
  { value: "active", label: "Aktiv" },
  { value: "pending", label: "Ausstehend" },
  { value: "expired", label: "Abgelaufen" },
  { value: "rejected", label: "Abgelehnt" },
];

type DefaultValues = Record<string, unknown>;

interface JobFormProps {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
}

export function JobForm({ action, deleteAction, defaultValues }: JobFormProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="flex flex-col gap-px">
      <form action={action}>
        {/* Stammdaten */}
        <Section label="Stammdaten">
          <Field label="Stellentitel *">
            <input name="title" required defaultValue={defaultValues?.title as string ?? ""} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Unternehmen *">
              <input name="company_name" required defaultValue={defaultValues?.company_name as string ?? ""} className={inputClass} />
            </Field>
            <Field label="Stadt *">
              <select name="town" required defaultValue={defaultValues?.town as string ?? ""} className={inputClass}>
                <option value="">Bitte wählen</option>
                {towns.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Anstellungsart *">
              <select name="job_type" required defaultValue={defaultValues?.job_type as string ?? ""} className={inputClass}>
                <option value="">Bitte wählen</option>
                {jobTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Kategorie">
              <input name="category" defaultValue={defaultValues?.category as string ?? ""} className={inputClass} placeholder="z. B. IT, Handwerk…" />
            </Field>
          </div>
        </Section>

        {/* Inhalt */}
        <Section label="Inhalt">
          <Field label="Beschreibung">
            <textarea name="description" rows={7} defaultValue={defaultValues?.description as string ?? ""} className={`${inputClass} resize-none`} />
          </Field>
          <Field label="Gehaltsspanne">
            <input name="salary_range" defaultValue={defaultValues?.salary_range as string ?? ""} className={inputClass} placeholder="z. B. 35.000 – 45.000 €" />
          </Field>
        </Section>

        {/* Kontakt */}
        <Section label="Kontakt">
          <div className="grid grid-cols-2 gap-4">
            <Field label="E-Mail">
              <input name="contact_email" type="email" defaultValue={defaultValues?.contact_email as string ?? ""} className={inputClass} />
            </Field>
            <Field label="Telefon">
              <input name="contact_phone" type="tel" defaultValue={defaultValues?.contact_phone as string ?? ""} className={inputClass} />
            </Field>
          </div>
          <Field label="Website / Bewerbungslink">
            <input name="website_url" type="url" defaultValue={defaultValues?.website_url as string ?? ""} className={inputClass} placeholder="https://…" />
          </Field>
        </Section>

        {/* Einstellungen */}
        <Section label="Einstellungen">
          <Field label="Status">
            <select name="status" defaultValue={defaultValues?.status as string ?? "active"} className={`${inputClass} max-w-xs`}>
              {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </Section>

        {/* Actions */}
        <div className="bg-surface-container-lowest px-8 py-5 flex items-center gap-3 border-t border-outline-variant/10">
          <button type="submit" className="signature-gradient text-on-secondary px-6 py-2.5 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
            Speichern
          </button>
          <Link href="/admin/jobs" className="px-5 py-2.5 font-bold uppercase text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>

      {deleteAction && (
        <div className="bg-surface-container-lowest px-8 py-5 mt-6">
          {!showDelete ? (
            <button type="button" onClick={() => setShowDelete(true)} className="text-[11px] font-bold uppercase tracking-widest text-error/60 hover:text-error transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">delete</span>Stelle löschen
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
