import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TownTag } from "@/components/ui/TownTag";
import { toDisplayTown } from "@/lib/towns";
import { ensureHttp } from "@/lib/utils";

const JOB_TYPES: Record<string, string> = {
  vollzeit: "Vollzeit",
  teilzeit: "Teilzeit",
  minijob: "Minijob",
  ausbildung: "Ausbildung",
  praktikum: "Praktikum",
  freelance: "Freelance",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: job } = await supabase
    .from("jobs")
    .select("title, company_name, town, description, image_url")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!job) return {};

  const town = toDisplayTown(job.town);
  const title = `${job.title} bei ${job.company_name} in ${town} | Dreigewinnt Jobs`;
  const description = job.description 
    ? job.description.slice(0, 155) 
    : `Neu: ${job.title} bei ${job.company_name} in ${town}. Jetzt Details ansehen und direkt bewerben auf Dreigewinnt.com.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: job.image_url ? [{ url: job.image_url }] : [],
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!job) notFound();

  const displayTown = toDisplayTown(job.town);

  return (
    <main className="w-full pb-16">
      
      {/* ── Hero (only when image exists) ── */}
      {job.image_url && (
        <div className="relative h-[30vw] min-h-[200px] max-h-[360px] bg-surface-container-high overflow-hidden">
          <img src={job.image_url} alt={job.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          {job.is_featured && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-12 bg-tertiary text-on-tertiary text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
              FEATURED
            </div>
          )}
        </div>
      )}

      {/* ── Content Container ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12">
        
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Alle Stellen
        </Link>

        {/* ── Header ── */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {job.town && <TownTag town={displayTown} />}
            <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
              {job.category || "Stellenangebot"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tighter text-primary leading-tight mb-2">
            {job.title}
          </h1>
          <p className="text-lg sm:text-xl font-bold text-on-surface-variant">{job.company_name}</p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            {job.job_type && (
              <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                {JOB_TYPES[job.job_type] ?? job.job_type}
              </span>
            )}
            {job.salary_range && (
              <span className="bg-surface-container-high text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                {job.salary_range}
              </span>
            )}
          </div>
        </div>

        {/* ── Layout ── */}
        {job.description ? (
          /* Three-column grid when there's a description */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-surface-container-lowest p-6 lg:p-8 border border-outline-variant/10 shadow-sm">
                <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase mb-6 flex items-center gap-3">
                  <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
                  Stellenbeschreibung
                </h2>
                <div className="text-sm sm:text-base text-on-surface leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6">
              <div className="bg-white border-2 border-primary/5 p-6 lg:p-8 shadow-xl flex flex-col gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Interesse geweckt?</p>
                  <h3 className="text-xl font-headline font-black text-primary leading-tight">Jetzt bewerben</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {job.contact_email && (
                    <a href={`mailto:${job.contact_email}`} className="signature-gradient text-on-secondary text-[11px] font-black uppercase tracking-widest px-6 py-4 hover:brightness-110 transition-all text-center flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">mail</span>
                      Per E-Mail
                    </a>
                  )}
                  {job.contact_phone && (
                    <a href={`tel:${job.contact_phone}`} className="bg-surface-container text-primary text-[11px] font-black uppercase tracking-widest px-6 py-4 hover:bg-surface-container-high transition-all text-center flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">phone</span>
                      {job.contact_phone}
                    </a>
                  )}
                  {job.website_url && (
                    <a href={job.website_url} target="_blank" rel="noopener noreferrer" className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant text-[11px] font-black uppercase tracking-widest px-6 py-4 hover:bg-surface-container-low transition-all text-center flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">language</span>
                      Portal öffnen
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant/60 leading-relaxed italic">
                  Bitte beziehen Sie sich bei Ihrer Bewerbung auf Dreigewinnt.com.
                </p>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 flex flex-col gap-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Job Details</p>
                {job.address && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">location_on</span>
                    <div>
                      <p className="font-bold text-primary text-sm">{displayTown}</p>
                      <p className="text-on-surface-variant text-xs mt-0.5">{job.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">schedule</span>
                  <div>
                    <p className="font-bold text-primary text-sm">Anstellungsart</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">
                      {job.job_type ? (JOB_TYPES[job.job_type] ?? job.job_type) : "Nicht angegeben"}
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-2 border-t border-outline-variant/10">
                  <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">
                    Veröffentlicht am {new Date(job.created_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* Two-column grid when there's no description — fills the full width */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Apply Card */}
            <div className="bg-white border-2 border-primary/5 p-6 lg:p-8 shadow-xl flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Interesse geweckt?</p>
                <h3 className="text-xl font-headline font-black text-primary leading-tight">Jetzt bewerben</h3>
              </div>
              <div className="flex flex-col gap-3">
                {job.contact_email && (
                  <a href={`mailto:${job.contact_email}`} className="signature-gradient text-on-secondary text-[11px] font-black uppercase tracking-widest px-6 py-4 hover:brightness-110 transition-all text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    Per E-Mail bewerben
                  </a>
                )}
                {job.contact_phone && (
                  <a href={`tel:${job.contact_phone}`} className="bg-surface-container text-primary text-[11px] font-black uppercase tracking-widest px-6 py-4 hover:bg-surface-container-high transition-all text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">phone</span>
                    {job.contact_phone}
                  </a>
                )}
                {job.website_url && (
                  <a href={ensureHttp(job.website_url)} target="_blank" rel="noopener noreferrer" className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant text-[11px] font-black uppercase tracking-widest px-6 py-4 hover:bg-surface-container-low transition-all text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">language</span>
                    Portal öffnen
                  </a>
                )}
              </div>
              <p className="text-[10px] text-on-surface-variant/60 leading-relaxed italic">
                Bitte beziehen Sie sich bei Ihrer Bewerbung auf Dreigewinnt.com.
              </p>
            </div>

            {/* Details Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 lg:p-8 flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Job Details</p>
              {job.address && (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">location_on</span>
                  <div>
                    <p className="font-bold text-primary text-sm">{displayTown}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">{job.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0">schedule</span>
                <div>
                  <p className="font-bold text-primary text-sm">Anstellungsart</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">
                    {job.job_type ? (JOB_TYPES[job.job_type] ?? job.job_type) : "Nicht angegeben"}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-outline-variant/10">
                <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-widest">
                  Veröffentlicht am {new Date(job.created_at).toLocaleDateString("de-DE")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
