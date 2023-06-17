import { type ComponentProps } from 'react'

type TextAreaProps = {
  textAreaProps: Omit<ComponentProps<'textarea'>, 'className'>
  error?: string
}

export default function TextArea(props: TextAreaProps) {
  return (
    <>
      <textarea
        {...props.textAreaProps}
        className='block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
      />
      <div>{props.error}</div>
    </>
  )
}
