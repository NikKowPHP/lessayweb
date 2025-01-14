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
  timestamp_seconds: number
  difficulty: string
  question_type: 'open_ended' | 'multiple_choice' | 'fill_in_blank'
  expected_concepts: string[]
  evaluation_criteria: {
    content_relevance: number
    language_accuracy: number
    vocabulary_usage: number
  }
  hint: string
  related_transcript_segment?: {
    start_time: number
    end_time: number
  }
  improvements?: {
    cultural: string
    vocabulary: string
  }
  confidence_score?: number
  language_analysis?: {
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
  content_analysis?: {
    relevance: number
    completeness: number
    contextual_understanding: number
    key_points_covered: string[]
    missed_points: string[]
    topic_alignment: Record<string, number>
  }
}

export interface ComprehensionPromptData {
  youtube_video_id: string
  title: string
  description: string
  duration_seconds: number
  language_code: string
  difficulty: string
  transcript_segments: {
    start_time: number
    end_time: number
    text: string
  }[]
  questions: ComprehensionQuestion[]
  transcript_highlights: Record<string, string>
  instructions: {
    before_video: string
    during_video: string
    after_video: string
  }
  video_settings: {
    can_pause: boolean
    max_replays: number
    show_subtitles: boolean
    playback_speed_options: number[]
  }
  skill_breakdown?: {
    listening: number
    contextual_understanding: number
    cultural_awareness: number
    language_production: number
  }
  misunderstood_concepts?: string[]
  confidence_metrics?: {
    overall_confidence: number
    response_time: number
    answer_coherence: number
  }
}

export interface ComprehensionPromptResponse {
  status: string
  data: ComprehensionPromptData
}