import { ComponentPropsWithoutRef } from 'react'
import type { IconType } from 'react-icons'

import clsx from 'clsx'

type ButtonProps = {
  icon?: IconType
  variant?: 'default' | 'outline' | 'text' | 'primary'
} & ComponentPropsWithoutRef<'button'>
export default function Button({
  children,
  className = '',
  icon: Icon,
  variant = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-[38px] min-w-[38px] items-center rounded px-3 py-1.5 transition-colors',
        className,
        {
          'bg-gray-50 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-900':
            variant === 'default',
          'border border-gray-300 bg-gray-50 text-black hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700':
            variant === 'outline',
          'bg-transparent text-black hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700':
            variant === 'text',
          'bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:text-white disabled:bg-transparent disabled:text-gray-300 disabled:shadow-none dark:disabled:text-gray-600':
            variant === 'primary',
        },
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={clsx('text-lg', {
            'mr-1': !!children,
          })}
        />
      )}
      {children}
    </button>
  )
}
