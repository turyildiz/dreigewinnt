import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lokale Nachrichten | DREIGEWINNT.COM",
  description: "Aktuelle Nachrichten aus Raunheim, Kelsterbach und Rüsselsheim — kuratiert und geprüft.",
};

const articles = [
  {
    slug: "neues-gewerbegebiet-raunheim-2025",
    title: "Raunheim plant neues Gewerbegebiet am Stadtrand",
    excerpt: "Die Stadt Raunheim hat grünes Licht für ein 12 Hektar großes Gewerbegebiet im Norden gegeben. Ansiedlungen aus Logistik und Leichtindustrie sind vorgesehen.",
    town: "Raunheim",
    category: "Wirtschaft",
    date: "2025-09-18",
    dateFormatted: "18. September 2025",
    readingTime: "3 Min.",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1600&auto=format&fit=crop",
    isFeatured: true,
  },
  {
    slug: "kelsterbach-fahrradwege-ausbau",
    title: "Kelsterbach erweitert sein Fahrradwegenetz deutlich",
    excerpt: "Bis 2026 sollen 8 Kilometer neue Radwege entstehen. Das Projekt verbindet erstmals alle Stadtteile mit dem Mainufer.",
    town: "Kelsterbach",
    category: "Stadtentwicklung",
    date: "2025-09-14",
    dateFormatted: "14. September 2025",
    readingTime: "2 Min.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
    isFeatured: false,
  },
  {
    slug: "ruesselsheim-opel-museum-erweiterung",
    title: "Opel-Museum Rüsselsheim: Neue Dauerausstellung zur Elektromobilität",
    excerpt: "Das Museum zeigt ab Oktober eine umfassende Schau zur Geschichte und Zukunft des Elektroantriebs — von den Anfängen bis zur Gegenwart.",
    town: "Rüsselsheim",
    category: "Kultur",
    date: "2025-09-10",
    dateFormatted: "10. September 2025",
    readingTime: "4 Min.",
    imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop",
    isFeatured: false,
  },
  {
    slug: "main-taunus-gastro-award-2025",
    title: "Main-Taunus Gastro Award: Drei lokale Betriebe ausgezeichnet",
    excerpt: "Beim diesjährigen Gastronomiepreis des Kreises konnten sich Betriebe aus allen drei Dreigewinnt-Städten durchsetzen.",
    town: "Raunheim",
    category: "Gastronomie",
    date: "2025-09-05",
    dateFormatted: "5. September 2025",
    readingTime: "3 Min.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    isFeatured: false,
  },
  {
    slug: "kelsterbach-fluglaerm-initiative",
    title: "Bürgerinitiative gegen Fluglärm übergibt 4.000 Unterschriften",
    excerpt: "Die Initiative Leiser Kelsterbach hat ihre Petition an den Kreistag übergeben. Eine Anhörung ist für November geplant.",
    town: "Kelsterbach",
    category: "Bürger & Politik",
    date: "2025-08-28",
    dateFormatted: "28. August 2025",
    readingTime: "2 Min.",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",
    isFeatured: false,
  },
];

const townColors: Record<string, string> = {
  Raunheim: "bg-surface-container-highest text-primary",
  Kelsterbach: "bg-secondary-container text-on-secondary-container",
  Rüsselsheim: "bg-tertiary-fixed text-on-tertiary-container",
};

const featured = articles.find((a) => a.isFeatured)!;
const rest = articles.filter((a) => !a.isFeatured);

export default function NewsPage() {
  return (
    <main className="w-full pb-16">

      {/* ── Page Header ── */}
      <header className="px-4 sm:px-8 lg:px-12 pt-6 lg:pt-14 pb-8 lg:pb-12">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-surface-container-highest text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Dreigewinnt Region
          </span>
          <span className="text-on-surface-variant/40 text-sm italic">— Lokal Kuratiert</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-primary leading-none">
          Nachrichten
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
          Geprüfte Berichte aus Raunheim, Kelsterbach und Rüsselsheim.
        </p>
      </header>

      {/* ── Featured Article ── */}
      <section className="px-4 sm:px-8 lg:px-12 mb-12 lg:mb-16">
        <Link href={`/news/${featured.slug}`} className="group block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface-container-lowest border border-outline-variant/10 overflow-hidden hover:shadow-xl transition-all duration-500">
            {/* Image */}
            <div className="h-56 sm:h-72 lg:h-full min-h-[280px] overflow-hidden bg-surface-container-high">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${townColors[featured.town]}`}>
                    {featured.town}
                  </span>
                  <span className="text-secondary font-bold text-[10px] tracking-widest uppercase">
                    {featured.category}
                  </span>
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
                  <span>{featured.dateFormatted}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span>{featured.readingTime} Lesezeit</span>
                </div>
                <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Section label ── */}
      <div className="px-4 sm:px-8 lg:px-12 flex items-center gap-4 mb-6 lg:mb-8">
        <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-3 flex-shrink-0">
          <span className="w-6 h-[2px] bg-outline-variant flex-shrink-0" />
          Weitere Berichte
        </h2>
        <div className="flex-grow h-[1px] bg-outline-variant/15" />
      </div>

      {/* ── Article list ── */}
      <section className="px-4 sm:px-8 lg:px-12 flex flex-col gap-3">
        {rest.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group bg-surface-container-lowest border border-outline-variant/10 flex items-stretch hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="w-24 sm:w-36 lg:w-48 flex-shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${townColors[article.town]}`}>
                    {article.town}
                  </span>
                  <span className="text-secondary font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-headline font-bold text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-on-surface-variant text-xs sm:text-sm mt-1 line-clamp-2 hidden sm:block leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>{article.dateFormatted}</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant hidden sm:block" />
                <span className="hidden sm:block">{article.readingTime} Lesezeit</span>
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
