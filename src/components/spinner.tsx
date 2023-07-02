import { SpinnerInfinity } from 'spinners-react'

export default function Spinner() {
  return (
    <SpinnerInfinity
      size={50}
      thickness={100}
      speed={100}
      color='rgba(14, 165, 233, 1)'
      secondaryColor='rgba(203, 213, 225, 1)'
      aria-hidden='true'
    />
  )
}
