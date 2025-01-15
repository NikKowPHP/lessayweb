import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  elevation?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  elevation = 'sm',
  hoverable = false,
  ...props
}, ref) => {
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        elevationClasses[elevation],
        hoverable && 'transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'