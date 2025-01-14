'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { rehydrateState } from '@/store/slices/onboardingSlice'
import { useEffect } from 'react'

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading, error } = useAppSelector((state) => state.onboarding)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(rehydrateState())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                {children}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}