import { Icon } from "@iconify/react/dist/iconify.js"

interface ToastProps {
  message: string
  type: 'success' | 'info'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`rounded-lg px-4 py-3 shadow-lg ${
          type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Icon
            icon={type === 'success' ? 'mdi:check-circle' : 'mdi:information'}
            className="h-5 w-5"
          />
          <p>{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <Icon icon="mdi:close" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}