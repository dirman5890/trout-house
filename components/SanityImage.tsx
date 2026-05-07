import Image, { type ImageProps } from 'next/image';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImage as SanityImageType } from '@/lib/sanity/types';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  image: SanityImageType | undefined | null;
  alt?: string;
  /** Width in pixels for the source URL (next/image still optimizes on top). */
  width?: number;
  fallbackAlt?: string;
};

// Renders a Sanity image with proper alt text, focal-point aware crops, and
// a low-quality blur placeholder. Returns nothing when no image is provided —
// callers should handle the empty case themselves.
export default function SanityImageComponent({
  image,
  alt,
  width = 2400,
  fallbackAlt = '',
  ...rest
}: Props) {
  if (!image?.asset?.url) return null;

  const builder = urlFor(image).width(width).quality(82).auto('format');
  const src = builder.url();
  const lqip = image.asset.metadata?.lqip;

  return (
    <Image
      src={src}
      alt={alt || image.alt || fallbackAlt}
      placeholder={lqip ? 'blur' : undefined}
      blurDataURL={lqip}
      {...rest}
    />
  );
}
