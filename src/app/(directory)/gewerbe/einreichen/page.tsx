import { redirect } from "next/navigation";
import { submitBusinessAction } from "./actions";
import Link from "next/link";

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

async function action(formData: FormData) {
  "use server";
  await submitBusinessAction(formData);
  redirect("/gewerbe/einreichen?success=1");
}

export default async function EinreichenPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  const inputClass =
    "w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";

  return (
    <main className="pt-20 min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <Link href="/gewerbe" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-6">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Zurück zum Verzeichnis
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Partner Programm</p>
          <h1 className="text-4xl font-headline font-black tracking-tighter text-primary mb-3">Unternehmen einreichen</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Tragen Sie Ihr Unternehmen in das lokale Verzeichnis für Raunheim, Kelsterbach und Rüsselsheim ein. Alle Einträge werden redaktionell geprüft.
          </p>
        </div>

        {success ? (
          /* Success */
          <div className="bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined text-secondary text-5xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h2 className="text-2xl font-black text-primary mb-2">Eingegangen!</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto mb-8">
              Ihr Eintrag wird redaktionell geprüft und in Kürze freigeschaltet. Vielen Dank.
            </p>
            <Link href="/gewerbe" className="inline-block signature-gradient text-on-secondary px-8 py-3 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all">
              Zum Verzeichnis
            </Link>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-6">

            {/* Tier */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-3">Paket wählen</label>
              <div className="flex flex-col gap-2">
                {tiers.map((tier) => (
                  <label key={tier.id} className="flex items-center justify-between px-4 py-3 border border-outline-variant/20 hover:border-outline-variant/50 cursor-pointer has-[:checked]:border-secondary has-[:checked]:bg-secondary/5 transition-all">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="tier" value={tier.id} defaultChecked={tier.id === "free"} className="accent-secondary" />
                      <div>
                        <span className="font-bold text-sm text-primary">{tier.label}</span>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{tier.features}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-on-surface-variant ml-4 flex-shrink-0">{tier.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-outline-variant/15" />

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Unternehmensname *</label>
              <input name="name" required type="text" placeholder="z. B. Bäckerei Müller" className={inputClass} />
            </div>

            {/* Town + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stadt *</label>
                <select name="town" required className={inputClass}>
                  <option value="">Bitte wählen</option>
                  {towns.map((t) => <option key={t} value={t.toLowerCase().replace("ü", "ue").replace(" ", "")}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kategorie *</label>
                <select name="category" required className={inputClass}>
                  <option value="">Bitte wählen</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Adresse</label>
              <input name="address" type="text" placeholder="Musterstraße 1, 65479 Raunheim" className={inputClass} />
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Telefon</label>
                <input name="phone" type="tel" placeholder="+49 6142 …" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Website</label>
                <input name="website" type="url" placeholder="https://beispiel.de" className={inputClass} />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kurzbeschreibung</label>
              <textarea name="description" rows={3} placeholder="Was macht Ihr Unternehmen besonders?" className={`${inputClass} resize-none`} />
            </div>

            {/* Contact email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ihre E-Mail *</label>
              <input name="contact_email" required type="email" placeholder="ihre@email.de" className={inputClass} />
              <p className="text-[10px] text-on-surface-variant/60">Wird nicht veröffentlicht. Nur für Rückfragen.</p>
            </div>

            <button type="submit" className="signature-gradient text-on-secondary py-4 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all mt-2">
              Kostenlos einreichen
            </button>

            <p className="text-[10px] text-on-surface-variant text-center">
              Alle Einträge werden redaktionell geprüft. <span className="font-bold">Kein Spam.</span>
            </p>

          </form>
        )}
      </div>
    </main>
  );
}
