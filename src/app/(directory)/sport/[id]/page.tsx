import type { Metadata } from "next";
import Link from "next/link";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";
import { ensureHttp } from "@/lib/utils";
import { getSportLabel } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: c } = await supabase
    .from("clubs")
    .select("name, sport, town, description, hero_image_url")
    .eq("slug", id)
    .eq("status", "approved")
    .single();

  if (!c) return {};

  const town = toDisplayTown(c.town);
  const title = `${c.name} — ${getSportLabel(c.sport) || "Sportverein"} in ${town} | Dreigewinnt`;
  const description = c.description
    ? c.description.slice(0, 155)
    : `${c.name} ist ein Sportverein in ${town}. Jetzt Neuigkeiten, Termine und Kontaktdaten auf Dreigewinnt entdecken.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: c.hero_image_url ? [{ url: c.hero_image_url }] : [],
    },
  };
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

export default async function ClubDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "info" ? "info" : "neuigkeiten";

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("slug", id)
    .eq("status", "approved")
    .single();

  if (!club) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-20 text-center">
        <p className="text-on-surface-variant">Verein nicht gefunden.</p>
        <Link href="/sport" className="text-secondary font-bold text-sm mt-4 inline-block hover:underline">
          ← Zurück zum Vereinsverzeichnis
        </Link>
      </main>
    );
  }

  const [{ data: photos }, { data: posts }] = await Promise.all([
    supabase
      .from("club_photos")
      .select("url")
      .eq("club_id", club.id)
      .order("sort_order"),
    supabase
      .from("club_posts")
      .select("*")
      .eq("club_id", club.id)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false }),
  ]);

  const galleryImages = photos?.map((p) => p.url) ?? [];
  const displayTown = toDisplayTown(club.town);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: club.name,
    description: club.description ?? undefined,
    image: club.hero_image_url ?? undefined,
    sport: getSportLabel(club.sport) || undefined,
    foundingDate: club.founded_year ? String(club.founded_year) : undefined,
    address: club.address
      ? {
          "@type": "PostalAddress",
          streetAddress: club.address,
          addressLocality: displayTown,
          addressCountry: "DE",
        }
      : undefined,
    telephone: club.phone ?? undefined,
    email: club.email ?? undefined,
    url: club.website ? ensureHttp(club.website) : undefined,
  };

  return (
    <main className="w-full pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <div className="relative h-[35vw] min-h-[220px] max-h-[440px] bg-surface-container-high overflow-hidden">
        <HeroSlideshow
          images={galleryImages}
          alt={club.name}
          fallback={club.hero_image_url ?? undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/5 to-transparent" />
        {club.is_spotlight && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-12 bg-tertiary text-on-tertiary text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
            SPOTLIGHT
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12 bg-surface-container-low">

        <Link
          href="/sport"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Vereinsverzeichnis
        </Link>

        {/* ── Club name + sport ── */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className="text-[9px] font-black px-2.5 py-1 uppercase tracking-[0.1em] rounded-none bg-secondary/10 text-secondary">
              Sportverein
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/30" />
              <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-black opacity-60">
                {getSportLabel(club.sport)}
              </span>
            </div>
          </div>
          <h1 id="club-title" className="text-3xl sm:text-4xl lg:text-4.5xl font-headline font-black tracking-tighter text-primary leading-[1.1]">
            {club.name}
          </h1>
        </div>

        {/* ── Tab Bar ── */}
        <div className="sticky top-20 z-20 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 bg-surface/95 backdrop-blur-[8px] pt-3 pb-4 mb-4 lg:mb-6 border-b border-outline-variant/10">
          <div className="bg-surface-container-high/50 p-1.5 rounded-none flex gap-1">
            <Link
              href={`/sport/${id}?tab=neuigkeiten`}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-none transition-all duration-300 ${
                tab === "neuigkeiten"
                  ? "bg-white shadow-sm text-primary"
                  : "text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-white/40"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl flex-shrink-0"
                style={{ fontVariationSettings: tab === "neuigkeiten" ? "'FILL' 1" : "" }}
              >
                campaign
              </span>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase tracking-widest leading-none">
                  Neuigkeiten
                </p>
                <p className="text-[9px] font-bold opacity-60 hidden sm:block mt-0.5">News & Updates</p>
              </div>
            </Link>
            <Link
              href={`/sport/${id}?tab=info`}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-none transition-all duration-300 ${
                tab === "info"
                  ? "bg-white shadow-sm text-primary"
                  : "text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-white/40"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl flex-shrink-0"
                style={{ fontVariationSettings: tab === "info" ? "'FILL' 1" : "" }}
              >
                info
              </span>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase tracking-widest leading-none">
                  Info
                </p>
                <p className="text-[9px] font-bold opacity-60 hidden sm:block mt-0.5">Kontakt & Details</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">

          {/* ── Main content ── */}
          <div className="lg:col-span-2">

            {tab === "info" && (
              <div className="flex flex-col gap-8 lg:gap-12">
                <div className="bg-white border border-outline-variant/10 p-6 sm:p-8 rounded-none shadow-sm">
                  {club.description || club.full_description ? (
                    <div className="flex flex-col gap-4">
                      {club.description && (
                        <p className="text-on-surface-variant/70 text-[13px] sm:text-[15px] leading-relaxed">
                          {club.description}
                        </p>
                      )}
                      {club.full_description && (
                        <p className="text-on-surface-variant/70 text-[13px] sm:text-[15px] leading-relaxed whitespace-pre-line">
                          {club.full_description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                        info
                      </span>
                      <p className="text-on-surface-variant/60 text-sm italic">
                        Keine ausführliche Beschreibung für diesen Verein hinterlegt.
                      </p>
                    </div>
                  )}
                </div>

                {/* Founded / Members */}
                {(club.founded_year || club.members_count) && (
                  <div className="grid grid-cols-2 gap-4">
                    {club.founded_year && (
                      <div className="bg-white border border-outline-variant/10 p-5 rounded-none shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-on-surface-variant/40 block mb-2">Gegründet</span>
                        <p className="text-2xl font-headline font-black text-primary tracking-tight">{club.founded_year}</p>
                      </div>
                    )}
                    {club.members_count && (
                      <div className="bg-white border border-outline-variant/10 p-5 rounded-none shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-on-surface-variant/40 block mb-2">Mitglieder</span>
                        <p className="text-2xl font-headline font-black text-primary tracking-tight">{club.members_count.toLocaleString("de-DE")}</p>
                      </div>
                    )}
                  </div>
                )}

                {galleryImages.length > 0 && (
                  <div>
                    <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase mb-4 lg:mb-6 flex items-center gap-3">
                      <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
                      Galerie
                    </h2>
                    <GalleryLightbox images={galleryImages} altPrefix={club.name} />
                  </div>
                )}

                {/* Contact info — mobile only */}
                <div className="lg:hidden flex flex-col gap-4">
                  <ContactSidebar club={club} displayTown={displayTown} />
                </div>
              </div>
            )}

            {tab === "neuigkeiten" && (
              <>
                {!posts || posts.length === 0 ? (
                  <div className="bg-surface-container-lowest/80 border-2 border-dashed border-outline-variant/10 rounded-none p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-surface-container rounded-none flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                    </div>
                    <h3 className="text-primary font-black text-lg tracking-tight mb-2">Noch keine Neuigkeiten</h3>
                    <p className="text-on-surface-variant/60 text-sm max-w-xs mx-auto leading-relaxed">Dieser Verein hat zurzeit keine aktuellen Beiträge veröffentlicht.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-white border border-outline-variant/10 p-6 flex flex-col gap-4 shadow-md">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                            {club.name}
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest flex-shrink-0">
                            {formatRelativeTime(post.created_at)}
                          </span>
                        </div>
                        {(() => {
                          const imgs: string[] = post.images?.length ? post.images : post.image_url ? [post.image_url] : [];
                          if (!imgs.length) return null;
                          return (
                            <div className={`grid gap-1 ${imgs.length === 1 ? "grid-cols-1" : imgs.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                              {imgs.map((url: string) => (
                                <img key={url} src={url} alt="" className="w-full object-cover aspect-video" />
                              ))}
                            </div>
                          );
                        })()}
                        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Persistent right sidebar (desktop) ── */}
          <aside className="hidden lg:flex flex-col gap-4">
            <ContactSidebar club={club} displayTown={displayTown} />
          </aside>

        </div>

      </div>

    </main>
  );
}

