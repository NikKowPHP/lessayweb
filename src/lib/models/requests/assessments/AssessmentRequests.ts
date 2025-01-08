export interface BaseAssessmentRequest {
  assessmentId: string
  timestamp: string
  duration: number
  difficulty_level: string
}

export interface PronunciationAssessmentRequest extends BaseAssessmentRequest {
  audioBase64: string
  targetPhonemes: string[]
  prompt_text: string
  transcription?: string
  confidence_score?: number
}

export interface VocabularyAssessmentRequest extends BaseAssessmentRequest {
  userResponse: string[]
  topic: string
  expectedVocabulary: string[]
  image_url: string
  categories?: {
    name: string
    words: string[]
    description?: string
  }[]
}

export interface GrammarAssessmentRequest extends BaseAssessmentRequest {
  userResponse: string
  targetStructures: string[]
  prompt_text: string
  example_sentence: string
  grammar_points?: Record<string, string[]>
  corrections?: {
    original: string
    correction: string
    explanation: string
  }[]
}

export interface ComprehensionAssessmentRequest extends BaseAssessmentRequest {
  youtube_video_id: string
  responses: {
    questionId: string
    answer: string
    context_timestamp: string
    expected_concepts: string[]
    evaluationScores: {
      content_relevance: number
      language_accuracy: number
      vocabulary_usage: number
    }
  }[]
}

export interface FinalAssessmentRequest {
  assessmentId: string
  completedSections: {
    type: string
    score: number
    duration: number
    timestamp: string
    difficulty_level: string
  }[]
  overallDuration: number
  targetLanguage: string
  nativeLanguage: string
}
