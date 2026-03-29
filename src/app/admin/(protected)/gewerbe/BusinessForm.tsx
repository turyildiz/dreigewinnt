"use client";

import Link from "next/link";
import { useState } from "react";

const towns = [
  { value: "raunheim", label: "Raunheim" },
  { value: "kelsterbach", label: "Kelsterbach" },
  { value: "ruesselsheim", label: "Rüsselsheim" },
];

const categories = [
  "Gastronomie", "Handwerk", "Einzelhandel", "Gesundheit & Beauty",
  "Dienstleistungen", "Sport & Freizeit", "Kultur & Bildung", "Sonstiges",
];

const tiers = [
  { value: "free", label: "Basis" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

const statuses = [
  { value: "active", label: "Aktiv" },
  { value: "pending", label: "Ausstehend" },
  { value: "rejected", label: "Abgelehnt" },
  { value: "suspended", label: "Gesperrt" },
];

type DefaultValues = {
  name?: string;
  category?: string;
  town?: string;
  tier?: string;
  status?: string;
  description?: string | null;
  full_description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  hero_image_url?: string | null;
};

interface BusinessFormProps {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  defaultValues?: DefaultValues;
}

export function BusinessForm({ action, deleteAction, defaultValues }: BusinessFormProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="flex flex-col gap-px">
      <form action={action}>
        {/* Stammdaten */}
        <Section label="Stammdaten">
          <Field label="Name *">
            <input name="name" required defaultValue={defaultValues?.name ?? ""} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stadt *">
              <select name="town" required defaultValue={defaultValues?.town ?? ""} className={inputClass}>
                <option value="">Bitte wählen</option>
                {towns.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Kategorie *">
              <select name="category" required defaultValue={defaultValues?.category ?? ""} className={inputClass}>
                <option value="">Bitte wählen</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* Beschreibung */}
        <Section label="Beschreibung">
          <Field label="Kurzbeschreibung">
            <textarea name="description" rows={2} defaultValue={defaultValues?.description ?? ""} className={`${inputClass} resize-none`} />
          </Field>
          <Field label="Ausführliche Beschreibung">
            <textarea name="full_description" rows={5} defaultValue={defaultValues?.full_description ?? ""} className={`${inputClass} resize-none`} />
          </Field>
        </Section>

        {/* Kontakt */}
        <Section label="Kontakt">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Adresse">
              <input name="address" defaultValue={defaultValues?.address ?? ""} className={inputClass} />
            </Field>
            <Field label="Telefon">
              <input name="phone" type="tel" defaultValue={defaultValues?.phone ?? ""} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="E-Mail">
              <input name="email" type="email" defaultValue={defaultValues?.email ?? ""} className={inputClass} />
            </Field>
            <Field label="Website">
              <input name="website" defaultValue={defaultValues?.website ?? ""} className={inputClass} placeholder="beispiel.de" />
            </Field>
          </div>
        </Section>

        {/* Einstellungen */}
        <Section label="Einstellungen">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Paket">
              <select name="tier" defaultValue={defaultValues?.tier ?? "free"} className={inputClass}>
                {tiers.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select name="status" defaultValue={defaultValues?.status ?? "active"} className={inputClass}>
                {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Hero-Bild URL">
            <input name="hero_image_url" type="url" defaultValue={defaultValues?.hero_image_url ?? ""} className={inputClass} placeholder="https://…" />
          </Field>
        </Section>

        {/* Actions */}
        <div className="bg-surface-container-lowest px-8 py-5 flex items-center gap-3 border-t border-outline-variant/10">
          <button type="submit" className="signature-gradient text-on-secondary px-6 py-2.5 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
            Speichern
          </button>
          <Link href="/admin/gewerbe" className="px-5 py-2.5 font-bold uppercase text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors">
            Abbrechen
          </Link>
        </div>
      </form>

      {/* Delete zone */}
      {deleteAction && (
        <div className="bg-surface-container-lowest px-8 py-5 mt-6">
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-[11px] font-bold uppercase tracking-widest text-error/60 hover:text-error transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Eintrag löschen
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <p className="text-sm text-on-surface-variant">Wirklich löschen?</p>
              <form action={deleteAction} className="flex gap-4">
                <button type="submit" className="text-[11px] font-bold uppercase tracking-widest text-error hover:underline">
                  Ja, löschen
                </button>
                <button type="button" onClick={() => setShowDeleteConfirm(false)} className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary">
                  Abbrechen
                </button>
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
