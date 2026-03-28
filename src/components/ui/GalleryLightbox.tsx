"use client";

import { useState } from "react";

interface Props {
  images: string[];
  altPrefix: string;
}

export function GalleryLightbox({ images, altPrefix }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-[16/9] bg-surface-container-high overflow-hidden">
        <img
          src={images[active]}
          alt={`${altPrefix} – Foto ${active + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          key={active}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-1 aspect-square overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                i === active
                  ? "ring-2 ring-secondary opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={src}
                alt={`${altPrefix} – Vorschau ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
