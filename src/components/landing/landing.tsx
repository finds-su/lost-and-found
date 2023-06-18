import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import Model from '@/components/landing/model'
import Link from 'next/link'
import Image from 'next/image'

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        (state.mouse.x * Math.PI) / 20,
        0.05,
      )
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        (state.mouse.y * Math.PI) / 20,
        0.05,
      )
    }
  })
  return <group ref={ref}>{children}</group>
}

export default function Landing() {
  return (
    <div className='relative h-screen w-screen'>
      <Canvas camera={{ position: [0, -10, 65], fov: 50 }} dpr={[1, 2]} className=''>
        <pointLight position={[100, 100, 100]} intensity={0.8} />
        <hemisphereLight
          color='#ffffff'
          groundColor='#b9b9b9'
          position={[-7, 25, 13]}
          intensity={0.85}
        />
        <Suspense fallback={null}>
          <group position={[0, 10, 0]}>
            <Rig>
              <Model url='/compressed.glb' />
            </Rig>
            <ContactShadows
              rotation-x={Math.PI / 2}
              position={[0, -35, 0]}
              opacity={0.25}
              width={100}
              height={100}
              blur={2}
              far={50}
            />
          </group>
        </Suspense>
      </Canvas>
      <div className='absolute left-10 top-10'>
        <Link className='flex items-center space-x-2' href='/'>
          <Image
            className='h-10 w-10'
            src='/assets/ninja-logo-black.svg'
            alt='Бюро находок Mirea Ninja'
            width={10}
            height={10}
          />
          <b>Бюро находок</b>
        </Link>
      </div>
      <div className='absolute left-1/2 right-0 top-1/2 flex -translate-x-1/2 transform flex-col items-center justify-center md:top-3/4 md:flex-row'>
        <Link
          href='/finds'
          type='button'
          className='mb-2 mr-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800'
        >
          Найденные вещи
        </Link>
        <Link
          href='/losses'
          type='button'
          className='mb-2 mr-2 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800'
        >
          Потерянные вещи
        </Link>
      </div>
    </div>
  )
}
