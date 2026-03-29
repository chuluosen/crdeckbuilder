/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect Arena 12-20 to high-arenas page with anchor
      {
        source: '/arena/arena-12',
        destination: '/arena/high-arenas#arena-12',
        permanent: true,
      },
      {
        source: '/arena/arena-13',
        destination: '/arena/high-arenas#arena-13',
        permanent: true,
      },
      {
        source: '/arena/arena-14',
        destination: '/arena/high-arenas#arena-14',
        permanent: true,
      },
      {
        source: '/arena/arena-15',
        destination: '/arena/high-arenas#arena-15',
        permanent: true,
      },
      {
        source: '/arena/arena-16',
        destination: '/arena/high-arenas#arena-16',
        permanent: true,
      },
      {
        source: '/arena/arena-17',
        destination: '/arena/high-arenas#arena-17',
        permanent: true,
      },
      {
        source: '/arena/arena-18',
        destination: '/arena/high-arenas#arena-18',
        permanent: true,
      },
      {
        source: '/arena/arena-19',
        destination: '/arena/high-arenas#arena-19',
        permanent: true,
      },
      {
        source: '/arena/arena-20',
        destination: '/arena/high-arenas#arena-20',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
