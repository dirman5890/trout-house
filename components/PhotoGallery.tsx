'use client';

import { useEffect, useState } from 'react';
import SanityImage from './SanityImage';
import type { SanityImage as SanityImageType } from '@/lib/sanity/types';

type Props = {
  photos: SanityImageType[];
  alt: string;
};

export default function PhotoGallery({ photos, alt }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, photos.length]);

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  if (!photos || photos.length === 0) return null;

  const thumbs = photos.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="col-span-4 sm:col-span-2 sm:row-span-2 relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand"
          aria-label={`${alt} — open gallery`}
        >
          <SanityImage
            image={photos[0]}
            alt={photos[0].alt || `${alt} — primary photo`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-smooth hover:scale-[1.02]"
            priority
          />
        </button>
        {thumbs.map((photo, idx) => (
          <button
            key={photo.asset._id}
            type="button"
            onClick={() => openAt(idx + 1)}
            className="col-span-2 sm:col-span-1 relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand"
            aria-label={`${alt} — photo ${idx + 2}`}
          >
            <SanityImage
              image={photo}
              alt={photo.alt || `${alt} — photo ${idx + 2}`}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-smooth hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {photos.length > 5 && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="btn-secondary !py-2 !px-5 text-xs"
          >
            See all {photos.length} photos
          </button>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute right-4 top-4 sm:right-8 sm:top-8 rounded-full bg-cream/10 p-3 text-cream backdrop-blur hover:bg-cream/20"
            aria-label="Close gallery"
          >
            <span aria-hidden="true">✕</span>
          </button>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-charcoal">
              <SanityImage
                image={photos[active]}
                alt={photos[active].alt || `${alt} — ${active + 1} of ${photos.length}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-cream">
              <button
                type="button"
                onClick={() => setActive((i) => (i - 1 + photos.length) % photos.length)}
                className="rounded-full bg-cream/10 px-4 py-2 text-sm backdrop-blur hover:bg-cream/20"
              >
                ← Prev
              </button>
              <p className="text-xs text-cream/70">
                {active + 1} / {photos.length}
              </p>
              <button
                type="button"
                onClick={() => setActive((i) => (i + 1) % photos.length)}
                className="rounded-full bg-cream/10 px-4 py-2 text-sm backdrop-blur hover:bg-cream/20"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
