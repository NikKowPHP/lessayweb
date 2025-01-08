export interface ComprehensionQuestion {
  id: string
  question: string
  context_timestamp: string
  difficulty: string
  expected_concepts: string[]
  evaluation_criteria: {
    content_relevance: number
    language_accuracy: number
    vocabulary_usage: number
  }
  hint: string
}

export interface ComprehensionPromptData {
  youtube_video_id: string
  title: string
  description: string
  duration_seconds: number
  language_code: string
  difficulty: string
  questions: ComprehensionQuestion[]
  transcript_highlights?: Record<string, string>
}

export interface ComprehensionPromptResponse {
  status: string
  data: ComprehensionPromptData
}