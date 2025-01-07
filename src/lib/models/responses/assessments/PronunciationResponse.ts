import type { AssessmentBaseResponse, DetectedIssue } from './AssessmentBaseResponse'

export interface PronunciationMetrics {
  accuracy: number
  fluency: number
  clarity: number
}

export interface PronunciationResponse extends AssessmentBaseResponse<PronunciationMetrics> {
  overall_score: number
  phoneme_scores: Record<string, number>
  detected_issues: Array<DetectedIssue & {
    phoneme: string
    examples: string[]
  }>
  next_prompt_text: string
  phoneme_highlights: Record<string, string>
}