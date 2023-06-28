import { NextSeo } from 'next-seo'

interface DocsNextSeoProps {
  title: string
  description: string
}

export default function DocsSeo(props: DocsNextSeoProps) {
  return (
    <NextSeo
      title={props.title}
      description={props.description}
      openGraph={{
        title: props.title,
        description: props.description,
        images: [
          {
            url: '/logo-icons/apple-touch-icon-precomposed.png',
            width: 300,
            height: 300,
            alt: `Логотип Mirea Ninja`,
          },
        ],
      }}
    />
  )
}
