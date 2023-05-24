import Window from '@/components/form/Window'

interface CreatePostProps {
  name: string
  description: string
}

export default function CreatePost(props: CreatePostProps) {
  return (
    <Window>
      <form className='space-y-8 divide-y divide-gray-200'></form>
    </Window>
  )
}
