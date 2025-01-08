import type { LanguageCode } from '@/constants/languages'
import type { FinalAssessmentResponse } from './assessments/FinalAssessmentResponse'
import type { 
  PronunciationResponse,
  VocabularyResponse,
  GrammarResponse,
  ComprehensionResponse 
} from './assessments/AssessmentResponseIndex'


export interface OnboardingSessionResponse {
  status: string
  data: {
    session_id: string
    timestamp: string
    current_step: 'language' | 'assessment-intro' | 'assessment' | 'complete'
    assessment_id: string | null
    language_preferences?: {
      native_language: LanguageCode
      target_language: LanguageCode
    }
    assessment_progress: number
    assessment_responses: {
      pronunciation?: PronunciationResponse
      vocabulary?: VocabularyResponse
      grammar?: GrammarResponse
      comprehension?: ComprehensionResponse
    }
    final_assessment?: FinalAssessmentResponse
  }
}
