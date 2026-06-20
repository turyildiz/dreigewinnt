"use client";

import { useRef, useState, useTransition } from "react";

interface Photo {
  id: string;
  url: string;
  sort_order: number;
}

interface ClubGalleryManagerProps {
  clubId: string;
  photos: Photo[];
  uploadAction: (formData: FormData) => Promise<{ error: string } | null>;
  deleteAction: (photoId: string, clubId: string) => Promise<void>;
}

export function ClubGalleryManager({ clubId, photos, uploadAction, deleteAction }: ClubGalleryManagerProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const fd = new FormData();
    fd.append("photo", file);

    startTransition(async () => {
      const result = await uploadAction(fd);
      if (result?.error) setError(result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleDelete(photoId: string) {
    startTransition(async () => {
      await deleteAction(photoId, clubId);
    });
  }

  return (
    <div className="mt-6 bg-surface-container-lowest">
      <div className="px-8 pt-6 pb-1 border-b border-outline-variant/10">
        <p className="text-[9px] font-black uppercase tracking-widest text-secondary/60">Galerie</p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">{photos.length} Fotos</p>
      </div>

      <div className="px-8 py-6 flex flex-col gap-4">
        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square bg-surface-container-high overflow-hidden">
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  disabled={pending}
                  className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-white text-2xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={pending}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="w-full h-24 border-2 border-dashed border-outline-variant/30 flex items-center justify-center gap-3 hover:border-secondary/40 hover:bg-surface-container transition-colors disabled:opacity-50"
        >
          {pending ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Wird hochgeladen…</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-2xl text-on-surface-variant/40">add_photo_alternate</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Foto hinzufügen</span>
            </>
          )}
        </button>

        {error && (
          <p className="text-sm text-error font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
