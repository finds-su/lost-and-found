import { type ComponentProps } from 'react'

type TextAreaProps = {
  textareaProps: ComponentProps<'textarea'>
}

export default function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props.textareaProps}
      className='block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
    />
  )
}
