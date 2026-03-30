"use client";

import { useEffect, useState } from "react";

interface Props {
  images: string[];
  alt: string;
  fallback?: string;
}

export function HeroSlideshow({ images, alt, fallback }: Props) {
  const all = images.length > 0 ? images : fallback ? [fallback] : [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (all.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % all.length);
    }, 4000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (all.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="material-symbols-outlined text-outline/30 text-6xl">storefront</span>
      </div>
    );
  }

  if (all.length === 1) {
    return <img src={all[0]} alt={alt} className="w-full h-full object-cover" />;
  }

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {all.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} — Foto ${i + 1}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
    </div>
  );
}
