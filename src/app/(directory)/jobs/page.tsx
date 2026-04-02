import Link from "next/link";
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

const PAGE_SIZE = 10;

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ town?: string; type?: string; page?: string }>;
}) {
  const { town, type, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  // Count query
  let countQuery = supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);
  if (town) countQuery = countQuery.eq("town", town);
  if (type) countQuery = countQuery.eq("job_type", type);

  // Featured query (always page 1 only)
  const now = new Date().toISOString();
  let featuredQuery = supabase
    .from("jobs")
    .select("id, slug, title, company_name, town, job_type, category, is_featured, image_url, created_at")
    .eq("status", "active")
    .eq("is_featured", true)
    .or(`featured_until.is.null,featured_until.gte.${now}`)
    .or(`expires_at.is.null,expires_at.gte.${now}`);
  if (town) featuredQuery = featuredQuery.eq("town", town);

  // Regular jobs query
  let jobsQuery = supabase
    .from("jobs")
    .select("id, slug, title, company_name, town, job_type, category, is_featured, created_at")
    .eq("status", "active")
    .eq("is_featured", false)
    .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);
  if (town) jobsQuery = jobsQuery.eq("town", town);
  if (type) jobsQuery = jobsQuery.eq("job_type", type);

  const [{ count }, { data: featuredData }, { data: regularData }] = await Promise.all([
    countQuery,
    page === 1 ? featuredQuery : Promise.resolve({ data: [] }),
    jobsQuery,
  ]);

  const featured = featuredData ?? [];
  const regular = regularData ?? [];
  const total = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildHref(p: number) {
    const params = new URLSearchParams();
    if (town) params.set("town", town);
    if (type) params.set("type", type);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/jobs${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="w-full">

      {/* ── Header ── */}
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-8 lg:pb-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {town ? (
            <TownTag town={toDisplayTown(town)} />
          ) : (
            <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Dreigewinnt Region</span>
          )}
          <span className="text-on-surface-variant/40 text-sm italic">— Lokale Stellenangebote</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none">
          Jobs & Karriere
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm sm:text-base leading-relaxed max-w-lg">
          Stellenangebote in Raunheim, Kelsterbach und Rüsselsheim — inklusive Flughafen Frankfurt.
        </p>
        <div className="mt-5">
          <Link
            href="/jobs/einreichen"
            className="inline-flex items-center gap-2 signature-gradient text-on-secondary px-6 py-3 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Stelle ausschreiben
          </Link>
        </div>
      </header>

      {/* ── Type Filter ── */}
      <div className="px-4 sm:px-8 lg:px-12 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(JOB_TYPES).map(([val, label]) => {
            const isActive = type === val;
            const params = new URLSearchParams();
            if (town) params.set("town", town);
            if (!isActive) params.set("type", val);
            const qs = params.toString();
            return (
              <Link
                key={val}
                href={`/jobs${qs ? `?${qs}` : ""}`}
                className={`flex-shrink-0 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Featured (page 1 only) ── */}
      {featured.length > 0 && (
        <section className="mb-10 lg:mb-14">
          <div className="px-4 sm:px-8 lg:px-12 flex items-center justify-between mb-5">
            <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-3">
              <span className="w-6 h-[2px] bg-tertiary flex-shrink-0"></span>
              Featured Boost
            </h2>
            <span className="text-tertiary font-bold text-[10px] tracking-widest uppercase italic">Hervorgehoben</span>
          </div>
          <div className={`px-4 sm:px-8 lg:px-12 grid gap-4 ${featured.length === 1 ? "grid-cols-1 max-w-2xl" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
            {featured.map((job) => (
              <FeaturedJobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* ── Job List ── */}
      <section className="px-4 sm:px-8 lg:px-12 pb-16">
        {total === 0 ? (
          <div className="bg-surface-container-lowest p-16 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3 block">work_off</span>
            <p className="text-on-surface-variant text-sm">Aktuell keine Stellenangebote.</p>
            <p className="text-on-surface-variant/60 text-xs mt-1">Schauen Sie später wieder vorbei.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {total} Stelle{total !== 1 ? "n" : ""}
                {totalPages > 1 && ` · Seite ${page} von ${totalPages}`}
              </p>
            </div>

            <div className="flex flex-col gap-0">
              {regular.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Link
                    href={buildHref(page - 1)}
                    className="flex items-center gap-1 px-4 py-2 bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Zurück
                  </Link>
                )}
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-4">
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={buildHref(page + 1)}
                    className="flex items-center gap-1 px-4 py-2 bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
                  >
                    Weiter
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>

    </main>
  );
}

function FeaturedJobCard({ job }: {
  job: {
    id: string;
    slug: string;
    title: string;
    company_name: string;
    town: string;
    job_type: string | null;
    category: string | null;
    is_featured: boolean;
    created_at: string;
    image_url?: string | null;
  };
}) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group relative flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Image / gradient hero */}
      <div className="relative h-44 overflow-hidden">
        {job.image_url ? (
          <>
            <img
              src={job.image_url}
              alt={job.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full editorial-gradient flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-secondary/30">work</span>
          </div>
        )}

        {/* Boost badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-tertiary text-on-tertiary px-2.5 py-1">
          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Featured</span>
        </div>

        {/* Town tag */}
        <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm text-primary text-[9px] font-black uppercase tracking-widest px-2 py-1">
          {toDisplayTown(job.town)}
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface-container-lowest p-4 flex-1 flex flex-col gap-2 border-b-2 border-tertiary group-hover:bg-surface-container-low transition-colors">
        <div>
          <p className="font-black text-primary text-base leading-snug group-hover:text-secondary transition-colors line-clamp-2">
            {job.title}
          </p>
          <p className="text-[11px] font-bold text-on-surface-variant mt-1">{job.company_name}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-auto pt-2">
          {job.job_type && (
            <span className="bg-secondary-container text-on-secondary-container text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
              {JOB_TYPES[job.job_type] ?? job.job_type}
            </span>
          )}
          {job.category && (
            <span className="text-[9px] text-on-surface-variant uppercase tracking-wider">{job.category}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function JobRow({
  job,
  featured = false,
}: {
  job: {
    id: string;
    slug: string;
    title: string;
    company_name: string;
    town: string;
    job_type: string | null;
    category: string | null;
    is_featured: boolean;
    created_at: string;
  };
  featured?: boolean;
}) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={`flex items-center gap-4 px-5 py-4 border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low transition-colors group ${
        featured ? "bg-tertiary-container/10 border-l-2 border-l-tertiary" : "bg-surface-container-lowest"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="font-bold text-primary text-sm truncate group-hover:text-secondary transition-colors">
            {job.title}
          </p>
          {featured && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary bg-tertiary-container/30 px-2 py-0.5 flex-shrink-0">
              Featured
            </span>
          )}
        </div>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
          {job.company_name}
          {job.town && ` · ${toDisplayTown(job.town)}`}
          {job.job_type && ` · ${JOB_TYPES[job.job_type] ?? job.job_type}`}
          {job.category && ` · ${job.category}`}
        </p>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant text-lg flex-shrink-0 group-hover:text-secondary transition-colors">arrow_forward</span>
    </Link>
  );
}
