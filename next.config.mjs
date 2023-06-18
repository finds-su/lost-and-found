import { env } from './src/env.mjs'

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'md', 'mdx'],
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: {
    domains: [
      'www.mirea.ru',
      'cdn.cms.mirea.ninja',
      'lk.mirea.ru',
      'avatars.githubusercontent.com',
      env.NEXT_PUBLIC_CDN_ENDPOINT_URL.replace('https://', ''),
    ],
    remotePatterns: [{ hostname: '*.googleusercontent.com' }],
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
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/finds',
  //       permanent: false,
  //     },
  //   ]
  // },
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

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

export default withPWA(withMDX(withBundleAnalyzer(config)))
