import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
  color?: 'primary' | 'success' | 'warning' | 'error'
  showAnimation?: boolean
}

export function CircularProgress({
  value,
  size = 100,
  strokeWidth = 8,
  label,
  className,
  color = 'primary',
  showAnimation = true
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const requestRef = useRef<number | null>(null)

  // Calculate circle properties
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (progress / 100) * circumference

  const colorClasses = {
    primary: 'text-primary-500 stroke-primary-500',
    success: 'text-green-500 stroke-green-500',
    warning: 'text-yellow-500 stroke-yellow-500',
    error: 'text-red-500 stroke-red-500'
  }

  // Animate progress
  useEffect(() => {
    if (!showAnimation) {
      setProgress(value)
      return
    }

    const animateProgress = (timestamp: number) => {
      if (!progressRef.current) progressRef.current = timestamp
      const elapsed = timestamp - progressRef.current

      // Animation duration: 1000ms
      const progress = Math.min(elapsed / 1000, 1)
      setProgress(value * progress)

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animateProgress)
      }
    }

    requestRef.current = requestAnimationFrame(animateProgress)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [value, showAnimation])

  return (
    <div 
      className={cn('relative inline-flex items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700"
          fill="none"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className={cn(
            'transition-all duration-300 ease-out',
            colorClasses[color]
          )}
          fill="none"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
        />
      </svg>
      
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'text-lg font-semibold',
            colorClasses[color]
          )}>
            {label}
          </span>
        </div>
      )}
    </div>
  )
}