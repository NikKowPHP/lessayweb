import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface ErrorAlertProps {
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  dismissible?: boolean
  variant?: 'error' | 'warning'
}

export function ErrorAlert({
  title,
  message,
  action,
  className,
  dismissible = true,
  variant = 'error'
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const variantClasses = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
  }

  const iconClasses = {
    error: 'text-red-500 dark:text-red-400',
    warning: 'text-yellow-500 dark:text-yellow-400'
  }

  const textClasses = {
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-yellow-800 dark:text-yellow-200'
  }

  const buttonClasses = {
    error: 'text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300',
    warning: 'text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300'
  }

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4 relative',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon 
            className={cn('h-5 w-5', iconClasses[variant])} 
          />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={cn(
            'text-sm font-medium mb-1',
            textClasses[variant]
          )}>
            {title}
          </h3>
          <div className={cn(
            'text-sm opacity-90',
            textClasses[variant]
          )}>
            {message}
          </div>
          {action && (
            <div className="mt-3">
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  'text-sm font-medium underline',
                  buttonClasses[variant]
                )}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            className={cn(
              'ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 focus:ring-offset-2',
              buttonClasses[variant],
              `focus:ring-${variant === 'error' ? 'red' : 'yellow'}-500`
            )}
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}