/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "assets.uat.ordering-Farmshop.ekbana.net",
      "api.uat.ordering-Farmshop.ekbana.net",
      "uat.ordering-Farmshop.ekbana.net",
      "system.uat.ordering-Farmshop.ekbana.net",
      "assets.raptor.multiple.ekbana.net",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

module.exports = nextConfig;
