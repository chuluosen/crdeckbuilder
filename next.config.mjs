const HIGH_ARENA_SLUGS = Array.from({ length: 9 }, (_, index) => `arena-${index + 12}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return HIGH_ARENA_SLUGS.map((slug) => ({
      source: `/arena/${slug}`,
      destination: `/__arena-resolved/${slug}`,
    }));
  },
};

export default nextConfig;
