'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  updateUserLanguages,
  completeUserOnboarding,
} from '@/store/slices/userSlice'
import { rehydrateState, submitLanguagePreferences } from '@/store/slices/onboardingSlice'
import type { LanguageCode } from '@/constants/languages'
import { logger } from '@/lib/utils/logger'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const onboardingState = useAppSelector(state => state.onboarding)
  useEffect(() => {
    dispatch(rehydrateState())
  }, [dispatch])
  useEffect(() => {
    // dispatch(getPrompt(AssessmentType.Pronunciation))
    console.log('onboardingState', onboardingState)
  }, [onboardingState])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nativeLanguage || !targetLanguage) {
      setError('Please select both languages')
      return
    }

    if (nativeLanguage === targetLanguage) {
      setError('Native and target languages must be different')
      return
    }

    try {
      await dispatch(
        submitLanguagePreferences({
          nativeLanguage: nativeLanguage as LanguageCode,
          targetLanguage: targetLanguage as LanguageCode,
        })
      ).unwrap()

      await dispatch(
        updateUserLanguages({
          native: nativeLanguage,
          target: targetLanguage,
        })
      ).unwrap()

      // Instead of completing onboarding, redirect to assessment intro
      router.push('/onboarding/assessment/intro')
    } catch (err) {
      setError('Failed to save language preferences')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Choose Your Languages
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Select your native language and the language you want to learn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {/* Native Language Select */}
            <div>
              <label
                htmlFor="nativeLanguage"
                className="block text-sm font-medium text-gray-700"
              >
                I speak
              </label>
              <select
                id="nativeLanguage"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                required
              >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Language Select */}
            <div>
              <label
                htmlFor="targetLanguage"
                className="block text-sm font-medium text-gray-700"
              >
                I want to learn
              </label>
              <select
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                required
              >
                <option value="">Select language to learn</option>
                {LANGUAGES.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    disabled={lang.code === nativeLanguage}
                  >
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
