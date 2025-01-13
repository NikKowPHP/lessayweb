export interface PronunciationPromptData {
  prompt_text: string
  target_phonemes: string[]
  difficulty_level: string
}

export interface PronunciationPromptResponse {
  status: string
  data: PronunciationPromptData
}


export interface VocabularyPromptData {
  image_url: string
  topic: string
  expected_vocabulary: string[]
  categories?: {
    name: string
    words: string[]
    description?: string
  }[]
  hints?: string[]
  difficulty_level?: string
}

export interface VocabularyPromptResponse {
  status: string
  data: VocabularyPromptData
}

export interface GrammarPromptData {
  prompt_text: string
  target_structures: string[]
  example_sentence: string
  difficulty_level?: string
  grammar_points?: Record<string, string[]>
}

export interface GrammarPromptResponse {
  status: string
  data: GrammarPromptData
}

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