import type { AssessmentBaseResponse } from './AssessmentBaseResponse'

export interface VocabularyMetrics {
  diversity: number
  complexity: number
  appropriateness: number
}

export interface VocabularyResponse extends AssessmentBaseResponse<VocabularyMetrics> {
  vocabulary_score: number
  unique_words_used: number
  detected_vocabulary: {
    advanced: string[]
    intermediate: string[]
    basic: string[]
  }
  missing_key_vocabulary: string[]
  next_image_prompt_url: string
  topic_coverage: Record<string, number>
}