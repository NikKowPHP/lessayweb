import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'soft'
  rounded?: 'default' | 'full'
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

export function Badge({
  children,
  color = 'default',
  size = 'md',
  variant = 'solid',
  rounded = 'default',
  icon,
  removable,
  onRemove,
  className,
  ...props
}: BadgeProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center font-medium'

  // Size variations
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  // Rounded variations
  const roundedStyles = {
    default: 'rounded',
    full: 'rounded-full'
  }

  // Color and variant combinations
  const colorVariantStyles = {
    solid: {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      primary: 'bg-primary-500 text-white dark:bg-primary-600',
      secondary: 'bg-secondary-500 text-white dark:bg-secondary-600',
      success: 'bg-green-500 text-white dark:bg-green-600',
      warning: 'bg-yellow-500 text-white dark:bg-yellow-600',
      error: 'bg-red-500 text-white dark:bg-red-600',
      info: 'bg-blue-500 text-white dark:bg-blue-600',
      red: 'bg-red-500 text-white dark:bg-red-600',
      blue: 'bg-blue-500 text-white dark:bg-blue-600',
      green: 'bg-green-500 text-white dark:bg-green-600',
      yellow: 'bg-yellow-500 text-white dark:bg-yellow-600',
      purple: 'bg-purple-500 text-white dark:bg-purple-600',
      gray: 'bg-gray-500 text-white dark:bg-gray-600'
    },
    outline: {
      default: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
      primary: 'border border-primary-500 text-primary-700 dark:text-primary-300',
      secondary: 'border border-secondary-500 text-secondary-700 dark:text-secondary-300',
      success: 'border border-green-500 text-green-700 dark:text-green-300',
      warning: 'border border-yellow-500 text-yellow-700 dark:text-yellow-300',
      error: 'border border-red-500 text-red-700 dark:text-red-300',
      info: 'border border-blue-500 text-blue-700 dark:text-blue-300',
      red: 'border border-red-500 text-red-700 dark:text-red-300',
      blue: 'border border-blue-500 text-blue-700 dark:text-blue-300',
      green: 'border border-green-500 text-green-700 dark:text-green-300',
      yellow: 'border border-yellow-500 text-yellow-700 dark:text-yellow-300',
      purple: 'border border-purple-500 text-purple-700 dark:text-purple-300',
      gray: 'border border-gray-500 text-gray-700 dark:text-gray-300'
    },
    soft: {
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // Icon size based on badge size
  const iconSizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <span
      className={cn(
        baseStyles,
        sizeStyles[size],
        roundedStyles[rounded],
        colorVariantStyles[variant][color],
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      {icon && (
        <span className={cn('mr-1.5 -ml-0.5', iconSizeStyles[size])}>
          {icon}
        </span>
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'ml-1.5 -mr-0.5 hover:opacity-75 focus:outline-none',
            iconSizeStyles[size]
          )}
          aria-label="Remove badge"
        >
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  )
}