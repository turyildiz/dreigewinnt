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
    <div className="flex flex-col gap-8">
      <form action={action} className="flex flex-col gap-5">
        {/* Name */}
        <Field label="Name *">
          <input name="name" required defaultValue={defaultValues?.name ?? ""} className={inputClass} />
        </Field>

        {/* Town + Category */}
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

        {/* Tier + Status */}
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

        {/* Description */}
        <Field label="Kurzbeschreibung">
          <textarea name="description" rows={2} defaultValue={defaultValues?.description ?? ""} className={`${inputClass} resize-none`} />
        </Field>

        {/* Full description */}
        <Field label="Ausführliche Beschreibung">
          <textarea name="full_description" rows={4} defaultValue={defaultValues?.full_description ?? ""} className={`${inputClass} resize-none`} />
        </Field>

        {/* Address + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Adresse">
            <input name="address" defaultValue={defaultValues?.address ?? ""} className={inputClass} />
          </Field>
          <Field label="Telefon">
            <input name="phone" type="tel" defaultValue={defaultValues?.phone ?? ""} className={inputClass} />
          </Field>
        </div>

        {/* Email + Website */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="E-Mail">
            <input name="email" type="email" defaultValue={defaultValues?.email ?? ""} className={inputClass} />
          </Field>
          <Field label="Website">
            <input name="website" defaultValue={defaultValues?.website ?? ""} className={inputClass} placeholder="beispiel.de" />
          </Field>
        </div>

        {/* Hero image URL */}
        <Field label="Hero-Bild URL">
          <input name="hero_image_url" type="url" defaultValue={defaultValues?.hero_image_url ?? ""} className={inputClass} placeholder="https://…" />
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" className="signature-gradient text-on-secondary px-6 py-3 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
            Speichern
          </button>
          <Link href="/admin/gewerbe" className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low">
            Abbrechen
          </Link>
        </div>
      </form>

      {/* Delete */}
      {deleteAction && (
        <div className="border-t border-outline-variant/15 pt-6">
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-[11px] font-bold uppercase tracking-widest text-error/70 hover:text-error transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Eintrag löschen
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-sm text-on-surface-variant">Wirklich löschen?</p>
              <form action={deleteAction} className="flex gap-3">
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-white px-4 py-3 text-sm text-primary placeholder:text-outline/40 outline-none border border-outline-variant/25 focus:border-secondary/60 focus:bg-white transition-colors";
