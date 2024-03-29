import { Html, Main, NextScript, Head } from 'next/document'

export default function Document() {
  return (
    <Html className='h-ful' lang='ru'>
      <Head />
      {/*<Head>*/}
      {/*  <Script type='module' src='https://cdn.jsdelivr.net/npm/@headlessui/react@1.7.14/+esm' />*/}
      {/*  <Script type='module' src='https://cdn.jsdelivr.net/npm/heroicons@2.0.18/+esm' />*/}
      {/*  <Script crossOrigin='anonymous' src='https://unpkg.com/react@18/umd/react.production.js' />*/}
      {/*  <Script*/}
      {/*    crossOrigin='anonymous'*/}
      {/*    src='https://unpkg.com/react-dom@18/umd/react-dom.production.js'*/}
      {/*  />*/}
      {/*  <Script src='https://cdn.tailwindcss.com?plugins=forms' />*/}
      {/*  <link*/}
      {/*    href='https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css'*/}
      {/*    rel='stylesheet'*/}
      {/*  />*/}
      {/*  <Script src='https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js' />*/}
      {/*  <Script src='https://cdn.jsdelivr.net/npm/flowbite-react@0.4.4/lib/cjs/index.min.js' />*/}
      {/*  <Script type='module' src='https://cdn.jsdelivr.net/npm/heroicons@2.0.17/+esm' />*/}
      {/*</Head>*/}
      <body className='h-full'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
