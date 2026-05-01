/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/arena/high-arenas",
        destination: "/arena/arena-12",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
