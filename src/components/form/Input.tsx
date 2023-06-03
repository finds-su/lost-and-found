import classNames from 'classnames/dedupe'
import { type ComponentProps } from 'react'

export interface InputProps {
  label: string
  hideLabel?: boolean
  isOptional?: boolean
  inputProps: ComponentProps<'input'>
}

export default function Input(props: InputProps) {
  return (
    <div
      className={classNames('text-left', !props.hideLabel || props.isOptional ? 'h-14' : 'h-9.5')}
    >
      {(!props.hideLabel || props.isOptional) && (
        <div className='mb-1.5 flex justify-between'>
          {!props.hideLabel ? (
            <label
              htmlFor={props.label}
              className={classNames(
                props.hideLabel && 'sr-only',
                'block text-sm font-medium text-gray-700',
              )}
            >
              {props.label}
            </label>
          ) : (
            <div />
          )}
          {props.isOptional && <span className='text-sm text-gray-500'>Необязательное поле</span>}
        </div>
      )}
      <input
        {...props.inputProps}
        className='block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
      />
    </div>
  )
}
