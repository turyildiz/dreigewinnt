import Link from "next/link";
import { JobEinreichenForm } from "./JobEinreichenForm";

export default async function JobEinreichenPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="mb-10">
          <Link href="/jobs" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-6">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Zurück zu Jobs
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Jobs & Karriere</p>
          <h1 className="text-4xl font-headline font-black tracking-tighter text-primary mb-3">Stelle ausschreiben</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Veröffentlichen Sie Ihre Stellenanzeige im lokalen Jobboard für Raunheim, Kelsterbach und Rüsselsheim. Alle Einträge werden redaktionell geprüft.
          </p>
        </div>

        {success ? (
          <div className="bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined text-secondary text-5xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h2 className="text-2xl font-black text-primary mb-2">Eingegangen!</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto mb-8">
              Ihre Stellenanzeige wird redaktionell geprüft und in Kürze veröffentlicht. Vielen Dank.
            </p>
            <Link href="/jobs" className="inline-block signature-gradient text-on-secondary px-8 py-3 font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all">
              Zu den Jobs
            </Link>
          </div>
        ) : (
          <JobEinreichenForm />
        )}

      </div>
    </main>
  );
}
