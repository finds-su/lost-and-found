if (!self.define) {
  let e,
    s = {}
  const c = (c, n) => (
    (c = new URL(c + '.js', n).href),
    s[c] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = c), (e.onload = s), document.head.appendChild(e)
        } else (e = c), importScripts(c), s()
      }).then(() => {
        let e = s[c]
        if (!e) throw new Error(`Module ${c} didn’t register its module`)
        return e
      })
  )
  self.define = (n, a) => {
    const i = e || ('document' in self ? document.currentScript.src : '') || location.href
    if (s[i]) return
    let o = {}
    const t = (e) => c(e, i),
      r = { module: { uri: i }, exports: o, require: t }
    s[i] = Promise.all(n.map((e) => r[e] || t(e))).then((e) => (a(...e), o))
  }
}
define(['./workbox-588899ac'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/LUJyKxUoGUbzoWg39TXGg/_buildManifest.js',
          revision: 'a1a239e516699aab88922bd85a1ea21d',
        },
        {
          url: '/_next/static/LUJyKxUoGUbzoWg39TXGg/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/189-0f5a0606dc6d95c7.js', revision: '0f5a0606dc6d95c7' },
        { url: '/_next/static/chunks/279-5c026b64158ed373.js', revision: '5c026b64158ed373' },
        { url: '/_next/static/chunks/675-f8f86b29144052b3.js', revision: 'f8f86b29144052b3' },
        { url: '/_next/static/chunks/880.aad6b83553cb6fde.js', revision: 'aad6b83553cb6fde' },
        { url: '/_next/static/chunks/966.dec03465dd8ae00b.js', revision: 'dec03465dd8ae00b' },
        { url: '/_next/static/chunks/d64684d8-bbcf856a094e7ccd.js', revision: 'bbcf856a094e7ccd' },
        { url: '/_next/static/chunks/framework-2c79e2a64abdb08b.js', revision: '2c79e2a64abdb08b' },
        { url: '/_next/static/chunks/main-f69f9df4c9a03e15.js', revision: 'f69f9df4c9a03e15' },
        { url: '/_next/static/chunks/pages/404-37f6118379eaaa45.js', revision: '37f6118379eaaa45' },
        {
          url: '/_next/static/chunks/pages/_app-8d9ac6dab2912e59.js',
          revision: '8d9ac6dab2912e59',
        },
        {
          url: '/_next/static/chunks/pages/_error-54de1933a164a1ff.js',
          revision: '54de1933a164a1ff',
        },
        {
          url: '/_next/static/chunks/pages/auth/error-a66d5612021dd81e.js',
          revision: 'a66d5612021dd81e',
        },
        {
          url: '/_next/static/chunks/pages/auth/signin-9e726a5820447dd5.js',
          revision: '9e726a5820447dd5',
        },
        {
          url: '/_next/static/chunks/pages/finds-d58b7feec35a1a30.js',
          revision: 'd58b7feec35a1a30',
        },
        {
          url: '/_next/static/chunks/pages/losses-a3f8326eca98bce0.js',
          revision: 'a3f8326eca98bce0',
        },
        { url: '/_next/static/chunks/pages/me-143dc33088ee484a.js', revision: '143dc33088ee484a' },
        {
          url: '/_next/static/chunks/pages/u/%5BuserNickname%5D-7411ee243b24e8d1.js',
          revision: '7411ee243b24e8d1',
        },
        {
          url: '/_next/static/chunks/pages/u/%5BuserNickname%5D/error-7e8f19a75d9dc0f5.js',
          revision: '7e8f19a75d9dc0f5',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        { url: '/_next/static/chunks/webpack-29f6ce59b2338dc5.js', revision: '29f6ce59b2338dc5' },
        { url: '/_next/static/css/a8a5fd5a00ff76d0.css', revision: 'a8a5fd5a00ff76d0' },
        { url: '/assets/kudzh.jpeg', revision: '5466280cd608c6742b532fd92189098b' },
        { url: '/assets/ninja-logo-black.svg', revision: '9fc519ed3c97652e27847bd297fca6b5' },
        { url: '/assets/ninja-logo-white.svg', revision: 'c9b94db18e4d39cb37e9a150f176e7ad' },
        { url: '/assets/providers/github.svg', revision: '8dcc6b5262f3b6138b1566b357ba89a9' },
        { url: '/assets/providers/google.svg', revision: 'ea735e62c31af39012853c932d74375a' },
        { url: '/assets/providers/mirea.svg', revision: '8e579201978f1a7e1df142e0cd6b727a' },
        { url: '/icons/android-chrome-192x192.png', revision: 'f3ee958d022055a1c4f2fb0e1baa85d8' },
        { url: '/icons/android-chrome-512x512.png', revision: '2d43c2d22c7362e2406444b171304e24' },
        {
          url: '/icons/apple-touch-icon-114x114-precomposed.png',
          revision: '944087a9cd4832ae1736bb28e2f7ab8c',
        },
        {
          url: '/icons/apple-touch-icon-114x114.png',
          revision: '39da65c29daf162257948208da74f75c',
        },
        {
          url: '/icons/apple-touch-icon-120x120-precomposed.png',
          revision: '580375b2c14c31b65b3e667350c3b3d0',
        },
        {
          url: '/icons/apple-touch-icon-120x120.png',
          revision: '309b97bf58a7697d8a876981df5a7a6d',
        },
        {
          url: '/icons/apple-touch-icon-144x144-precomposed.png',
          revision: 'df7f8c88ffcf62a72cfcc7f28cda4b6c',
        },
        {
          url: '/icons/apple-touch-icon-144x144.png',
          revision: 'cbfd1f70ba0e0e5fd194186f52b6e07e',
        },
        {
          url: '/icons/apple-touch-icon-152x152-precomposed.png',
          revision: '96287ec9fd71a8c1ce2628f7c6100f09',
        },
        {
          url: '/icons/apple-touch-icon-152x152.png',
          revision: 'ed818c43cdc2fa789e232a664244ba34',
        },
        {
          url: '/icons/apple-touch-icon-180x180-precomposed.png',
          revision: 'd02104f9e8db56dd6717738b64a1a8b7',
        },
        {
          url: '/icons/apple-touch-icon-180x180.png',
          revision: 'bece60514843eb32ff93c7767afaaaa3',
        },
        {
          url: '/icons/apple-touch-icon-57x57-precomposed.png',
          revision: '76395030204dc0569ea612f59c19f681',
        },
        { url: '/icons/apple-touch-icon-57x57.png', revision: '5171885beeb3d993da636e0d89cc33b4' },
        {
          url: '/icons/apple-touch-icon-60x60-precomposed.png',
          revision: '0c42499ead15f933eb1c56a91bafc7b8',
        },
        { url: '/icons/apple-touch-icon-60x60.png', revision: 'e7e65f813dcf38f9cd4b2dda7bb3dc08' },
        {
          url: '/icons/apple-touch-icon-72x72-precomposed.png',
          revision: '8c2049088c2d59692174a6cb3a0b1abc',
        },
        { url: '/icons/apple-touch-icon-72x72.png', revision: 'bd4c3ec9c4ec2dea183b3232d228737f' },
        {
          url: '/icons/apple-touch-icon-76x76-precomposed.png',
          revision: '5e472eac76a4e61f6099a092eea8872f',
        },
        { url: '/icons/apple-touch-icon-76x76.png', revision: '1ce69b75b53075528d556d5481b8fb85' },
        {
          url: '/icons/apple-touch-icon-precomposed.png',
          revision: 'd02104f9e8db56dd6717738b64a1a8b7',
        },
        { url: '/icons/apple-touch-icon.png', revision: 'bece60514843eb32ff93c7767afaaaa3' },
        { url: '/icons/favicon-16x16.png', revision: '3a9dd883c8d11bd9ceb7bcb0ef598108' },
        { url: '/icons/favicon-32x32.png', revision: '7b72643e28e0e54928842d642fcb8589' },
        { url: '/icons/favicon.ico', revision: 'f0258229870c787ab10d642352a50ecc' },
        { url: '/icons/mstile-150x150.png', revision: '2a01c8b13c087ecd37c48a5c0d4ebf2c' },
        { url: '/icons/safari-pinned-tab.svg', revision: '0ff8290d7690e1b59a4266a1cf14f4cc' },
        { url: '/manifest.json', revision: 'ef4b4cf6c8b12a8cc0f96b019bd504f2' },
        { url: '/robots.txt', revision: 'cb837b71656329f816b3572f1f8e0c16' },
        { url: '/sw.js', revision: '2271ff4f39ddc0cd1cf939b0f07e1e38' },
        { url: '/sw.js.map', revision: '485ce5c728b47e0a21f2925bca75fd51' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: c, state: n }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET',
    )
})
