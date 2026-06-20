import Link from "next/link";
import { EinreichenForm } from "./EinreichenForm";

export default async function VereineEinreichenPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <Link href="/sport" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-6">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Zurück zum Vereinsverzeichnis
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Verein eintragen</p>
          <h1 className="text-4xl font-headline font-black tracking-tighter text-primary mb-3">Sportverein einreichen</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Tragen Sie Ihren Verein in das lokale Vereinsverzeichnis für Raunheim, Kelsterbach und Rüsselsheim ein. Alle Einträge werden redaktionell geprüft.
          </p>
        </div>

        {success ? (
          <div className="bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined text-secondary text-5xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h2 className="text-2xl font-black text-primary mb-2">Eingegangen!</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto mb-8">
              Ihr Verein wird redaktionell geprüft und in Kürze freigeschaltet. Vielen Dank.
            </p>
            <Link href="/sport" className="inline-block signature-gradient text-on-secondary px-8 py-3 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all">
              Zum Vereinsverzeichnis
            </Link>
          </div>
        ) : (
          <EinreichenForm />
        )}
      </div>
    </main>
  );
}
