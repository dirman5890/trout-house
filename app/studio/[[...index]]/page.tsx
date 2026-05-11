// Embedded Sanity Studio. Lives outside the (marketing) route group so it
// doesn't render the public site's Header/Footer.
//
// The actual Studio component is a separate client-only file so we never try
// to SSR Sanity's React hooks.

import Studio from './Studio';

export const dynamic = 'force-static';
export const dynamicParams = true;

// next-sanity ships canonical metadata + viewport exports for the Studio.
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <Studio />;
}
