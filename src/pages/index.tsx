import dynamic from 'next/dynamic'

const Landing = dynamic(() => import('@/components/landing/landing'), { ssr: false })

export default function LandingPage() {
  return <Landing />
}
