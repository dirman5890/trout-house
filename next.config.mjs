/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  // Sanity Studio internals don't all play nicely with strict ESM checks;
  // keeping this conservative for now.
  experimental: {
    serverComponentsExternalPackages: ['sanity'],
  },
};

export default nextConfig;
