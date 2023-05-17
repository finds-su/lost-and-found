import { env } from './src/env.mjs'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      'www.mirea.ru',
      'cdn.cms.mirea.ninja',
      'lk.mirea.ru',
      'avatars.githubusercontent.com',
    ],
    remotePatterns: [
      { hostname: '*.googleusercontent.com' },
      {
        protocol: 'https',
        hostname: env.S3_UPLOAD_HOSTNAME,
        port: '',
        pathname: `/${env.S3_UPLOAD_BUCKET}/**`,
      },
    ],
  },
  ...(env.NODE_ENV === 'production' && {
    output: 'standalone',
    compiler: {
      removeConsole: {
        exclude: ['error'],
      },
    },
  }),
  async headers() {
    return [
      {
        source: '/me',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ]
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
}

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: env.ANALYZE,
})

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: env.DISABLE_PWA,
  register: true,
  scope: '/',
  sw: 'service-worker.js',
})

export default withPWA(withBundleAnalyzer(config))
