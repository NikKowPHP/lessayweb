import type { SearchPrompt, DetectedIssue } from './AssessmentBaseResponse'

export interface LanguageProficiency {
  overall_level: string
  detailed_levels: {
    speaking: string
    listening: string
    pronunciation: string
  }
  cefr_details: {
    can_do_statements: string[]
    limitations: string[]
  }
}

export interface PronunciationAnalysis {
  overall_score: number
  detailed_scores: {
    accuracy: number
    fluency: number
    clarity: number
  }
  specific_issues: Array<DetectedIssue & {
    phoneme: string
  }>
}

export interface GrammarAnalysis {
  overall_score: number
  detailed_scores: {
    accuracy: number
    complexity: number
    variety: number
  }
  specific_issues: Array<DetectedIssue & {
    category: string
  }>
}

export interface VocabularyAnalysis {
  overall_score: number
  active_vocabulary_size: number
  topic_proficiency: Record<string, number>
  word_usage_patterns: {
    variety: number
    complexity: number
    appropriateness: number
  }
}

export interface FluencyMetrics {
  overall_score: number
  detailed_scores: {
    speed: number
    pausing: number
    rhythm: number
  }
  speech_characteristics: {
    words_per_minute: number
    average_pause_duration: number
    longest_fluent_segment: number
  }
}

export interface RecommendationArea {
  skill: string
  focus: string
  importance: 'high' | 'medium' | 'low'
  current_level: number
  target_level: number
  exercises: string[]
}

export interface Recommendations {
  priority_areas: RecommendationArea[]
  learning_path_suggestions: {
    recommended_level: string
    estimated_study_time: string
    focus_distribution: Record<string, number>
  }
  feedback: {
    strengths: string[]
    improvements: string[]
    level: string
  }
}

export interface ComparativeMetrics {
  peer_group: string
  percentile_rankings: {
    overall: number
    pronunciation: number
    grammar: number
    vocabulary: number
  }
}

export interface FinalAssessmentResponse {
  assessment_id: string
  timestamp: string
  language_proficiency: LanguageProficiency
  pronunciation_analysis: PronunciationAnalysis
  grammar_analysis: GrammarAnalysis
  vocabulary_analysis: VocabularyAnalysis
  fluency_metrics: FluencyMetrics
  recommendations: Recommendations
  comparative_metrics: ComparativeMetrics
  comprehension_analysis: {
    overall_score: number
    question_analyses: Array<{
      question_id: string
      score: number
      explanation: string
      criteria_scores: Record<string, number>
      detected_concepts: string[]
      missing_concepts: string[]
      improvements: Record<string, string>
      confidence_score: number
      language_analysis: {
        grammar_accuracy: number
        vocabulary_richness: number
        coherence: number
        grammar_errors: Array<{
          error_type: string
          description: string
          context: string
          suggestion: string
          confidence: number
        }>
        vocabulary_usage: Record<string, number>
      }
      content_analysis: {
        relevance: number
        completeness: number
        contextual_understanding: number
        key_points_covered: string[]
        missed_points: string[]
        topic_alignment: Record<string, number>
      }
    }>
    skill_breakdown: Record<string, number>
    misunderstood_concepts: string[]
    confidence_metrics: {
      overall_confidence: number
      response_time: number
      answer_coherence: number
    }
  }
}