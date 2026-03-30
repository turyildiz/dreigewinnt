"use client";

import { useState, useEffect } from "react";

const towns = ["Raunheim", "Kelsterbach", "Rüsselsheim"];
const categories = [
  "Konzert & Musik", "Stadtfest", "Markt & Kulinarik", "Sport",
  "Kunst & Ausstellung", "Lesung", "Gewerbe", "Sonstiges",
];

export function EventSubmitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [featuredBoost, setFeaturedBoost] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(() => { setSubmitted(false); setFeaturedBoost(false); }, 300);
  }

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="editorial-gradient text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label="Event hinzufügen"
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-0.5">Veranstaltungen</p>
                <h2 className="text-xl font-headline font-black tracking-tighter text-primary">Event einreichen</h2>
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
                  Ihre Veranstaltung wird redaktionell geprüft und in Kürze freigeschaltet. Vielen Dank.
                </p>
                <button onClick={handleClose} className="mt-8 signature-gradient text-on-secondary px-8 py-3 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all">
                  Schließen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

                {/* Title */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Titel <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="z. B. Sommerfest im Stadtpark"
                    className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* Town + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                      Stadt <span className="text-error">*</span>
                    </label>
                    <select
                      required
                      className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary outline-none focus:ring-1 focus:ring-secondary/30 appearance-none"
                    >
                      <option value="">Bitte wählen</option>
                      {towns.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                      Kategorie <span className="text-error">*</span>
                    </label>
                    <select
                      required
                      className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary outline-none focus:ring-1 focus:ring-secondary/30 appearance-none"
                    >
                      <option value="">Bitte wählen</option>
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                      Datum <span className="text-error">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Uhrzeit</label>
                    <input
                      type="time"
                      className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors"
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                    Veranstaltungsort <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Name des Ortes, Adresse"
                    className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Beschreibung</label>
                  <textarea
                    rows={3}
                    placeholder="Worum geht es bei Ihrer Veranstaltung?"
                    className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors resize-none"
                  />
                </div>

                {/* Organiser */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                      Veranstalter <span className="text-error">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Name / Organisation"
                      className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                      E-Mail <span className="text-error">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="ihre@email.de"
                      className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors"
                    />
                  </div>
                </div>

                {/* Featured Boost upsell */}
                <button
                  type="button"
                  onClick={() => setFeaturedBoost(!featuredBoost)}
                  className={`flex items-center justify-between px-4 py-4 border text-left transition-all ${
                    featuredBoost
                      ? "border-tertiary bg-tertiary/5"
                      : "border-outline-variant/20 hover:border-outline-variant/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <div>
                      <p className="font-bold text-sm text-primary">Featured Boost hinzufügen</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Hervorgehobene Platzierung bis zum Veranstaltungsdatum</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className={`text-xs font-black ${featuredBoost ? "text-tertiary" : "text-on-surface-variant"}`}>
                      € 12,—
                    </span>
                    {featuredBoost && (
                      <span className="material-symbols-outlined text-tertiary text-sm block" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    )}
                  </div>
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  className="signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all mt-2"
                >
                  {featuredBoost ? "Einreichen + €12 Featured Boost" : "Kostenlos einreichen"}
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
