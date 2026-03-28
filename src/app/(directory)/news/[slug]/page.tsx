import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const townColors: Record<string, string> = {
  Raunheim: "bg-surface-container-highest text-primary",
  Kelsterbach: "bg-secondary-container text-on-secondary-container",
  Rüsselsheim: "bg-tertiary-fixed text-on-tertiary-container",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function bodyToParagraphs(body: string): string[] {
  const byDoubleNewline = body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (byDoubleNewline.length > 1) return byDoubleNewline;
  return body.split(/\n/).map((p) => p.trim()).filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, hero_image_url, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) {
    return { title: "Artikel nicht gefunden | DREIGEWINNT.COM" };
  }

  return {
    title: `${article.title} | DREIGEWINNT.COM`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.hero_image_url ? [{ url: article.hero_image_url }] : [],
      type: "article",
      publishedTime: article.published_at ?? undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: article } = await supabase
    .from("articles")
    .select("id, slug, title, excerpt, body, hero_image_url, towns, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-20 text-center">
        <p className="text-on-surface-variant">Artikel nicht gefunden.</p>
        <Link href="/news" className="text-secondary font-bold text-sm mt-4 inline-block hover:underline">
          ← Zurück zu Nachrichten
        </Link>
      </main>
    );
  }

  const primaryTown = article.towns?.[0] ?? null;
  const paragraphs = article.body ? bodyToParagraphs(article.body) : [];

  // Fetch 2 other recent published articles for related sidebar
  const { data: related } = await supabase
    .from("articles")
    .select("slug, title, hero_image_url, towns")
    .eq("status", "published")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(2);

  return (
    <main className="w-full pb-16">

      {/* ── Hero ── */}
      <div className="relative h-[40vw] min-h-[240px] max-h-[500px] overflow-hidden bg-surface-container-high">
        {article.hero_image_url ? (
          <img
            src={article.hero_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

        {primaryTown && (
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-12 flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${townColors[primaryTown] ?? "bg-surface-container-highest text-primary"}`}>
              {primaryTown}
            </span>
          </div>
        )}
      </div>

      {/* ── Article content ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12">

        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Alle Nachrichten
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">

          {/* ── Article body ── */}
          <article className="lg:col-span-2">
            {/* Meta */}
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-5">
              {article.published_at && <span>{formatDate(article.published_at)}</span>}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tighter text-primary leading-tight mb-8">
              {article.title}
            </h1>

            {/* Lead paragraph */}
            {article.excerpt && (
              <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-6 font-medium border-l-2 border-secondary pl-4 lg:pl-6">
                {article.excerpt}
              </p>
            )}

            {/* Body paragraphs */}
            <div className="flex flex-col gap-5">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="text-on-surface text-sm sm:text-base leading-relaxed lg:leading-loose">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Source note */}
            <div className="mt-10 pt-6 border-t border-outline-variant/15 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-sm">verified</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Redaktionell geprüft · DREIGEWINNT.COM Editorial
              </p>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-6">

            {/* Share */}
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 lg:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Teilen</p>
              <div className="flex gap-2">
                {["link", "mail", "share"].map((icon) => (
                  <button
                    key={icon}
                    className="flex-1 flex items-center justify-center gap-2 border border-outline-variant/20 py-2.5 text-[10px] font-bold uppercase tracking-wide hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Related articles */}
            {related && related.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-3">
                  <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
                  Weitere Berichte
                </p>
                <div className="flex flex-col gap-3">
                  {related.map((rel) => {
                    const relTown = rel.towns?.[0] ?? null;
                    return (
                      <Link
                        key={rel.slug}
                        href={`/news/${rel.slug}`}
                        className="group flex gap-3 bg-surface-container-lowest border border-outline-variant/10 p-3 hover:shadow-md transition-all"
                      >
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-surface-container-high">
                          {rel.hero_image_url ? (
                            <img
                              src={rel.hero_image_url}
                              alt={rel.title}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-2xl text-on-surface-variant/20">article</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {relTown && (
                            <span className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase mb-1 ${townColors[relTown] ?? "bg-surface-container-highest text-primary"}`}>
                              {relTown}
                            </span>
                          )}
                          <p className="text-xs font-bold text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                            {rel.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </aside>

        </div>
      </div>

    </main>
  );
}
