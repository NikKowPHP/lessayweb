import localforage from 'localforage'
import type { LanguageCode } from '@/constants/languages'
import type {
  IOnboardingApi,
  AssessmentQuestion,
  LanguagePreferences,
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

interface MockRoute {
  path: string
  method: 'GET' | 'POST'
  response: any
}

export class MockOnboardingApi implements IOnboardingApi {
  private mockRoutes: MockRoute[] = [
    {
      path: '/pronunciation/prompt',
      method: 'GET',
      response: {
        prompt_text: 'Please read the following text: "The quick brown fox jumps over the lazy dog."',
        target_phonemes: ['ð', 'θ', 'æ'],
        difficulty_level: 'intermediate'
      }
    },
    {
      path: '/vocabulary/prompt',
      method: 'GET',
      response: {
        image_url: 'https://example.com/mock-image.jpg',
        topic: 'daily_routine',
        expected_vocabulary: ['breakfast', 'work', 'commute']
      }
    },
    {
      path: '/grammar/prompt',
      method: 'GET',
      response: {
        prompt_text: 'Describe your daily routine using present tense verbs.',
        target_structures: ['simple present', 'frequency adverbs'],
        example_sentence: 'I usually wake up at 7 AM.'
      }
    },
    {
      path: '/comprehension/prompt',
      method: 'GET',
      response: {
        youtube_video_id: 'dQw4w9WgXcQ',
        title: 'Daily Conversations in German',
        description: 'Basic conversations in a café setting',
        duration_seconds: 180,
        language_code: 'de',
        difficulty: 'A2',
        questions: [
          {
            id: 'q1',
            question: 'Describe what happened when the customer first entered the café.',
            context_timestamp: '00:15',
            difficulty: 'A2',
            expected_concepts: ['greeting', 'politeness', 'time_of_day', 'customer_service'],
            evaluation_criteria: {
              content_relevance: 0.4,
              language_accuracy: 0.3,
              vocabulary_usage: 0.3
            },
            hint: 'Focus on the interaction between the customer and staff'
          }
        ]
      }
    },
    {
      path: '/pronunciation/submit',
      method: 'POST',
      response: {
        assessment_id: `mock_${Date.now()}`,
        step_id: `pronunciation_${Date.now()}`,
        timestamp: new Date().toISOString(),
        is_completed: true,
        metrics: {
          accuracy: 0.78,
          fluency: 0.72,
          clarity: 0.70,
        },
        overall_score: 0.75,
        phoneme_scores: {
          'æ': 0.92,
          'ð': 0.78,
          'ŋ': 0.85
        },
        detected_issues: [
          {
            phoneme: 'th',
            description: 'Difficulty with th sound',
            confidence: 0.85,
            examples: ['think', 'through'],
            suggestion: 'Place tongue between teeth'
          }
        ],
        next_prompt_text: 'Please read: "The quick brown fox jumps over the lazy dog."',
        phoneme_highlights: {
          the: 'ð',
          think: 'θ'
        }
      }
    },
    {
      path: '/vocabulary/submit',
      method: 'POST',
      response: {
        assessment_id: `mock_${Date.now()}`,
        step_id: `vocabulary_${Date.now()}`,
        timestamp: new Date().toISOString(),
        is_completed: true,
        metrics: {
          diversity: 0.78,
          complexity: 0.70,
          appropriateness: 0.85,
        },
        vocabulary_score: 0.82,
        unique_words_used: 45,
        detected_vocabulary: {
          advanced: ['comprehensive', 'elaborate'],
          intermediate: ['discuss', 'explain'],
          basic: ['go', 'see', 'do']
        },
        missing_key_vocabulary: ['essential', 'fundamental'],
        next_image_prompt_url: 'https://example.com/mock-image.jpg',
        topic_coverage: {
          daily_life: 0.85,
          work: 0.75,
          travel: 0.80
        }
      }
    },
    {
      path: '/grammar/submit',
      method: 'POST',
      response: {
        assessment_id: `mock_${Date.now()}`,
        step_id: `grammar_${Date.now()}`,
        timestamp: new Date().toISOString(),
        is_completed: true,
        metrics: {
          accuracy: 0.80,
          complexity: 0.75,
          variety: 0.85,
        },
        grammar_score: 0.78,
        detected_errors: [
          {
            error_type: 'tense',
            description: 'Incorrect past participle',
            context: 'have went',
            suggestion: 'have gone',
            confidence: 0.95
          }
        ],
        grammar_point_scores: {
          past_tense: 0.85,
          present_perfect: 0.65,
          conditionals: 0.55
        },
        next_question_prompt: 'Describe your daily routine using present tense verbs.',
        correctly_used_structures: [
          'simple present',
          'past simple',
          'basic modals'
        ],
        complexity_metrics: {
          sentence_length: 8,
          clause_count: 2,
          subordination_index: 0.4
        }
      }
    },
    {
      path: '/assessment/final',
      method: 'GET',
      response: {
        assessment_id: `mock_final_${Date.now()}`,
        timestamp: new Date().toISOString(),
        language_proficiency: {
          overall_level: 'B1',
          detailed_levels: {
            speaking: 'B1',
            listening: 'B1',
            pronunciation: 'B1'
          },
          cefr_details: {
            can_do_statements: [
              'Can express opinions on abstract topics',
              'Can describe experiences and events'
            ],
            limitations: [
              'May struggle with complex grammar',
              'Limited vocabulary in specific domains'
            ]
          }
        },
        pronunciation_analysis: {
          overall_score: 0.75,
          detailed_scores: {
            accuracy: 0.78,
            fluency: 0.72,
            clarity: 0.70
          },
          specific_issues: [
            {
              type: 'pronunciation',
              phoneme: 'th',
              description: 'Difficulty with th sound',
              confidence: 0.85,
              context: 'think, through',
              suggestion: 'Place tongue between teeth',
              examples_found: ['think', 'through'],
              search_prompts: [
                {
                  search_query: 'th sound pronunciation practice',
                  resource_type: 'video',
                  target_skill: 'pronunciation',
                  difficulty: 'intermediate',
                  language_code: 'en',
                  keywords: ['th sound', 'pronunciation', 'practice'],
                  description: 'Practice exercises for th sound'
                }
              ]
            }
          ]
        },
        // ... rest of the final assessment response structure
        // (copying the exact same structure as in the Dart code)
      }
    }
  ]

  private async handleMockRequest(path: string, method: 'GET' | 'POST', body?: any): Promise<any> {
    await this.delay(1000)
    
    const route = this.mockRoutes.find(r => 
      r.path === path && r.method === method
    )

    if (!route) {
      throw new Error(`Mock route not found: ${method} ${path}`)
    }

    if (typeof route.response === 'function') {
      return route.response(body)
    }

    return route.response
  }

  async submitLanguages(nativeLanguage: LanguageCode, targetLanguage: LanguageCode) {
    const response = await this.handleMockRequest('/languages', 'POST', {
      nativeLanguage,
      targetLanguage
    })

    await onboardingStorage.setItem(STORAGE_KEYS.LANGUAGES, {
      nativeLanguage,
      targetLanguage
    })

    return { data: response }
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
    const response = await this.handleMockRequest('/assessment/initialize', 'POST')
    
    const assessmentId = `mock-${Date.now()}`
    await onboardingStorage.setItem(STORAGE_KEYS.ASSESSMENT, {
      id: assessmentId,
      startedAt: new Date().toISOString(),
    })

    return {
      data: {
        assessmentId,
        questions: MOCK_QUESTIONS,
        ...response
      }
    }
  }

  async submitAssessment(assessmentData: any) {
    const response = await this.handleMockRequest('/assessment/submit', 'POST', assessmentData)
    await onboardingStorage.removeItem(STORAGE_KEYS.ASSESSMENT)
    return { data: response }
  }

  async getAssessmentResults(assessmentId: string) {
    return this.handleMockRequest(`/assessment/${assessmentId}/results`, 'GET')
  }

  async getPronunciationPrompt() {
    return this.handleMockRequest('/pronunciation/prompt', 'GET')
  }

  async submitPronunciationAssessment(data: any) {
    return this.handleMockRequest('/pronunciation/submit', 'POST', data)
  }

  async getVocabularyPrompt() {
    return this.handleMockRequest('/vocabulary/prompt', 'GET')
  }

  async submitVocabularyAssessment(data: any) {
    return this.handleMockRequest('/vocabulary/submit', 'POST', data)
  }

  async getGrammarPrompt() {
    return this.handleMockRequest('/grammar/prompt', 'GET')
  }

  async submitGrammarAssessment(data: any) {
    return this.handleMockRequest('/grammar/submit', 'POST', data)
  }

  async getComprehensionPrompt() {
    return this.handleMockRequest('/comprehension/prompt', 'GET')
  }

  async submitComprehensionAssessment(data: any) {
    return this.handleMockRequest('/comprehension/submit', 'POST', data)
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
} 