import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface SectionProps {
  title: string
  children: React.ReactNode
  expanded: boolean
  onToggle: () => void
}

export function Section({ title, children, expanded, onToggle }: SectionProps) {
  return (
    <section className="mb-8">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4"
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <ChevronDownIcon 
          className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {expanded && (
        <div className="animate-fadeIn">
          {children}
        </div>
      )}
    </section>
  )
}