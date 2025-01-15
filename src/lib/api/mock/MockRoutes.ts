import { LearningPath } from "@/lib/types/learningPath"

export interface MockRoute {
    path: string
    method: 'GET' | 'POST'
    response: any
  }

export const mockRoutes: MockRoute[] = [
    {
      path: '/pronunciation/prompt',
      method: 'GET',
      response: {
        status: 'success',
        data: {
          prompt_text: 'Please read the following text: "The quick brown fox jumps over the lazy dog."',
          target_phonemes: ['ð', 'θ', 'æ'],
          difficulty_level: 'intermediate'
        }
      }
    },
    {
      path: '/vocabulary/prompt',
      method: 'GET',
      response: {
        status: 'success',
        data: {
          image_url: '/images/image.jpeg',
          topic: 'daily_routine',
          expected_vocabulary: ['breakfast', 'work', 'commute'],
          categories: [
            {
              name: 'Morning Activities',
              words: ['breakfast', 'shower', 'dress'],
              description: 'Activities typically done in the morning'
            }
          ],
          hints: ['Think about what you do when you first wake up'],
          difficulty_level: 'intermediate'
        }
      }
    },
    {
      path: '/grammar/prompt',
      method: 'GET',
      response: {
        status: 'success',
        data: {
          prompt_text: 'Describe your daily routine using present tense verbs.',
          target_structures: ['simple present', 'frequency adverbs'],
          example_sentence: 'I usually wake up at 7 AM.',
          difficulty_level: 'intermediate',
          grammar_points: {
            'simple present': ['regular verbs', 'irregular verbs'],
            'frequency adverbs': ['always', 'usually', 'sometimes']
          }
        }
      }
    },
    {
      path: '/comprehension/prompt',
      method: 'GET',
      response: {
        status: 'success',
        data: {
          youtube_video_id: 'dQw4w9WgXcQ',
          title: 'Ordering at a German Café',
          description: 'Learn how to order food and drinks in a typical German café setting.',
          duration_seconds: 180,
          language_code: 'de',
          difficulty: 'A2',
          instructions: {
            before_video: 'You will watch a conversation in a German café. Before starting, review these key phrases: "bestellen" (to order), "Getränk" (drink), "Speisekarte" (menu).',
            during_video: 'Focus on: 1) Greeting expressions 2) Ordering phrases 3) Numbers and prices 4) Politeness markers',
            after_video: 'Answer each question using complete sentences. You can replay specific parts of the video up to 3 times.'
          },
          video_settings: {
            can_pause: true,
            max_replays: 3,
            show_subtitles: true,
            playback_speed_options: [0.75, 1, 1.25, 1.5]
          },
          transcript_segments: [
            {
              start_time: 0,
              end_time: 5,
              text: 'Guten Morgen! Willkommen im Café Sonne.'
            },
            {
              start_time: 5,
              end_time: 10,
              text: 'Guten Morgen! Haben Sie eine Speisekarte?'
            },
            {
              start_time: 10,
              end_time: 15,
              text: 'Ja, hier bitte. Möchten Sie zuerst ein Getränk?'
            },
            {
              start_time: 15,
              end_time: 20,
              text: 'Ja, einen großen Cappuccino, bitte.'
            },
            {
              start_time: 20,
              end_time: 25,
              text: 'Gerne. Möchten Sie auch etwas zum Frühstück?'
            },
            {
              start_time: 25,
              end_time: 30,
              text: 'Gerne. Möchten Sie auch etwas zum Essen?'
            }
          ],
          questions: [
            {
              id: 'q1',
              question: 'How did the server greet the customer? What time of day was it?',
              context_timestamp: '00:15',
              timestamp_seconds: 15,
              difficulty: 'A2',
              question_type: 'open_ended',
              expected_concepts: ['morning_greeting', 'politeness'],
              hint: 'Listen to the first greeting and think about when we use "Guten Morgen"'
            },
            {
              id: 'q2',
              question: 'What did the customer order? Include any specific details mentioned.',
              context_timestamp: '00:20',
              timestamp_seconds: 20,
              difficulty: 'A2',
              question_type: 'open_ended',
              expected_concepts: ['beverage_order', 'politeness_marker'],
              hint: 'Focus on the specific drink ordered and how it was requested'
            },
            {
              id: 'q3',
              question: 'What additional question did the server ask? Why is this question important?',
              context_timestamp: '00:25',
              timestamp_seconds: 25,
              difficulty: 'A2',
              question_type: 'open_ended',
              expected_concepts: ['follow_up_question', 'upselling'],
              hint: 'Think about what else the server offered besides drinks'
            }
          ]
        }
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
    },
    {
      path: '/learning-path/create',
      method: 'POST',
      response: {
        status: 'success',
        data: {
          id: `path_${Date.now()}`,
          userId: 'mock_user',
          targetLanguage: 'de',
          currentLevel: 'B1',
          targetLevel: 'B2',
          
          // Complete skills structure
          skills: {
            pronunciation: {
              currentLevel: 0.65,
              targetLevel: 0.85,
              criticalPoints: ['th_sounds', 'intonation', 'stress_patterns'],
              progress: 0.45
            },
            grammar: {
              currentLevel: 0.70,
              targetLevel: 0.85,
              criticalPoints: ['past_tense', 'conditionals', 'modal_verbs'],
              progress: 0.55
            },
            vocabulary: {
              currentLevel: 0.75,
              targetLevel: 0.90,
              criticalPoints: ['business_terms', 'academic_vocabulary', 'idioms'],
              progress: 0.60
            },
            comprehension: {
              currentLevel: 0.68,
              targetLevel: 0.88,
              criticalPoints: ['native_speech', 'regional_accents', 'rapid_speech'],
              progress: 0.50
            }
          },

          // Organized exercises by category
          exercises: {
            critical: [
              {
                id: 'ex_1',
                title: 'Master TH Sounds',
                description: 'Focus on improving th sound pronunciation with native speaker examples',
                type: 'pronunciation',
                difficulty: 'B1',
                status: 'available',
                duration: '20min',
                focusAreas: ['th_sounds', 'phoneme_practice'],
                prerequisites: [],
                completion: {
                  required: { accuracy: 0.8, attempts: 5 },
                  current: { accuracy: 0, attempts: 0 }
                },
                uiData: {
                  icon: 'pronunciation-exercise',
                  color: 'blue',
                  progressIndicator: 'circular'
                }
              },
              {
                id: 'ex_2',
                title: 'Past Perfect Practice',
                description: 'Master the past perfect tense through real-world scenarios',
                type: 'grammar',
                difficulty: 'B1',
                status: 'locked',
                duration: '25min',
                focusAreas: ['past_tense', 'time_expressions'],
                prerequisites: ['ex_1'],
                completion: {
                  required: { accuracy: 0.75, attempts: 3 },
                  current: { accuracy: 0, attempts: 0 }
                },
                uiData: {
                  icon: 'grammar-exercise',
                  color: 'green',
                  progressIndicator: 'linear'
                }
              }
            ],
            recommended: [
              {
                id: 'ex_3',
                title: 'Business Vocabulary Builder',
                description: 'Essential vocabulary for professional settings',
                type: 'vocabulary',
                difficulty: 'B1',
                status: 'available',
                duration: '15min',
                focusAreas: ['business_terms', 'formal_language'],
                prerequisites: [],
                completion: {
                  required: { accuracy: 0.7, attempts: 4 },
                  current: { accuracy: 0, attempts: 0 }
                },
                uiData: {
                  icon: 'vocabulary-exercise',
                  color: 'purple',
                  progressIndicator: 'circular'
                }
              }
            ],
            practice: [
              {
                id: 'ex_4',
                title: 'Listening Comprehension',
                description: 'Practice understanding native speakers in various contexts',
                type: 'comprehension',
                difficulty: 'B1',
                status: 'available',
                duration: '30min',
                focusAreas: ['native_speech', 'context_understanding'],
                prerequisites: [],
                completion: {
                  required: { accuracy: 0.65, attempts: 2 },
                  current: { accuracy: 0, attempts: 0 }
                },
                uiData: {
                  icon: 'listening-exercise',
                  color: 'orange',
                  progressIndicator: 'linear'
                }
              }
            ]
          },

          // Challenges section
          challenges: {
            current: [
              {
                id: 'ch_1',
                title: 'Business Meeting Simulation',
                description: 'Practice your skills in a simulated business meeting',
                type: 'critical',
                difficulty: 'B1',
                status: 'locked',
                duration: '45min',
                skills: ['pronunciation', 'vocabulary', 'comprehension'],
                requirements: {
                  exercises: ['ex_1', 'ex_3'],
                  skillLevels: {
                    pronunciation: 0.7,
                    vocabulary: 0.75
                  }
                },
                rewards: {
                  xp: 100,
                  skillPoints: {
                    pronunciation: 20,
                    vocabulary: 20,
                    comprehension: 15
                  }
                },
                uiData: {
                  icon: 'challenge-business',
                  color: 'gold',
                  progressIndicator: 'segments'
                }
              }
            ],
            upcoming: [
              {
                id: 'ch_2',
                title: 'Academic Presentation',
                description: 'Deliver a short academic presentation',
                type: 'improvement',
                difficulty: 'B2',
                status: 'locked',
                duration: '60min',
                skills: ['pronunciation', 'grammar', 'vocabulary'],
                requirements: {
                  exercises: ['ex_1', 'ex_2', 'ex_3'],
                  skillLevels: {
                    pronunciation: 0.75,
                    grammar: 0.7,
                    vocabulary: 0.8
                  }
                },
                rewards: {
                  xp: 150,
                  skillPoints: {
                    pronunciation: 25,
                    grammar: 25,
                    vocabulary: 25
                  }
                },
                uiData: {
                  icon: 'challenge-academic',
                  color: 'platinum',
                  progressIndicator: 'segments'
                }
              }
            ]
          },

          // Progression tracking
          progression: {
            currentNodeId: 'ex_1',
            availableNodeIds: ['ex_1', 'ex_3', 'ex_4'],
            nodes: {
              'ex_1': {
                id: 'ex_1',
                type: 'exercise',
                status: 'available',
                nextNodes: ['ex_2', 'ch_1'],
                requirements: []
              },
              'ex_2': {
                id: 'ex_2',
                type: 'exercise',
                status: 'locked',
                nextNodes: ['ch_1', 'ch_2'],
                requirements: ['ex_1']
              },
              'ch_1': {
                id: 'ch_1',
                type: 'challenge',
                status: 'locked',
                nextNodes: ['ch_2'],
                requirements: ['ex_1', 'ex_3']
              }
            },
            dependencies: {
              'ex_2': ['ex_1'],
              'ch_1': ['ex_1', 'ex_3'],
              'ch_2': ['ex_1', 'ex_2', 'ex_3']
            }
          },

          // Progress tracking
          progress: {
            overall: 0.15,
            bySkill: {
              pronunciation: 0.2,
              grammar: 0.1,
              vocabulary: 0.15,
              comprehension: 0.15
            },
            exercises: {
              completed: 1,
              total: 12,
              recent: ['ex_1']
            },
            streak: {
              current: 2,
              lastActivity: new Date().toISOString(),
              bestStreak: 5
            }
          },

          // UI state
          ui: {
            lastViewedExercise: 'ex_1',
            expandedSections: ['critical'],
            bookmarkedExercises: ['ex_3']
          }
        }
      }
    },
    {
      path: '/comprehension/submit',
      method: 'POST',
      response: {
        assessment_id: `mock_${Date.now()}`,
        step_id: `comprehension_${Date.now()}`,
        timestamp: new Date().toISOString(),
        is_completed: true,
        metrics: {
          understanding: 0.75,
          context_awareness: 0.80,
          cultural_competency: 0.70
        },
        comprehension_score: 0.78,
        question_analyses: [
          {
            question_id: 'q1',
            score: 0.85,
            explanation: 'Good understanding of greeting context',
            criteria_scores: {
              'cultural_awareness': 0.75,
              'language_comprehension': 0.85
            },
            detected_concepts: ['morning_greeting', 'politeness'],
            missing_concepts: ['time_specific_greeting'],
            improvements: {
              'greeting_formality': 'Consider more formal greeting options',
              'cultural_context': 'Pay attention to time-specific greetings'
            },
            confidence_score: 0.82,
            language_analysis: {
              grammar_accuracy: 0.85,
              vocabulary_richness: 0.75,
              coherence: 0.80,
              grammar_errors: [
                {
                  error_type: 'word_order',
                  description: 'Incorrect time expression placement',
                  context: 'morning in the',
                  suggestion: 'in the morning',
                  confidence: 0.90
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
              key_points_covered: ['greeting_context', 'time_awareness'],
              missed_points: ['cultural_specifics'],
              topic_alignment: {
                'café_interaction': 0.85,
                'cultural_norms': 0.70
              }
            }
          }
        ],
        skill_breakdown: {
          'listening': 0.80,
          'cultural_awareness': 0.75,
          'context_understanding': 0.85
        },
        misunderstood_concepts: [
          'formal_vs_informal_greetings',
          'time_specific_expressions'
        ],
        confidence_metrics: {
          overall_confidence: 0.80,
          response_time: 0.85,
          answer_coherence: 0.75
        }
      }
    }
  ]

