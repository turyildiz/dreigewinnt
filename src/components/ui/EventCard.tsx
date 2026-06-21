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
  venue?: string;
  category?: string;
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
  venue,
  category,
}: EventCardProps) {
  
  const dateNum = dateStr.slice(0, 2);
  const dateMonth = dateStr.split(" ")[1] ? dateStr.split(" ")[1].toUpperCase() : "";

  if (variant === "directory") {
    return (
      <div className="group relative bg-surface-container-lowest border border-outline-variant/10 overflow-hidden hover:shadow-lg transition-all duration-500">
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
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition-all duration-500"
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
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <TownTag town={town} />
                {category && (
                  <span className="text-secondary font-bold text-[9px] sm:text-[10px] tracking-widest uppercase">{category}</span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-headline font-bold text-primary mb-2 group-hover:text-secondary transition-colors leading-tight">
                {title}
              </h3>
              <p className="text-on-surface-variant text-xs sm:text-sm mb-3 line-clamp-2">{description}</p>
              {venue && (
                <div className="flex items-center gap-2 text-on-surface-variant/70">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="text-[11px] font-medium">{venue}</span>
                </div>
              )}
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