function ContactSidebar({
  club,
  displayTown,
}: {
  club: {
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    town: string;
    social_instagram?: string | null;
    social_facebook?: string | null;
  };
  displayTown: string;
}) {
  const cardClass = "bg-white border border-outline-variant/10 p-5 lg:p-6 rounded-none shadow-sm";
  const labelClass = "text-[9px] font-black uppercase tracking-[0.15em] text-on-surface-variant/40 mb-4 block";

  return (
    <>
      <div className={cardClass}>
        <span className={labelClass}>Adresse</span>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-secondary text-xl">location_on</span>
          </div>
          <div>
            <p className="font-black text-primary text-sm tracking-tight">{displayTown}</p>
            {club.address && <p className="text-on-surface-variant/80 text-xs mt-0.5 leading-relaxed">{club.address}</p>}
          </div>
        </div>
      </div>

      {(club.phone || club.email || club.website) && (
        <div className={`${cardClass} flex flex-col gap-5`}>
          <span className={labelClass}>Kontakt</span>
          <div className="flex flex-col gap-4">
            {club.phone && (
              <a href={`tel:${club.phone}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">call</span>
                </div>
                <span className="text-sm font-black text-primary group-hover:text-secondary transition-colors tracking-tight">{club.phone}</span>
              </a>
            )}
            {club.email && (
              <a href={`mailto:${club.email}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">mail</span>
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors truncate">{club.email}</span>
              </a>
            )}
            {club.website && (
              <a href={ensureHttp(club.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">language</span>
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors truncate">{club.website}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {(club.social_instagram || club.social_facebook) && (
        <div className={`${cardClass} flex flex-col gap-5`}>
          <span className={labelClass}>Social Media</span>
          <div className="flex flex-col gap-4">
            {club.social_instagram && (
              <a href={`https://instagram.com/${club.social_instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">photo_camera</span>
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors truncate">
                  {club.social_instagram.startsWith("@") ? club.social_instagram : `@${club.social_instagram}`}
                </span>
              </a>
            )}
            {club.social_facebook && (
              <a href={ensureHttp(club.social_facebook)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">public</span>
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors truncate">Facebook</span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
