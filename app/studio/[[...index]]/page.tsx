// Embedded Sanity Studio. Lives outside the (marketing) route group so it
// doesn't render the public site's Header/Footer.

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export const dynamic = 'force-static';
export const metadata = { robots: { index: false } };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
