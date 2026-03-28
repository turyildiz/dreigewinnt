import Link from "next/link";
import { TownName } from "./TownTag";

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
  
  // Split the dateStr for the directory box (e.g. "24. Sept" -> "24", "SEPT")
  const dateNum = dateStr.slice(0, 2);
  const dateMonth = dateStr.split(" ")[1] ? dateStr.split(" ")[1].toUpperCase() : "";

  if (variant === "directory") {
    return (
      <div className="group relative bg-surface-container-lowest border border-tertiary-container/20 overflow-hidden hover:shadow-2xl transition-all duration-500">
        {isFeatured && (
          <div className="absolute top-4 right-4 z-10 bg-tertiary text-on-tertiary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            Top-Partner
          </div>
        )}
        <Link href={`/events/${id}`}>
          <div className="h-64 overflow-hidden bg-surface-container-highest">
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
          <div className="p-8 relative">
            <div className="absolute -top-6 left-8 bg-surface-container-lowest p-4 shadow-sm">
              <span className="block text-secondary font-black text-2xl leading-none">{dateNum}</span>
              <span className="block text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">{dateMonth}</span>
            </div>
            <div className="pt-6">
              <h3 className="text-2xl font-headline font-bold text-primary mb-2 group-hover:text-secondary transition-colors">{title}</h3>
              <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{description}</p>
              <button className="w-full flex items-center justify-center gap-2 border border-outline-variant/30 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Zum Kalender hinzufügen
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
            <span className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-widest">
              {dateStr} • {town}
            </span>
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
