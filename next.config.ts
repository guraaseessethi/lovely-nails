import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Site pages only load from here, Sanity's image CDN, Google Maps and Instagram's CDN.
// 'unsafe-inline' scripts are required for statically rendered Next.js pages
// (nonces would force every page to render per request and defeat the caching).
const siteCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.cdninstagram.com https://*.fbcdn.net",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const shared = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Trailing slashes are stripped by the redirects below instead, so old
  // WordPress links reach their new home in a single 301.
  skipTrailingSlashRedirect: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },

  // Old WordPress URLs (with or without the trailing slash) -> new sections, as 301s.
  async redirects() {
    const moves: [string, string][] = [
      ["/about-us", "/#april"],
      ["/contact-us", "/#visit"],
      ["/media-events", "/work"],
    ];
    return [
      ...moves.flatMap(([from, to]) => [
        { source: from, destination: to, statusCode: 301 as const },
        { source: `${from}/`, destination: to, statusCode: 301 as const },
      ]),
      { source: "/services/", destination: "/services", statusCode: 301 as const },
      // Any other trailing slash, except the Studio's own routes.
      { source: "/:path((?!studio).+)/", destination: "/:path", statusCode: 308 as const },
    ];
  },

  async headers() {
    return [
      {
        // Everything except the embedded Studio, which needs its own scripts and may be framed by sanity.io.
        source: "/((?!studio$|studio/).*)",
        headers: [
          ...shared,
          { key: "Content-Security-Policy", value: siteCsp },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      { source: "/studio/:path*", headers: shared },
      { source: "/studio", headers: shared },
    ];
  },
};

export default nextConfig;
