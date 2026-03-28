import Link from "next/link";
import { TownTag, TownName } from "./TownTag";

export interface EventCardProps {
  id: string;
  title: string;
  dateStr: string;
  town: TownName;
  description: string;
  imageUrl?: string;
  isFeatured?: boolean;
  variant?: "landing" | "directory";
}

export function EventCard({
  id,
  title,
  dateStr,
  town,
  description,
  imageUrl,
  isFeatured = false,
  variant = "landing",
}: EventCardProps) {
  
  const dateNum = dateStr.slice(0, 2);
  const dateMonth = dateStr.split(" ")[1] ? dateStr.split(" ")[1].toUpperCase() : "";

  if (variant === "directory") {
    return (
      <div className="group relative bg-surface-container-lowest border border-tertiary-container/20 overflow-hidden hover:shadow-2xl transition-all duration-500">
        {isFeatured && (
          <div className="absolute top-3 right-3 z-10 bg-primary text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            Featured Boost
          </div>
        )}
        <Link href={`/events/${id}`}>
          {/* Image */}
          <div className="h-44 sm:h-52 lg:h-64 overflow-hidden bg-surface-container-highest">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-outline/40 text-4xl">event</span>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-4 sm:p-6 lg:p-8 relative">
            {/* Date chip */}
            <div className="absolute -top-5 left-4 sm:left-6 lg:left-8 bg-surface-container-lowest p-3 sm:p-4 shadow-sm">
              <span className="block text-secondary font-black text-xl sm:text-2xl leading-none">{dateNum}</span>
              <span className="block text-on-surface-variant text-[9px] uppercase font-bold tracking-widest">{dateMonth}</span>
            </div>

            <div className="pt-5 sm:pt-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-headline font-bold text-primary mb-2 group-hover:text-secondary transition-colors leading-tight">
                {title}
              </h3>
              <p className="text-on-surface-variant text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">{description}</p>
              <button className="w-full flex items-center justify-center gap-2 border border-outline-variant/30 py-2.5 sm:py-3 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-base sm:text-[18px]">calendar_today</span>
                <span className="hidden sm:inline">Zum Kalender hinzufügen</span>
                <span className="sm:hidden">Kalender</span>
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link href={`/events/${id}`}>
        <div className="aspect-[16/9] overflow-hidden rounded-sm bg-surface-container-highest flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <span className="material-symbols-outlined text-outline/40 text-4xl">
              event
            </span>
          )}
        </div>
        
        <div className="absolute -bottom-6 left-6 right-6 md:right-12 bg-surface-container-lowest p-8 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <TownTag town={town} />
              <span className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest">{dateStr}</span>
            </div>
            {isFeatured && (
              <div className="bg-primary text-white text-[10px] px-2 py-0.5 uppercase font-bold tracking-tighter">
                Featured Boost
              </div>
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-primary leading-tight mb-4 group-hover:text-secondary transition-colors">
            {title}
          </h3>
          
          <p className="text-on-surface-variant text-sm line-clamp-2">
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
}
