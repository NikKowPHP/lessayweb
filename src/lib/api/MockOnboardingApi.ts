import localforage from 'localforage'
import type { LanguageCode } from '@/constants/languages'
import type {
  IOnboardingApi,
  AssessmentQuestion,
  LanguagePreferences,
  AssessmentResultResponse,
} from './interfaces/IOnboardingApi'

// Configure localforage instance for onboarding data
const onboardingStorage = localforage.createInstance({
  name: 'lessay',
  storeName: 'onboarding',
})

const STORAGE_KEYS = {
  LANGUAGES: 'language_preferences',
  ASSESSMENT: 'assessment_progress',
} as const

// Mock assessment questions
const MOCK_QUESTIONS: AssessmentQuestion[] = [
  {
    id: '1',
    type: 'pronunciation',
    content: 'Please pronounce: "Hello"',
  },
  {
    id: '2',
    type: 'grammar',
    content: 'Complete the sentence: "I ___ to the store yesterday."',
    options: ['go', 'went', 'gone', 'going'],
  },
  {
    id: '3',
    type: 'vocabulary',
    content: 'What is this object?',
    options: ['apple', 'banana', 'orange', 'grape'],
  },
]

export class MockOnboardingApi implements IOnboardingApi {
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async submitLanguages(
    nativeLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ) {
    await this.delay(1000)

    const languagePrefs: LanguagePreferences = {
      nativeLanguage,
      targetLanguage,
    }

    // Store in localforage
    await onboardingStorage.setItem(STORAGE_KEYS.LANGUAGES, languagePrefs)

    return {
      data: {
        success: true,
        ...languagePrefs,
      },
    }
  }

  async getStoredLanguages() {
    try {
      return await onboardingStorage.getItem<LanguagePreferences>(
        STORAGE_KEYS.LANGUAGES
      )
    } catch {
      return null
    }
  }

  async startAssessment() {
    await this.delay(1000)

    const assessmentId = `mock-${Date.now()}`
    
    // Store assessment ID for later use
    await onboardingStorage.setItem(STORAGE_KEYS.ASSESSMENT, {
      id: assessmentId,
      startedAt: new Date().toISOString(),
    })

    return {
      data: {
        assessmentId,
        questions: MOCK_QUESTIONS,
      },
    }
  }

  async submitAssessment(assessmentData: any) {
    await this.delay(1000)

    // Clear assessment progress from storage
    await onboardingStorage.removeItem(STORAGE_KEYS.ASSESSMENT)

    return {
      data: {
        success: true,
        score: 85,
        recommendations: {
          pronunciation: 'Good',
          grammar: 'Needs improvement',
          vocabulary: 'Excellent',
        },
      },
    }
  }

  async getAssessmentResults(assessmentId: string): Promise<AssessmentResultResponse> {
    await this.delay(1000)
    console.log('assessmentId', assessmentId)

    // Return mock assessment results
    return {
      pronunciation: 75,
      vocabulary: 80,
      grammar: 70,
      comprehension: 85,
      overall: 77.5,
      level: 'intermediate',
      nextSteps: [
        'Practice pronunciation of "th" sounds',
        'Review past tense conjugations',
        'Build vocabulary in business context'
      ]
    }
  }
} 