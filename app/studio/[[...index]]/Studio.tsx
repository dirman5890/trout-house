'use client';

// Client-only mount for Sanity Studio. Wrapping NextStudio in a 'use client'
// boundary makes sure React Server Components never try to render the Studio
// itself — Studio is a heavy interactive React app and relies on browser-side
// hooks that fail under SSR.

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function Studio() {
  return <NextStudio config={config} />;
}
