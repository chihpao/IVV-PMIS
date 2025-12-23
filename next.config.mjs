import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['lodash', 'lucide-react', 'react-icons', '@radix-ui/react-icons'],
  },
};

export default withNextIntl(nextConfig);
