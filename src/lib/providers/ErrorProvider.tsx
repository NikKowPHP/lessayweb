'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ErrorContextType {
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {error && (
        <div className="fixed top-16 left-0 right-0 z-50 flex justify-center">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md shadow-lg flex items-center justify-between max-w-md w-full mx-4">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-4 text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = () => {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}
