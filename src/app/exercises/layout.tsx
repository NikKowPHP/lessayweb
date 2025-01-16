'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { ExerciseNavigation } from '@/components/exercises/ExerciseNavigation'
import { ExerciseProgress } from '@/components/exercises/ExerciseProgress'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { rehydrateExercisingState, selectSessionLoaded } from '@/store/slices/exercisingSlice'

export default function ExerciseLayout({
  children
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()
  const sessionLoaded = useAppSelector(selectSessionLoaded)

  useEffect(() => {
    if (!sessionLoaded) {
      dispatch(rehydrateExercisingState())
    }
  }, [sessionLoaded, dispatch])

  if (!sessionLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <ExerciseNavigation />
          <ExerciseProgress />
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}