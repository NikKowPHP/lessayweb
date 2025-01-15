import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
  className?: string
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    const positions = {
      top: {
        top: triggerRect.top - tooltipRect.height - 8,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      },
      right: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.right + 8
      },
      bottom: {
        top: triggerRect.bottom + 8,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      },
      left: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.left - tooltipRect.width - 8
      }
    }

    setTooltipPosition(positions[position])
  }

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      // Calculate position after tooltip is visible
      requestAnimationFrame(calculatePosition)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => {
        calculatePosition()
      }

      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', calculatePosition)

      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', calculatePosition)
      }
    }
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
      {isVisible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            'fixed z-50 px-2 py-1 text-sm text-white bg-gray-900 dark:bg-gray-700',
            'rounded shadow-lg pointer-events-none transition-opacity duration-200',
            'max-w-xs break-words',
            className
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left
          }}
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45',
              {
                'top-full -translate-y-1': position === 'bottom',
                'bottom-full translate-y-1': position === 'top',
                '-right-1': position === 'left',
                '-left-1': position === 'right'
              }
            )}
          />
        </div>,
        document.body
      )}
    </div>
  )
}