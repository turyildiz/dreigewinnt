import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/ui/SearchBar";
import { supabase } from "@/lib/supabase";
import { ScrollableRow } from "@/components/ui/ScrollableRow";
import { EventAccordion } from "@/components/ui/EventAccordion";

export const dynamic = "force-dynamic";

const townLabels: Record<string, "Raunheim" | "Kelsterbach" | "Rüsselsheim"> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
  });
}

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
  return `vor ${diffWeeks} Woche${diffWeeks !== 1 ? "n" : ""}`;
}

export default async function Home() {
  const now = new Date().toISOString();

  const [{ data: events }, { data: posts }, { data: articles }] = await Promise.all([
    supabase
      .from("events")
      .select("id, slug, title, town, category, date_start, description, image_url, is_featured")
      .eq("status", "active")
      .gte("date_start", now)
      .order("date_start", { ascending: true })
      .limit(3),
    supabase
      .from("business_posts")
      .select("id, content, image_url, images, created_at, businesses(name, slug, town)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("articles")
      .select("id, slug, title, excerpt, hero_image_url, towns, type, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <>
    <main className="pt-16 md:pt-20 max-w-[1440px] w-full mx-auto overflow-hidden">

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-12 md:pt-16 pb-12 md:pb-16 border-b border-outline-variant/10 relative overflow-hidden">

        {/* Decorative large background text — purely CSS, never breaks */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="text-[20vw] font-black text-primary/[0.03] tracking-tighter leading-none whitespace-nowrap pr-8">
            3GW
          </span>
        </div>

        <div className="relative z-10 grid lg:grid-cols-[2fr_1fr] items-stretch gap-0">

          {/* Left: text */}
          <div className="flex flex-col justify-between gap-8">
            <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black text-primary tracking-tighter leading-[0.9]">
              Drei Städte.<br />
              <span className="text-secondary">Eine</span> Plattform.<br />
              Drei Gewinner.
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <p className="text-base md:text-lg text-on-surface-variant font-medium leading-relaxed max-w-xs">
                Das lokale Verzeichnis für Raunheim, Kelsterbach und Rüsselsheim.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <TownTag town="Raunheim" />
                <TownTag town="Kelsterbach" />
                <TownTag town="Rüsselsheim" />
              </div>
            </div>
          </div>

          {/* Right: logo mark — centered in the right grid column */}
          <div className="hidden lg:flex items-center justify-center gap-10 self-stretch">
            <span className="w-[6px] h-[55%] bg-primary" />
            <span className="w-[6px] self-stretch bg-secondary" />
            <span className="w-[6px] h-[70%] bg-tertiary" />
          </div>

        </div>
      </section>

      {/* Full-width Search Bar */}
      <div className="px-6 md:px-12 py-5 bg-surface-container-low border-b border-outline-variant/10 relative z-20">
        <SearchBar />
      </div>

      {/* Trust Bar */}
      <section className="bg-surface-container-low py-4 md:py-6 px-6 md:px-12 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-center md:text-left overflow-hidden">
        <span className="material-symbols-outlined text-secondary hidden md:inline-block" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] text-on-surface-variant leading-relaxed">
          Trust First: Alle Inhalte werden von Menschen geprüft.
          <span className="hidden md:inline"> Echte Empfehlungen, kein Algorithmus.</span>
        </p>
        <span className="hidden md:inline w-12 h-px bg-outline-variant/30"></span>
        <span className="hidden md:inline text-[10px] font-bold text-outline uppercase tracking-widest">editorial quality guaranteed</span>
      </section>

      {/* Aktuelles Section */}
      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <span className="text-secondary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Partner Updates</span>
            <h2 className="text-4xl md:text-5xl font-headline font-black text-primary tracking-tighter">Aktuelles</h2>
          </div>
          <Link href="/aktuelles" className="text-[10px] md:text-sm font-bold uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-secondary transition-colors">Alle Updates ansehen</Link>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="bg-surface-container-lowest p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>feed</span>
            <p className="text-on-surface-variant text-sm mb-1">Noch keine Updates.</p>
            <p className="text-on-surface-variant/60 text-xs">Sobald Partner Neuigkeiten teilen, erscheinen sie hier.</p>
          </div>
        ) : (
          <ScrollableRow>
            {posts.map((post) => {
              const biz = Array.isArray(post.businesses) ? post.businesses[0] : post.businesses;
              if (!biz) return null;
              const truncated = post.content.length > 140 ? post.content.slice(0, 140).trimEnd() + "…" : post.content;
              const postImage = post.images?.[0] ?? post.image_url;
              return (
                <Link
                  key={post.id}
                  href={`/gewerbe/${biz.slug}?tab=aktuelles`}
                  className="group bg-surface-container-low flex flex-col flex-shrink-0 w-[260px] sm:w-[300px] snap-start hover:bg-surface-container transition-colors"
                >
                  <div className="h-40 bg-surface-container-high overflow-hidden flex-shrink-0">
                    {postImage ? (
                      <img src={postImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline/20 text-4xl">feed</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {biz.town && <TownTag town={townLabels[biz.town] ?? biz.town as "Raunheim"} />}
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">
                        {formatRelativeTime(post.created_at)}
                      </span>
                    </div>
                    <h3 className="font-black text-sm text-primary tracking-tight leading-snug group-hover:text-secondary transition-colors">
                      {biz.name}
                    </h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3 flex-1">{truncated}</p>
                  </div>
                </Link>
              );
            })}
          </ScrollableRow>
        )}
      </section>

      {/* Event-Highlights Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-surface-container-low">
        <div className="mb-10 md:mb-16">
          <span className="text-secondary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Stadtleben</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">Veranstaltungen</h2>
        </div>

        {!events || events.length === 0 ? (
          <div className="bg-surface-container-lowest p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>event_busy</span>
            <p className="text-on-surface-variant text-sm mb-1">Aktuell keine kommenden Veranstaltungen.</p>
            <p className="text-on-surface-variant/60 text-xs">Schau bald wieder rein.</p>
          </div>
        ) : (
          <EventAccordion events={events} />
        )}

        <div className="mt-10 md:mt-12 text-center">
          <Link href="/events" className="cursor-pointer inline-block bg-primary text-on-primary px-8 md:px-12 py-4 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] hover:bg-on-surface-variant transition-colors w-full md:w-auto">
            Alle Veranstaltungen entdecken
          </Link>
        </div>
      </section>

      {/* News & Magazin Section */}
      {articles && articles.length > 0 && (
        <section className="py-16 md:py-20 px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div>
              <span className="text-secondary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Lokale Nachrichten</span>
              <h2 className="text-4xl md:text-5xl font-headline font-black text-primary tracking-tighter">Neuigkeiten</h2>
            </div>
            <Link href="/news" className="text-[10px] md:text-sm font-bold uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-secondary transition-colors">Alle Artikel lesen</Link>
          </div>
          <ScrollableRow>
            {articles.map((article) => {
              const town = article.towns?.[0];
              const displayTown = town ? (townLabels[town] ?? town) : null;
              return (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group bg-surface-container-low flex flex-col flex-shrink-0 w-[260px] sm:w-[300px] snap-start hover:bg-surface-container transition-colors"
                >
                  <div className="h-40 bg-surface-container-high overflow-hidden flex-shrink-0">
                    {article.hero_image_url ? (
                      <img src={article.hero_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline/20 text-4xl">newspaper</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {article.type === "story" && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5">Magazin</span>
                      )}
                      {displayTown && <TownTag town={displayTown as "Raunheim" | "Kelsterbach" | "Rüsselsheim"} />}
                    </div>
                    <h3 className="font-black text-sm text-primary tracking-tight leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </ScrollableRow>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="bg-primary text-on-primary p-8 md:p-16 lg:p-24 relative overflow-hidden rounded-lg md:rounded-none">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">Bleibe informiert über deine Heimat.</h2>
            <p className="text-on-primary-container text-base md:text-lg mb-8 md:mb-12">Erhalte wöchentlich die wichtigsten News und exklusive Angebote deiner lokalen Partner direkt in dein Postfach.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input className="flex-1 outline-none bg-primary-container border-none p-4 md:p-5 text-on-primary focus:ring-1 focus:ring-secondary uppercase font-bold text-[10px] md:text-xs tracking-widest w-full" placeholder="DEINE E-MAIL ADRESSE" type="email" />
              <button className="signature-gradient text-on-secondary px-8 md:px-12 py-4 md:py-5 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:brightness-110 transition-all w-full md:w-auto">Abonnieren</button>
            </div>
          </div>
          {/* Abstract visual element */}
          <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-secondary/10 opacity-30 md:opacity-100 skew-y-12 md:-skew-x-12 translate-x-1/2"></div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}

