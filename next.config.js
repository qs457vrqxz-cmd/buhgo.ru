/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Ignore lint and type errors during build (for deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compress responses
  compress: true,

  // Power by header removal for security
  poweredByHeader: false,

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-switch",
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-slider",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-popover",
      "@radix-ui/react-tooltip",
      "sonner",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "date-fns",
    ],
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize chunks
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // UI components chunk
            ui: {
              name: 'ui',
              test: /[\\/]components[\\/]ui[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };
    }
    return config;
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(js|css)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/uslugi/vedenie-buhucheta",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
