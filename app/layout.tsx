import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  // Default metadata; per-page metadata overrides these.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://trouthousetahoe.com'),
  title: {
    default: 'Trout House Kings Beach — Furnished living on the North Shore',
    template: '%s — Trout House',
  },
  description:
    'Studio and 2-bedroom furnished rentals in Kings Beach, walkable to Lake Tahoe.',
};

// Root layout: only the html/body shell + fonts. The marketing route group
// wraps public pages with the site chrome; /studio renders fullscreen.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
