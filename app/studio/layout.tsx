// Studio gets its own layout so it escapes the marketing site's chrome
// (header/footer) and renders fullscreen. The Studio takes over the viewport.

export const metadata = {
  title: 'Trout House Studio',
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
