import type { Metadata } from "next";
import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Lokale Nachrichten | DREIGEWINNT.COM",
  description: "Aktuelle Nachrichten aus Raunheim, Kelsterbach und Rüsselsheim — kuratiert und geprüft.",
};

const townLabels: Record<string, "Raunheim" | "Kelsterbach" | "Rüsselsheim"> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ town?: string }>;
}) {
  const { town } = await searchParams;
  const townLabel = town ? townLabels[town] : null;

  let query = supabase
    .from("articles")
    .select("id, slug, title, excerpt, hero_image_url, towns, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (townLabel) {
    query = query.contains("towns", [townLabel]);
  }

  const { data: articles } = await query;

  const featured = articles?.[0] ?? null;
  const rest = articles?.slice(1) ?? [];

  if (!articles || articles.length === 0) {
    return (
      <main className="w-full pb-16">
        <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-8 lg:pb-12">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {townLabel ? (
              <TownTag town={townLabel} />
            ) : (
              <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Dreigewinnt Region</span>
            )}
            <span className="text-on-surface-variant/40 text-sm italic">— Lokal Kuratiert</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none">Nachrichten</h1>
        </header>
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="bg-surface-container-lowest p-12 text-center">
            <p className="text-on-surface-variant text-sm">Noch keine Artikel veröffentlicht.</p>
          </div>
        </div>
      </main>
    );
  }

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
          <span className="text-on-surface-variant/40 text-sm italic">— Lokal Kuratiert</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none">
          Nachrichten
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
          {townLabel
            ? `Aktuelle Berichte aus ${townLabel}.`
            : "Geprüfte Berichte aus Raunheim, Kelsterbach und Rüsselsheim."}
        </p>
      </header>

      {/* ── Featured Article ── */}
      {featured && (
        <section className="px-4 sm:px-8 lg:px-12 mb-12 lg:mb-16">
          <Link href={`/news/${featured.slug}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface-container-lowest border border-outline-variant/10 overflow-hidden hover:shadow-xl transition-all duration-500">
              {/* Image */}
              <div className="h-56 sm:h-72 lg:h-full min-h-[280px] overflow-hidden bg-surface-container-high">
                {featured.hero_image_url ? (
                  <img
                    src={featured.hero_image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">article</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {featured.towns?.[0] && (
                      <TownTag town={featured.towns[0] as "Raunheim" | "Kelsterbach" | "Rüsselsheim"} />
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-black tracking-tighter text-primary leading-tight mb-4 group-hover:text-secondary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 lg:mt-8 pt-4 border-t border-outline-variant/10">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {featured.published_at && <span>{formatDate(featured.published_at)}</span>}
                  </div>
                  <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Section label ── */}
      {rest.length > 0 && (
        <div className="px-4 sm:px-8 lg:px-12 flex items-center gap-4 mb-6 lg:mb-8">
          <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-3 flex-shrink-0">
            <span className="w-6 h-[2px] bg-outline-variant flex-shrink-0" />
            Weitere Berichte
          </h2>
          <div className="flex-grow h-[1px] bg-outline-variant/15" />
        </div>
      )}

      {/* ── Article list ── */}
      <section className="px-4 sm:px-8 lg:px-12 flex flex-col gap-3">
        {rest.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group bg-surface-container-lowest border border-outline-variant/10 flex items-stretch hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="w-24 sm:w-36 lg:w-48 flex-shrink-0 bg-surface-container-high">
              {article.hero_image_url ? (
                <img
                  src={article.hero_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">article</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {article.towns?.[0] && (
                    <TownTag town={article.towns[0] as "Raunheim" | "Kelsterbach" | "Rüsselsheim"} />
                  )}
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-headline font-bold text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-on-surface-variant text-xs sm:text-sm mt-1 line-clamp-2 hidden sm:block leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {article.published_at && <span>{formatDate(article.published_at)}</span>}
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center pr-8">
              <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </section>

    </main>
  );
}
