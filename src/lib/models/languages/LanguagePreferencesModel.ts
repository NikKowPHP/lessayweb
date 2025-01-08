import type { LanguageCode } from '@/constants/languages'

export interface LanguagePreferences {
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
}

export interface LanguagePreferencesSubmission {
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
  timestamp?: string
}

export interface LanguagePreferencesState extends LanguagePreferences {
  isSubmitting: boolean
  error: string | null
  preferences_id?: string
}

export const initialLanguagePreferencesState: LanguagePreferencesState = {
  nativeLanguage: '' as LanguageCode,
  targetLanguage: '' as LanguageCode,
  isSubmitting: false,
  error: null
}

export interface LanguagePreferencesResponse {
  status: string
  data: {
    nativeLanguage: LanguageCode
    targetLanguage: LanguageCode
    timestamp: string
    preferences_id: string
  }
}

export interface LanguagePreferenceRequest {
  nativeLanguage: LanguageCode
  targetLanguage: LanguageCode
}