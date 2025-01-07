import type { AssessmentBaseResponse } from './AssessmentBaseResponse'

export interface ComprehensionMetrics {
  understanding: number
  context_awareness: number
  cultural_competency: number
}

export interface ContentAnalysis {
  relevance: number
  completeness: number
  contextual_understanding: number
  key_points_covered: string[]
  missed_points: string[]
  topic_alignment: Record<string, number>
}

export interface QuestionAnalysis {
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
  content_analysis: ContentAnalysis
}

export interface ComprehensionResponse extends AssessmentBaseResponse<ComprehensionMetrics> {
  comprehension_score: number
  question_analyses: QuestionAnalysis[]
  skill_breakdown: Record<string, number>
  misunderstood_concepts: string[]
  confidence_metrics: {
    overall_confidence: number
    response_time: number
    answer_coherence: number
  }
}