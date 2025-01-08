import localforage from 'localforage'
import type { LanguageCode } from '@/constants/languages'
import type {
  IOnboardingApi,
} from '../interfaces/IOnboardingApi'
import { LanguagePreferenceRequest, LanguagePreferencesResponse } from '@/lib/models/languages/LanguagePreferencesModel'

// Configure localforage instance for onboarding data
const onboardingStorage = localforage.createInstance({
  name: 'lessay',
  storeName: 'onboarding',
})

const STORAGE_KEYS = {
  LANGUAGES: 'language_preferences',
  ASSESSMENT: 'assessment_progress',
} as const



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
      path: '/final/submit',
      method: 'POST',
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
        grammar_analysis: {
          overall_score: 0.72,
          detailed_scores: {
            accuracy: 0.75,
            complexity: 0.70,
            variety: 0.72
          },
          specific_issues: [
            {
              type: 'grammar',
              category: 'verb_tense',
              description: 'Incorrect use of past participle',
              confidence: 0.90,
              context: 'I have went',
              suggestion: 'Use "gone" instead of "went"',
              examples_found: ['I have went', 'She has went'],
              search_prompts: [
                {
                  search_query: 'present perfect tense practice',
                  resource_type: 'exercise',
                  target_skill: 'grammar',
                  difficulty: 'intermediate',
                  language_code: 'en',
                  keywords: ['present perfect', 'past participle'],
                  description: 'Practice exercises for present perfect tense'
                }
              ]
            }
          ]
        },
        vocabulary_analysis: {
          overall_score: 0.78,
          active_vocabulary_size: 2500,
          topic_proficiency: {
            daily_life: 0.85,
            work: 0.75,
            travel: 0.70
          },
          word_usage_patterns: {
            variety: 0.75,
            complexity: 0.70,
            appropriateness: 0.80
          }
        },
        fluency_metrics: {
          overall_score: 0.76,
          detailed_scores: {
            speed: 0.75,
            pausing: 0.78,
            rhythm: 0.74
          },
          speech_characteristics: {
            words_per_minute: 120,
            average_pause_duration: 0.5,
            longest_fluent_segment: 45
          }
        },
        recommendations: {
          priority_areas: [
            {
              skill: 'pronunciation',
              focus: 'th sounds',
              importance: 'high',
              current_level: 0.65,
              target_level: 0.85,
              exercises: ['minimal_pairs', 'shadow_reading']
            },
            {
              skill: 'grammar',
              focus: 'past tense',
              importance: 'medium',
              current_level: 0.55,
              target_level: 0.75,
              exercises: ['past_tense_exercises', 'conditional_exercises']
            },
            {
              skill: 'comprehension',
              focus: 'cultural awareness',
              importance: 'medium',
              current_level: 0.65,
              target_level: 0.85,
              exercises: ['cultural_awareness_exercises', 'contextual_understanding_exercises']
            }
          ],
          learning_path_suggestions: {
            recommended_level: 'B1',
            estimated_study_time: '3 months',
            focus_distribution: {
              pronunciation: 0.4,
              grammar: 0.3,
              vocabulary: 0.3
            }
          },
          feedback: {
            strengths: [
              'Good vocabulary base',
              'Clear pronunciation of vowels',
              'Basic grammar structures well formed'
            ],
            improvements: [
              'Focus needed on sentence structure',
              'Practice th sounds',
              'Expand vocabulary in professional contexts'
            ],
            level: 'B1'
          }
        },
        comparative_metrics: {
          peer_group: 'B1_learners',
          percentile_rankings: {
            overall: 75,
            pronunciation: 70,
            grammar: 80,
            vocabulary: 75
          }
        },
        comprehension_analysis: {
          overall_score: 0.75,
          question_analyses: [
            {
              question_id: 'q1',
              score: 0.82,
              explanation: 'Good understanding of the café interaction, but missed some cultural nuances',
              criteria_scores: {
                content_relevance: 0.85,
                language_accuracy: 0.80,
                vocabulary_usage: 0.75
              },
              detected_concepts: ['greeting', 'ordering', 'politeness'],
              missing_concepts: ['time_of_day_specific_greeting'],
              improvements: {
                cultural: 'Consider using more formal greetings for first interactions',
                vocabulary: 'Include specific time-of-day greetings'
              },
              confidence_score: 0.85,
              language_analysis: {
                grammar_accuracy: 0.85,
                vocabulary_richness: 0.75,
                coherence: 0.80,
                grammar_errors: [
                  {
                    error_type: 'word_order',
                    description: 'Incorrect position of time expression',
                    context: 'in morning the',
                    suggestion: 'in the morning',
                    confidence: 0.95
                  }
                ],
                vocabulary_usage: {
                  greetings: 2,
                  time_expressions: 1,
                  politeness_markers: 3
                }
              },
              content_analysis: {
                relevance: 0.85,
                completeness: 0.80,
                contextual_understanding: 0.75,
                key_points_covered: [
                  'initial_greeting',
                  'customer_approach',
                  'staff_response'
                ],
                missed_points: [
                  'time_specific_greeting_choice'
                ],
                topic_alignment: {
                  'café_interaction': 0.90,
                  'formal_greetings': 0.70,
                  'customer_service': 0.85
                }
              }
            }
          ],
          skill_breakdown: {
            listening: 0.80,
            contextual_understanding: 0.75,
            cultural_awareness: 0.70,
            language_production: 0.78
          },
          misunderstood_concepts: ['formal_vs_informal', 'time_specific_greetings'],
          confidence_metrics: {
            overall_confidence: 0.75,
            response_time: 0.80,
            answer_coherence: 0.85
          }
        }
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

  async submitLanguages(data: LanguagePreferenceRequest) {
    const response = await this.handleMockRequest('/languages', 'POST', data)

    await onboardingStorage.setItem(STORAGE_KEYS.LANGUAGES, response)

    return { data: response }
  }

  async getStoredLanguages() {
    try {
      return await onboardingStorage.getItem<LanguagePreferencesResponse>(
        STORAGE_KEYS.LANGUAGES
      )
    } catch {
      return null
    }
  }

 
  async submitAssessment(assessmentData: any) {
    const response = await this.handleMockRequest('/assessment/submit', 'POST', assessmentData)
    await onboardingStorage.removeItem(STORAGE_KEYS.ASSESSMENT)
    return { data: response }
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

  async submitFinalAssessment(assessmentId: string) {
    return this.handleMockRequest('/final/submit', 'POST', { assessmentId })
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
} 