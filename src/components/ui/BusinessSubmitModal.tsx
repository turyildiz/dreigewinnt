"use client";

import { useState, useEffect, useTransition } from "react";
import { submitBusinessAction } from "@/app/(directory)/gewerbe/einreichen/actions";

const towns = ["Raunheim", "Kelsterbach", "Rüsselsheim"];
const categories = [
  "Gastronomie", "Handwerk", "Einzelhandel", "Gesundheit & Beauty",
  "Dienstleistungen", "Sport & Freizeit", "Kultur & Bildung", "Sonstiges",
];
const tiers = [
  { id: "free", label: "Basis", price: "Kostenlos", features: "Name, Kategorie, Ort, Telefon, Website" },
  { id: "standard", label: "Standard", price: "€9,99 / Monat", features: "+ Beschreibung, Öffnungszeiten, 5 Fotos" },
  { id: "premium", label: "Premium", price: "€29,99 / Monat", features: "+ Featured Placement, Telegram Bot Beta" },
];

export function BusinessSubmitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("free");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await submitBusinessAction(formData);
      setSubmitted(true);
    });
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(() => setSubmitted(false), 300);
  }

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="editorial-gradient text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Unternehmen einreichen"
        >
          <span className="material-symbols-outlined text-xl lg:text-3xl">add</span>
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Modal */}
          <div
            className="bg-surface w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/15 sticky top-0 bg-surface z-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-0.5">Gewerbeverzeichnis</p>
                <h2 className="text-xl font-headline font-black tracking-tighter text-primary">Unternehmen einreichen</h2>
              </div>
              <button onClick={handleClose} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1">
                close
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div className="px-6 py-12 text-center">
                <span className="material-symbols-outlined text-secondary text-5xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <h3 className="text-xl font-black text-primary mb-2">Eingegangen!</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto">
                  Ihr Eintrag wird redaktionell geprüft und in Kürze freigeschaltet. Vielen Dank.
                </p>
                <button onClick={handleClose} className="mt-8 signature-gradient text-on-secondary px-8 py-3 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all">
                  Schließen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

                {/* Tier selector */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">
                    Paket wählen
                  </label>
                  <div className="flex flex-col gap-2">
                    {tiers.map((tier) => (
                      <label
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`flex items-center justify-between px-4 py-3 border cursor-pointer transition-all ${
                          selectedTier === tier.id
                            ? "border-secondary bg-secondary/5"
                            : "border-outline-variant/20 hover:border-outline-variant/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="radio" name="tier" value={tier.id} checked={selectedTier === tier.id} onChange={() => setSelectedTier(tier.id)} className="accent-secondary" />
                          <div>
                            <span className="font-bold text-sm text-primary">{tier.label}</span>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{tier.features}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-black flex-shrink-0 ml-4 ${selectedTier === tier.id ? "text-secondary" : "text-on-surface-variant"}`}>
                          {tier.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-outline-variant/15" />

                {/* Name */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Unternehmensname <span className="text-error">*</span>
                  </label>
                  <input name="name" required type="text" placeholder="z. B. Bäckerei Müller" className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors" />
                </div>

                {/* Town + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Stadt <span className="text-error">*</span></label>
                    <select name="town" required className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary outline-none focus:ring-1 focus:ring-secondary/30 appearance-none">
                      <option value="">Bitte wählen</option>
                      {towns.map((t) => <option key={t} value={t.toLowerCase().replace("ü", "ue")}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Kategorie <span className="text-error">*</span></label>
                    <select name="category" required className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary outline-none focus:ring-1 focus:ring-secondary/30 appearance-none">
                      <option value="">Bitte wählen</option>
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Phone + Website */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Telefon</label>
                    <input name="phone" type="tel" placeholder="+49 6142 …" className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Website</label>
                    <input name="website" type="url" placeholder="https://beispiel.de" className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors" />
                  </div>
                </div>

                {/* Description — Standard+ only */}
                {selectedTier !== "free" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Beschreibung</label>
                    <textarea name="description" rows={3} placeholder="Kurze Beschreibung Ihres Unternehmens…" className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors resize-none" />
                  </div>
                )}

                {/* Contact email */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Ihre E-Mail <span className="text-error">*</span></label>
                  <input name="contact_email" required type="email" placeholder="ihre@email.de" className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors" />
                </div>

                {/* Submit */}
                <button type="submit" disabled={isPending} className="signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all mt-2 disabled:opacity-60">
                  {isPending ? "Wird eingereicht…" : "Kostenlos einreichen"}
                </button>

                <p className="text-[10px] text-on-surface-variant text-center">
                  Alle Einträge werden redaktionell geprüft. <span className="font-bold">Kein Spam.</span>
                </p>

              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
