import imageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '@/sanity/env';
import type { SanityImage } from './types';

const builder = imageUrlBuilder({ projectId: projectId || 'placeholder', dataset });

export function urlFor(source: SanityImage) {
  return builder.image(source);
}

export function urlForImage(source: SanityImage, width = 2400): string {
  return urlFor(source).width(width).quality(82).auto('format').url();
}
