const HIGH_ARENA_SLUGS = Array.from({ length: 9 }, (_, index) => `arena-${index + 12}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/arena/high-arenas",
        destination: "/arena/arena-12",
        permanent: true,
      },
      {
        source: "/arena/high-arenas/:card",
        destination: "/arena/arena-12/:card",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return HIGH_ARENA_SLUGS.map((slug) => ({
      source: `/arena/${slug}`,
      destination: `/__arena-resolved/${slug}`,
    }));
  },
};

export default nextConfig;
