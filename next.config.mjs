/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'www.mirea.ru',
      'cdn.cms.mirea.ninja',
      'lk.mirea.ru',
      'avatars.githubusercontent.com',
    ],
    remotePatterns: [{ hostname: '*.googleusercontent.com' }],
  },
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/finds',
        permanent: false,
      },
    ]
  },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },
}
export default config
