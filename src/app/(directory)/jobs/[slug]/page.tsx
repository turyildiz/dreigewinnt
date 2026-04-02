import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TownTag } from "@/components/ui/TownTag";
import { toDisplayTown } from "@/lib/towns";

const JOB_TYPES: Record<string, string> = {
  vollzeit: "Vollzeit",
  teilzeit: "Teilzeit",
  minijob: "Minijob",
  ausbildung: "Ausbildung",
  praktikum: "Praktikum",
  freelance: "Freelance",
};

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

  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-10">

      {/* Back */}
      <Link
        href="/jobs"
        className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-8"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Alle Stellen
      </Link>

      {/* Header */}
      <div className="mb-8">
        {job.town && (
          <div className="mb-3">
            <TownTag town={toDisplayTown(job.town)} />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-headline font-black tracking-tighter text-primary mb-2">
          {job.title}
        </h1>
        <p className="text-lg font-bold text-on-surface-variant">{job.company_name}</p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job.job_type && (
            <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest px-3 py-1">
              {JOB_TYPES[job.job_type] ?? job.job_type}
            </span>
          )}
          {job.category && (
            <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-widest px-3 py-1">
              {job.category}
            </span>
          )}
          {job.salary_range && (
            <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-widest px-3 py-1">
              {job.salary_range}
            </span>
          )}
        </div>
      </div>

      {/* Hero image */}
      {job.image_url && (
        <div className="mb-8 aspect-video overflow-hidden">
          <img src={job.image_url} alt={job.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Description */}
      {job.description && (
        <div className="bg-surface-container-lowest p-6 mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Stellenbeschreibung</h2>
          <div className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-surface-container-lowest p-6 mb-6">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Details</h2>
        <dl className="flex flex-col gap-3">
          {job.address && (
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-sm mt-0.5">location_on</span>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Standort</dt>
                <dd className="text-sm text-primary font-medium">{job.address}</dd>
              </div>
            </div>
          )}
          {job.website_url && (
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-sm mt-0.5">language</span>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Website</dt>
                <dd>
                  <a href={job.website_url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-secondary hover:underline">
                    {job.website_url.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      {/* Apply CTA */}
      {(job.contact_email || job.contact_phone || job.website_url) && (
        <div className="bg-secondary/5 border border-secondary/20 p-6">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Jetzt bewerben</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {job.contact_email && (
              <a
                href={`mailto:${job.contact_email}`}
                className="signature-gradient text-on-secondary text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:brightness-110 transition-all text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  Per E-Mail bewerben
                </span>
              </a>
            )}
            {job.contact_phone && (
              <a
                href={`tel:${job.contact_phone}`}
                className="bg-surface-container text-primary text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-surface-container-high transition-all text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">phone</span>
                  {job.contact_phone}
                </span>
              </a>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
