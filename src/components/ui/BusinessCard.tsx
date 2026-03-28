import Link from "next/link";
import { TownTag, TownName } from "./TownTag";

export interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  town: TownName;
  description: string;
  rating: number;
  reviewCount: number;
  openUntil?: string;
  specialOffer?: string;
  isPremium?: boolean;
}

export function BusinessCard({
  id,
  name,
  category,
  town,
  description,
  rating,
  reviewCount,
  openUntil,
  specialOffer,
  isPremium = false,
}: BusinessCardProps) {
  return (
    <article
      className={`flex flex-col md:flex-row gap-8 p-8 relative group transition-all duration-300 ${
        isPremium
          ? "bg-surface border border-outline-variant/10 hover:bg-surface-bright"
          : "bg-surface-container-low border-b border-outline-variant/10 hover:bg-surface"
      }`}
    >
      {isPremium && (
        <div className="absolute top-0 right-0 bg-primary px-3 py-1 text-[10px] font-bold text-on-primary uppercase tracking-widest z-10">
          Premium Partner
        </div>
      )}

      {/* Image Placeholder */}
      <div
        className={`w-full ${
          isPremium ? "md:w-64" : "md:w-48"
        } h-48 md:h-auto bg-surface-container-high rounded-sm relative overflow-hidden flex-shrink-0`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-outline/40 text-4xl">
            storefront
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <TownTag town={town} />
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {category}
            </span>
          </div>
          
          <h3
            className={`font-black text-primary mb-3 transition-colors ${
              isPremium ? "text-3xl group-hover:text-secondary" : "text-2xl group-hover:text-primary"
            }`}
          >
            {name}
          </h3>
          
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6 max-w-2xl">
            {description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 mt-auto">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-tertiary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {rating} ({reviewCount})
            </span>
          </div>

          {openUntil && (
            <div className="hidden md:flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                schedule
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Geöffnet bis {openUntil}
              </span>
            </div>
          )}

          {specialOffer && (
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_offer
              </span>
              <span className="text-secondary text-xs font-bold uppercase tracking-widest">
                {specialOffer}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/gewerbe/${id}`}
        className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
        aria-label={`View details for ${name}`}
      >
        <button className="bg-primary text-on-primary p-3 rounded-sm hover:-translate-y-1 transition-transform">
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </Link>
    </article>
  );
}
