import Link from "next/link";
import { TownTag } from "@/components/ui/TownTag";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/ui/SearchBar";
import { supabase } from "@/lib/supabase";

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

  const [{ data: partners }, { data: events }, { data: posts }, { data: articles }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, slug, name, town, category, description, hero_image_url")
      .eq("status", "active")
      .eq("is_spotlight", true)
      .limit(4),
    supabase
      .from("events")
      .select("id, slug, title, town, category, start_date, description, hero_image_url, is_featured")
      .eq("status", "active")
      .gte("start_date", now)
      .order("start_date", { ascending: true })
      .limit(2),
    supabase
      .from("business_posts")
      .select("id, content, image_url, images, created_at, businesses(name, slug, town, tier)")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
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

      {/* Aktuelles aus der Region */}
      {posts && posts.length > 0 && (
        <section className="py-16 md:py-20 px-6 md:px-12 bg-surface-container-low">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div>
              <span className="text-secondary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Updates</span>
              <h2 className="text-4xl md:text-5xl font-headline font-black text-primary tracking-tighter">Aktuelles aus der Region</h2>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-6 md:-mx-12 px-6 md:px-12">
            {posts.map((post) => {
              const biz = Array.isArray(post.businesses) ? post.businesses[0] : post.businesses;
              if (!biz) return null;
              const truncated = post.content.length > 180 ? post.content.slice(0, 180).trimEnd() + "…" : post.content;
              return (
                <div key={post.id} className="bg-surface p-6 flex flex-col gap-3 flex-shrink-0 w-[280px] sm:w-[320px] snap-start">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/gewerbe/${biz.slug}`}
                      className="font-black text-sm text-primary hover:text-secondary transition-colors tracking-tight leading-snug"
                    >
                      {biz.name}
                    </Link>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex-shrink-0">
                      {formatRelativeTime(post.created_at)}
                    </span>
                  </div>
                  {(post.images?.[0] ?? post.image_url) && (
                    <div className="overflow-hidden h-36 flex-shrink-0">
                      <img
                        src={post.images?.[0] ?? post.image_url!}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-on-surface-variant text-sm leading-relaxed flex-1">{truncated}</p>
                  <Link
                    href={`/gewerbe/${biz.slug}?tab=aktuelles`}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors mt-auto"
                  >
                    <span>Mehr lesen</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

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

      {/* Top-Partner Section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-4">
          <div>
            <span className="text-tertiary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] block mb-3 md:mb-4">Gewerbeverzeichnis</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">Top-Partner</h2>
          </div>
          <Link href="/gewerbe" className="text-[10px] md:text-sm font-bold uppercase tracking-widest border-b-2 border-secondary pb-1 hover:text-secondary transition-colors">Alle Unternehmen ansehen</Link>
        </div>

        {!partners || partners.length === 0 ? (
          <div className="bg-surface-container-lowest p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            <p className="text-on-surface-variant text-sm mb-1">Noch keine Premium-Partner.</p>
            <p className="text-on-surface-variant/60 text-xs">Demnächst stellen sich lokale Unternehmen vor.</p>
          </div>
        ) : (
          <>
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {partners[0] && (
                <PartnerCard
                  business={partners[0]}
                  className="md:col-span-1"
                  gradientClass="bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"
                  textAlign="left"
                />
              )}
              {partners[1] && (
                <PartnerCard
                  business={partners[1]}
                  className="md:col-span-2"
                  gradientClass="bg-gradient-to-r from-primary/80 via-primary/40 to-transparent"
                  textAlign="left"
                />
              )}
            </div>

            {/* Row 2 (only if we have 3+ partners) */}
            {partners.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {partners[2] && (
                  <PartnerCard
                    business={partners[2]}
                    className="md:col-span-2"
                    gradientClass="bg-gradient-to-l from-primary/80 via-primary/40 to-transparent"
                    textAlign="right"
                  />
                )}
                {partners[3] && (
                  <PartnerCard
                    business={partners[3]}
                    className="md:col-span-1"
                    gradientClass="bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"
                    textAlign="left"
                  />
                )}
              </div>
            )}
          </>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {events[0] && (
              <Link href={`/events/${events[0].slug}`} className="group relative overflow-hidden h-[420px] md:h-[540px] block md:col-span-2">
                {events[0].hero_image_url ? (
                  <img
                    src={events[0].hero_image_url}
                    alt={events[0].title}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                {events[0].is_featured && (
                  <div className="absolute top-4 left-4 bg-primary/60 backdrop-blur-sm px-3 py-1">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Featured</span>
                  </div>
                )}
                {events[0].town && (
                  <div className="absolute top-4 right-4">
                    <TownTag town={townLabels[events[0].town] ?? events[0].town as "Raunheim"} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">
                    {events[0].start_date && formatEventDate(events[0].start_date)}
                    {events[0].category && ` · ${events[0].category}`}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">
                    {events[0].title}
                  </h3>
                  {events[0].description && (
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5 max-w-lg">
                      {events[0].description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                    <span>Zur Veranstaltung</span>
                    <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
                  </div>
                </div>
              </Link>
            )}

            {events[1] && (
              <Link href={`/events/${events[1].slug}`} className="group relative overflow-hidden h-[420px] md:h-[540px] block md:col-span-1">
                {events[1].hero_image_url ? (
                  <img
                    src={events[1].hero_image_url}
                    alt={events[1].title}
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                {events[1].is_featured && (
                  <div className="absolute top-4 left-4 bg-primary/60 backdrop-blur-sm px-3 py-1">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Featured</span>
                  </div>
                )}
                {events[1].town && (
                  <div className="absolute top-4 right-4">
                    <TownTag town={townLabels[events[1].town] ?? events[1].town as "Raunheim"} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">
                    {events[1].start_date && formatEventDate(events[1].start_date)}
                    {events[1].category && ` · ${events[1].category}`}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">
                    {events[1].title}
                  </h3>
                  {events[1].description && (
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5">
                      {events[1].description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors">
                    <span>Zur Veranstaltung</span>
                    <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
                  </div>
                </div>
              </Link>
            )}

            {/* If only 1 event, fill the right column with a CTA */}
            {events.length === 1 && (
              <div className="md:col-span-1 bg-surface-container-lowest flex items-center justify-center h-[420px] md:h-[540px]">
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
                  <p className="text-on-surface-variant text-sm">Weitere Veranstaltungen folgen.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 md:mt-12 text-center">
          <Link href="/events" className="inline-block bg-primary text-on-primary px-8 md:px-12 py-4 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] hover:bg-on-surface-variant transition-colors w-full md:w-auto">
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
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-6 md:-mx-12 px-6 md:px-12">
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
          </div>
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

interface Business {
  id: string;
  slug: string;
  name: string;
  town: string;
  category: string | null;
  description: string | null;
  hero_image_url: string | null;
}

function PartnerCard({
  business,
  className,
  gradientClass,
  textAlign,
}: {
  business: Business;
  className?: string;
  gradientClass: string;
  textAlign: "left" | "right";
}) {
  const displayTown = townLabels[business.town] ?? business.town;

  return (
    <Link href={`/gewerbe/${business.slug}`} className={`group relative overflow-hidden h-[480px] md:h-[600px] block ${className ?? ""}`}>
      {business.hero_image_url ? (
        <img
          src={business.hero_image_url}
          alt={business.name}
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-surface-container-high" />
      )}
      <div className={`absolute inset-0 ${gradientClass}`} />
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-tertiary px-3 py-1">
        <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        <span className="text-white text-[10px] font-black uppercase tracking-widest">Top-Partner</span>
      </div>
      <div className="absolute top-4 right-4">
        <TownTag town={displayTown as "Raunheim" | "Kelsterbach" | "Rüsselsheim"} />
      </div>
      <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-8 ${textAlign === "right" ? "md:text-right" : ""}`}>
        {business.category && (
          <span className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest block mb-2">{business.category}</span>
        )}
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3 group-hover:text-secondary-fixed transition-colors">
          {business.name}
        </h3>
        {business.description && (
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-5 hidden md:block">
            {business.description}
          </p>
        )}
        <div className={`flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover:text-secondary-fixed transition-colors ${textAlign === "right" ? "md:justify-end" : ""}`}>
          <span>Zum Profil</span>
          <span className="material-symbols-outlined text-sm -translate-x-1 group-hover:translate-x-0 transition-transform duration-300">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
}
