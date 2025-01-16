'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { selectResults } from '@/store/slices/exercisingSlice'
import { Icon } from '@iconify/react'

export default function ExerciseResultsPage() {
  const router = useRouter()
  const results = useAppSelector(selectResults)

  useEffect(() => {
    if (!results) {
      router.replace('/exercises')
    }
  }, [results, router])

  if (!results) return null

  const { scores, feedback } = results

  return (
    <div className="space-y-8 p-6">
      {/* Overall Score Section */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Exercise Results</h2>
        
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(scores).map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg bg-gray-50 p-4 text-center"
            >
              <h3 className="text-sm font-medium text-gray-500 capitalize">
                {key}
              </h3>
              <div className="mt-2 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Detailed Feedback</h2>
        
        <div className="mt-4 space-y-4">
          {feedback.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg border p-4 ${
                item.severity === 'high'
                  ? 'border-red-200 bg-red-50'
                  : item.severity === 'medium'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon
                  icon={
                    item.severity === 'high'
                      ? 'mdi:alert-circle'
                      : item.severity === 'medium'
                      ? 'mdi:alert'
                      : 'mdi:information'
                  }
                  className={`h-5 w-5 ${
                    item.severity === 'high'
                      ? 'text-red-500'
                      : item.severity === 'medium'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }`}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {item.type}
                    </span>
                    {item.segmentIndex !== undefined && (
                      <span className="text-sm text-gray-500">
                        (Segment {item.segmentIndex + 1})
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-700">{item.issue}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Suggestion: {item.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => router.back()}
          className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/learning/path')}
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
        >
          Continue Learning
        </button>
      </div>
    </div>
  )
}
