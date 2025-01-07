import type { AssessmentBaseResponse, DetectedIssue } from './AssessmentBaseResponse'

export interface GrammarMetrics {
  accuracy: number
  complexity: number
  variety: number
}

export interface GrammarResponse extends AssessmentBaseResponse<GrammarMetrics> {
  grammar_score: number
  detected_errors: Array<DetectedIssue & {
    error_type: string
  }>
  grammar_point_scores: Record<string, number>
  next_question_prompt: string
  correctly_used_structures: string[]
  complexity_metrics: {
    sentence_length: number
    clause_count: number
    subordination_index: number
  }
}