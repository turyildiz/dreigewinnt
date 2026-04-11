import type { Metadata } from "next";
import Link from "next/link";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { StickyBusinessHeader } from "@/components/ui/StickyBusinessHeader";
import { supabase } from "@/lib/supabase";
import { toDisplayTown } from "@/lib/towns";
import { ensureHttp } from "@/lib/utils";

import { getCategoryLabel } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: b } = await supabase
    .from("businesses")
    .select("name, category, town, description, hero_image_url")
    .eq("slug", id)
    .eq("status", "active")
    .single();

  if (!b) return {};

  const town = toDisplayTown(b.town);
  const title = `${b.name} — ${b.category} in ${town} | Dreigewinnt`;
  const description = b.description
    ? b.description.slice(0, 155)
    : `${b.name} ist ein Unternehmen in ${town}. Jetzt Informationen, Angebote und Kontaktdaten auf Dreigewinnt entdecken.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: b.hero_image_url ? [{ url: b.hero_image_url }] : [],
    },
  };
}

const tierLabels: Record<string, { label: string; classes: string }> = {
  premium: { label: "Premium Partner", classes: "bg-tertiary text-on-tertiary" },
  standard: { label: "Standard", classes: "bg-surface-container-high text-on-surface-variant" },
  free: { label: "Basiseintrag", classes: "bg-surface-container text-on-surface-variant" },
};

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

export default async function BusinessDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "info" ? "info" : "aktuelles";

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", id)
    .eq("status", "active")
    .single();

  if (!business) {
    return (
      <main className="px-4 sm:px-8 lg:px-12 py-20 text-center">
        <p className="text-on-surface-variant">Unternehmen nicht gefunden.</p>
        <Link href="/gewerbe" className="text-secondary font-bold text-sm mt-4 inline-block hover:underline">
          ← Zurück zum Verzeichnis
        </Link>
      </main>
    );
  }

  const [{ data: photos }, { data: posts }] = await Promise.all([
    supabase
      .from("business_photos")
      .select("url")
      .eq("business_id", business.id)
      .order("sort_order"),
    supabase
      .from("business_posts")
      .select("*")
      .eq("business_id", business.id)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false }),
  ]);

  const galleryImages = photos?.map((p) => p.url) ?? [];
  const tier = tierLabels[business.tier];
  const openingHours: { day: string; hours: string }[] = business.opening_hours ?? [];

  const isFree = business.tier === "free";
  const displayTown = toDisplayTown(business.town);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description ?? undefined,
    image: business.hero_image_url ?? undefined,
    address: business.address
      ? {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: displayTown,
          addressCountry: "DE",
        }
      : undefined,
    telephone: business.phone ?? undefined,
    email: business.email ?? undefined,
    url: business.website ? ensureHttp(business.website) : undefined,
    openingHoursSpecification: (business.opening_hours as { day: string; hours: string }[] | null)?.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.day,
      description: row.hours,
    })),
  };

  // ── Free tier: minimal stub ──────────────────────────────────────────────
  if (isFree) {
    return (
      <main className="w-full pb-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Flat header — no hero image */}
        <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12">
          <Link
            href="/gewerbe"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Gewerbeverzeichnis
          </Link>

          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest bg-surface-container text-on-surface-variant">
              Basiseintrag
            </span>
            <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
              {getCategoryLabel(business.category)}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-black tracking-tighter text-primary leading-tight mb-8">
            {business.name}
          </h1>

          {/* Address only */}
          <div className="bg-surface-container-lowest p-5 lg:p-6 flex items-start gap-3 mb-3 max-w-sm">
            <span className="material-symbols-outlined text-on-surface-variant/50 text-xl flex-shrink-0">location_on</span>
            <div>
              <p className="font-bold text-primary text-sm">{toDisplayTown(business.town)}</p>
              {business.address && <p className="text-on-surface-variant text-xs mt-0.5">{business.address}</p>}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-10 max-w-xl bg-surface-container-low p-6 lg:p-8 border-l-4 border-secondary">
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Ihr Unternehmen?</p>
            <h2 className="text-xl font-headline font-black text-primary mb-3 leading-tight">
              Präsentieren Sie sich mit einem vollständigen Profil.
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Mit einem Standard- oder Premium-Eintrag erhalten Sie ein Titelbild, Beschreibung, Öffnungszeiten, Galerie und die Möglichkeit, Angebote direkt über Telegram zu veröffentlichen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { icon: "photo_camera", label: "Titelbild & Galerie" },
                { icon: "schedule", label: "Öffnungszeiten" },
                { icon: "description", label: "Beschreibung & Details" },
                { icon: "send", label: "Beiträge via Telegram" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-base">{icon}</span>
                  <span className="text-xs font-bold text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/gewerbe/einreichen?name=${encodeURIComponent(business.name)}&town=${encodeURIComponent(business.town)}&category=${encodeURIComponent(business.category ?? "")}&address=${encodeURIComponent(business.address ?? "")}&upgrade=1&existing_id=${encodeURIComponent(business.id)}`}
              className="signature-gradient text-on-secondary text-[11px] font-black uppercase tracking-widest px-6 py-3 hover:brightness-110 transition-all inline-block"
            >
              Jetzt upgraden
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Standard / Premium tier: full profile ────────────────────────────────
  return (
    <main className="w-full pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <div className="relative h-[35vw] min-h-[220px] max-h-[440px] bg-surface-container-high overflow-hidden">
        <HeroSlideshow
          images={galleryImages}
          alt={business.name}
          fallback={business.hero_image_url ?? undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/5 to-transparent" />
        {business.tier === "premium" && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-12 bg-tertiary text-on-tertiary text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
            TOP-PARTNER
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-12 bg-surface-container-low">

        <Link
          href="/gewerbe"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-6 lg:mb-8"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Gewerbeverzeichnis
        </Link>

        {/* ── Business name + tier ── */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className={`text-[9px] font-black px-2.5 py-1 uppercase tracking-[0.1em] rounded-none ${tier.classes}`}>
              {tier.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/30" />
              <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-black opacity-60">
                {getCategoryLabel(business.category)}
              </span>
            </div>
          </div>
          <h1 id="business-title" className="text-3xl sm:text-4xl lg:text-4.5xl font-headline font-black tracking-tighter text-primary leading-[1.1]">
            {business.name}
          </h1>
        </div>

        <StickyBusinessHeader
          businessName={business.name}
          town={displayTown}
          slug={id}
          activeTab={tab}
          titleId="business-title"
        />

        {/* ── Two-column layout: main content + persistent sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">

          {/* ── Main content area ── */}
          <div className="lg:col-span-2">

            {tab === "info" && (
              <div className="flex flex-col gap-8 lg:gap-12">
                <div className="bg-white border border-outline-variant/10 p-6 sm:p-8 rounded-none shadow-sm">
                  {business.description || business.full_description ? (
                    <div className="flex flex-col gap-4">
                      {business.description && (
                        <p className="text-on-surface-variant/70 text-[13px] sm:text-[15px] leading-relaxed">
                          {business.description}
                        </p>
                      )}
                      {business.full_description && (
                        <p className="text-on-surface-variant/70 text-[13px] sm:text-[15px] leading-relaxed whitespace-pre-line">
                          {business.full_description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>
                        info
                      </span>
                      <p className="text-on-surface-variant/60 text-sm italic">
                        Keine ausführliche Beschreibung für dieses Unternehmen hinterlegt.
                      </p>
                    </div>
                  )}
                </div>

                {galleryImages.length > 0 && (
                  <div>
                    <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase mb-4 lg:mb-6 flex items-center gap-3">
                      <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
                      Galerie
                    </h2>
                    <GalleryLightbox images={galleryImages} altPrefix={business.name} />
                  </div>
                )}

                {/* Contact info — mobile only (sidebar shows on desktop) */}
                <div className="lg:hidden flex flex-col gap-4">
                  <ContactSidebar business={business} openingHours={openingHours} displayTown={displayTown} />
                </div>

                {business.tier !== "premium" && (
                  <div className="lg:hidden">
                    <UpsellCTA business={business} />
                  </div>
                )}
              </div>
            )}

            {tab === "aktuelles" && (
              <>
                {!posts || posts.length === 0 ? (
                  <div className="bg-surface-container-lowest/80 border-2 border-dashed border-outline-variant/10 rounded-none p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-surface-container rounded-none flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                    </div>
                    <h3 className="text-primary font-black text-lg tracking-tight mb-2">Noch keine Updates</h3>
                    <p className="text-on-surface-variant/60 text-sm max-w-xs mx-auto leading-relaxed">Dieses Unternehmen hat zurzeit keine aktuellen Beiträge oder Angebote veröffentlicht.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-white border border-outline-variant/10 p-6 flex flex-col gap-4 shadow-md">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                            {business.name}
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

                {/* Upsell CTA below posts — mobile only */}
                {business.tier !== "premium" && (
                  <div className="lg:hidden mt-8">
                    <UpsellCTA business={business} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Persistent right sidebar (desktop) ── */}
          <aside className="hidden lg:flex flex-col gap-4">
            <ContactSidebar business={business} openingHours={openingHours} displayTown={displayTown} />

            {business.tier !== "premium" && (
              <div className="bg-surface-container-low border border-outline-variant/10 p-5 flex flex-col gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">send</span>
                <div>
                  <p className="font-bold text-primary text-sm mb-1">Eintrag aktualisieren</p>
                  <p className="text-on-surface-variant text-xs leading-relaxed mb-3">Als Premium Partner können Sie Öffnungszeiten, Fotos und Angebote direkt via Telegram einreichen.</p>
                  <Link
                    href={`/gewerbe/einreichen?name=${encodeURIComponent(business.name)}&town=${encodeURIComponent(business.town)}&category=${encodeURIComponent(business.category ?? "")}&address=${encodeURIComponent(business.address ?? "")}&upgrade=1&existing_id=${encodeURIComponent(business.id)}`}
                    className="signature-gradient text-on-secondary text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 hover:brightness-110 transition-all block text-center"
                  >
                    Jetzt upgraden
                  </Link>
                </div>
              </div>
            )}
          </aside>

        </div>

      </div>

    </main>
  );
}

function ContactSidebar({
  business,
  openingHours,
  displayTown,
}: {
  business: { address?: string | null; phone?: string | null; email?: string | null; website?: string | null; town: string };
  openingHours: { day: string; hours: string }[];
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
            {business.address && <p className="text-on-surface-variant/80 text-xs mt-0.5 leading-relaxed">{business.address}</p>}
          </div>
        </div>
      </div>

      {(business.phone || business.email || business.website) && (
        <div className={`${cardClass} flex flex-col gap-5`}>
          <span className={labelClass}>Kontakt</span>
          <div className="flex flex-col gap-4">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">call</span>
                </div>
                <span className="text-sm font-black text-primary group-hover:text-secondary transition-colors tracking-tight">{business.phone}</span>
              </a>
            )}
            {business.email && (
              <a href={`mailto:${business.email}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">mail</span>
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors truncate">{business.email}</span>
              </a>
            )}
            {business.website && (
              <a href={ensureHttp(business.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-secondary text-xl">language</span>
                </div>
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors truncate">{business.website}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {openingHours.length > 0 && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/5 rounded-none flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-secondary text-xl">schedule</span>
              </div>
              <span className={labelClass.replace("mb-4 block", "mb-0")}>Öffnungszeiten</span>
            </div>
            

          </div>

          <div className="flex flex-col gap-3.5">
            {openingHours.map((row, idx) => (
              <div key={idx} className="flex justify-between items-baseline gap-4 group">
                <span className="text-[11px] font-bold uppercase tracking-wide text-primary/70 group-hover:text-primary transition-colors min-w-[110px]">
                  {row.day}
                </span>
                <span className="text-[11px] font-medium text-on-surface-variant/90 text-right flex-1">
                  {row.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function UpsellCTA({ business }: { business: { id: string; name: string; town: string; category?: string | null; address?: string | null } }) {
  const upgradeHref = `/gewerbe/einreichen?name=${encodeURIComponent(business.name)}&town=${encodeURIComponent(business.town)}&category=${encodeURIComponent(business.category ?? "")}&address=${encodeURIComponent(business.address ?? "")}&upgrade=1&existing_id=${encodeURIComponent(business.id)}`;
  return (
    <div className="bg-surface-container-low border border-outline-variant/10 p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <span className="material-symbols-outlined text-secondary text-2xl flex-shrink-0">send</span>
      <div className="flex-1">
        <p className="font-bold text-primary text-sm mb-0.5">Eintrag aktualisieren</p>
        <p className="text-on-surface-variant text-xs">Als Premium Partner können Sie Öffnungszeiten, Fotos und Angebote direkt via Telegram einreichen.</p>
      </div>
      <Link
        href={upgradeHref}
        className="signature-gradient text-on-secondary text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 hover:brightness-110 transition-all flex-shrink-0 w-full sm:w-auto text-center"
      >
        Jetzt upgraden
      </Link>
    </div>
  );
}
