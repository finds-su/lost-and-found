import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html className='h-full bg-gray-100' lang='ru'>
      <Head>
        <Script type='module' src='https://cdn.jsdelivr.net/npm/@headlessui/react@1.7.14/+esm' />
        <Script crossOrigin='anonymous' src='https://unpkg.com/react@18/umd/react.production.js' />
        <Script
          crossOrigin='anonymous'
          src='https://unpkg.com/react-dom@18/umd/react-dom.production.js'
        />
        <Script src='https://cdn.tailwindcss.com?plugins=forms' />
        <link
          href='https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css'
          rel='stylesheet'
        />
        <Script src='https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js' />
        <Script src='https://cdn.jsdelivr.net/npm/flowbite-react@0.4.4/lib/cjs/index.min.js' />
        <Script type='module' src='https://cdn.jsdelivr.net/npm/heroicons@2.0.17/+esm' />
      </Head>
      <body className='h-full'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
