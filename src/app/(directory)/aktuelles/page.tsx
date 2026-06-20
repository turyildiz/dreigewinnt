import type { Metadata } from "next";
import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Aktuelles — Partner Updates | DREIGEWINNT.COM",
  description: "Aktuelle Updates von lokalen Partnern aus Raunheim, Kelsterbach und Rüsselsheim.",
};

const townLabels: Record<string, "Raunheim" | "Kelsterbach" | "Rüsselsheim"> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

const PAGE_SIZE = 50;

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "gerade eben";
  if (diffMins < 60) return `vor ${diffMins} Minute${diffMins !== 1 ? "n" : ""}`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `vor ${diffHrs} Stunde${diffHrs !== 1 ? "n" : ""}`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays !== 1 ? "en" : ""}`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `vor ${diffWeeks} Woche${diffWeeks !== 1 ? "n" : ""}`;
  return new Date(dateStr).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
}

export default async function AktuellesPage({
  searchParams,
}: {
  searchParams: Promise<{ seite?: string }>;
}) {
  const { seite } = await searchParams;
  const page = Math.max(1, parseInt(seite ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: posts, count } = await supabase
    .from("business_posts")
    .select("id, content, image_url, images, created_at, businesses(name, slug, town)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <main className="w-full pb-16">
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-8 lg:pb-12">
        <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Dreigewinnt Region</span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none mt-3">Aktuelles</h1>
        <p className="text-on-surface-variant mt-3 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
          Neuigkeiten und Updates von lokalen Partnern aus der Region.
        </p>
      </header>

      {!posts || posts.length === 0 ? (
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="bg-surface-container-lowest p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>feed</span>
            <p className="text-on-surface-variant text-sm">Noch keine Updates von Partnern.</p>
          </div>
        </div>
      ) : (
        <>
          <section className="px-4 sm:px-8 lg:px-12 flex flex-col gap-3">
            {posts.map((post) => {
              const biz = Array.isArray(post.businesses) ? post.businesses[0] : post.businesses;
              if (!biz) return null;
              const truncated = post.content.length > 200 ? post.content.slice(0, 200).trimEnd() + "…" : post.content;
              const postImage = post.images?.[0] ?? post.image_url;

              return (
                <Link
                  key={post.id}
                  href={`/gewerbe/${biz.slug}?tab=aktuelles`}
                  className="group bg-surface-container-lowest border border-outline-variant/10 flex items-stretch hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="w-24 sm:w-36 lg:w-48 flex-shrink-0 bg-surface-container-high">
                    {postImage ? (
                      <img
                        src={postImage}
                        alt=""
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center min-h-[80px]">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">feed</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {biz.town && <TownTag town={townLabels[biz.town] ?? biz.town as "Raunheim"} />}
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">
                          {formatRelativeTime(post.created_at)}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-headline font-bold text-primary leading-tight group-hover:text-secondary transition-colors">
                        {biz.name}
                      </h3>
                      <p className="text-on-surface-variant text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                        {truncated}
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center pr-8">
                    <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>

          {totalPages > 1 && (
            <nav className="px-4 sm:px-8 lg:px-12 mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/aktuelles?seite=${page - 1}`}
                  className="px-4 py-2 bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                >
                  Zurück
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/aktuelles?seite=${p}`}
                  className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-colors ${
                    p === page
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={`/aktuelles?seite=${page + 1}`}
                  className="px-4 py-2 bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                >
                  Weiter
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </main>
  );
}
