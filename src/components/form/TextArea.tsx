import { type InputProps } from '@/components/form/Input'
import { type FormEvent } from 'react'

type TextareaProps = Pick<InputProps, 'value' | 'label' | 'placeholder'> & {
  onChange: (e: FormEvent<HTMLTextAreaElement>) => void
  rows: number
}

export default function TextArea(props: TextareaProps) {
  return (
    <textarea
      name={props.label}
      rows={props.rows}
      id={props.label}
      className='block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  )
}
