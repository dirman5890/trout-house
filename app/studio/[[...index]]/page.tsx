// Embedded Sanity Studio. Lives outside the (marketing) route group so it
// doesn't render the public site's Header/Footer.

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export const dynamic = 'force-static';
export const dynamicParams = true;

// next-sanity ships canonical metadata + viewport exports for the Studio.
// Pulling them in lets Studio set things like its title bar correctly
// and avoids hydration issues when Vercel serves the prerendered shell.
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
