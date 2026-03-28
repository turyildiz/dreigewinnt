import type { Metadata } from "next";
import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Stellenangebote | DREIGEWINNT.COM",
  description: "Aktuelle Jobs und Stellenangebote aus Raunheim, Kelsterbach und Rüsselsheim.",
};

const townLabels: Record<string, "Raunheim" | "Kelsterbach" | "Rüsselsheim"> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

const jobTypeLabels: Record<string, string> = {
  vollzeit: "Vollzeit",
  teilzeit: "Teilzeit",
  minijob: "Minijob",
  ausbildung: "Ausbildung",
  praktikum: "Praktikum",
  freelance: "Freelance",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ town?: string; type?: string }>;
}) {
  const { town, type } = await searchParams;
  const townLabel = town ? townLabels[town] : null;

  let query = supabase
    .from("jobs")
    .select("id, title, company_name, town, job_type, category, description, salary_range, contact_email, contact_phone, website_url, created_at, expires_at")
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });

  if (townLabel) {
    query = query.eq("town", town!);
  }
  if (type) {
    query = query.eq("job_type", type);
  }

  const { data: jobs } = await query;

  return (
    <main className="w-full pb-16">

      {/* ── Page Header ── */}
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-8 lg:pb-12">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {townLabel ? (
            <TownTag town={townLabel} />
          ) : (
            <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Dreigewinnt Region</span>
          )}
          <span className="text-on-surface-variant/40 text-sm italic">— Lokale Arbeitgeber</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none">
          Stellenangebote
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
          {townLabel
            ? `Aktuelle Jobs aus ${townLabel}.`
            : "Jobs von lokalen Unternehmen aus Raunheim, Kelsterbach und Rüsselsheim."}
        </p>
      </header>

      {/* ── Filter bar ── */}
      <div className="px-4 sm:px-8 lg:px-12 mb-8 flex flex-wrap gap-2">
        <Link
          href="/jobs"
          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border transition-colors ${!town && !type ? "border-secondary bg-secondary/10 text-secondary" : "border-outline-variant/20 text-on-surface-variant hover:border-secondary/40"}`}
        >
          Alle
        </Link>
        {Object.entries(townLabels).map(([slug, label]) => (
          <Link
            key={slug}
            href={`/jobs?town=${slug}`}
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border transition-colors ${town === slug ? "border-secondary bg-secondary/10 text-secondary" : "border-outline-variant/20 text-on-surface-variant hover:border-secondary/40"}`}
          >
            {label}
          </Link>
        ))}
        <span className="w-px h-6 self-center bg-outline-variant/20 mx-1" />
        {Object.entries(jobTypeLabels).map(([slug, label]) => (
          <Link
            key={slug}
            href={`/jobs?type=${slug}`}
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border transition-colors ${type === slug ? "border-secondary bg-secondary/10 text-secondary" : "border-outline-variant/20 text-on-surface-variant hover:border-secondary/40"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* ── Job count ── */}
      <div className="px-4 sm:px-8 lg:px-12 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          {jobs?.length ?? 0} {jobs?.length === 1 ? "Stelle" : "Stellen"} gefunden
        </p>
      </div>

      {/* ── Job listings ── */}
      {!jobs || jobs.length === 0 ? (
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              work_off
            </span>
            <p className="text-on-surface-variant text-sm">Aktuell keine offenen Stellen.</p>
            <p className="text-on-surface-variant/60 text-xs mt-1">Schau später wieder vorbei.</p>
          </div>
        </div>
      ) : (
        <section className="px-4 sm:px-8 lg:px-12 flex flex-col gap-3">
          {jobs.map((job) => {
            const displayTown = townLabels[job.town] ?? job.town;
            return (
              <div
                key={job.id}
                className="bg-surface-container-lowest border border-outline-variant/10 p-6 sm:p-8 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {displayTown && (
                        <TownTag town={displayTown as "Raunheim" | "Kelsterbach" | "Rüsselsheim"} />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary px-2 py-0.5">
                        {jobTypeLabels[job.job_type] ?? job.job_type}
                      </span>
                      {job.category && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-outline/10 text-on-surface-variant px-2 py-0.5">
                          {job.category}
                        </span>
                      )}
                    </div>

                    {/* Title + company */}
                    <h2 className="text-lg sm:text-xl font-headline font-black tracking-tighter text-primary leading-tight mb-1">
                      {job.title}
                    </h2>
                    <p className="text-sm font-bold text-on-surface-variant mb-3">{job.company_name}</p>

                    {/* Salary */}
                    {job.salary_range && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">
                        {job.salary_range}
                      </p>
                    )}

                    {/* Description */}
                    {job.description && (
                      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-2 sm:min-w-[180px] sm:items-end">
                    {job.website_url && (
                      <a
                        href={job.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="signature-gradient text-on-secondary px-6 py-3 font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all text-center"
                      >
                        Jetzt bewerben
                      </a>
                    )}
                    {job.contact_email && !job.website_url && (
                      <a
                        href={`mailto:${job.contact_email}`}
                        className="signature-gradient text-on-secondary px-6 py-3 font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all text-center"
                      >
                        Per E-Mail bewerben
                      </a>
                    )}
                    {job.contact_phone && (
                      <a
                        href={`tel:${job.contact_phone}`}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">call</span>
                        {job.contact_phone}
                      </a>
                    )}
                    {job.contact_email && job.website_url && (
                      <a
                        href={`mailto:${job.contact_email}`}
                        className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                      >
                        {job.contact_email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

    </main>
  );
}
