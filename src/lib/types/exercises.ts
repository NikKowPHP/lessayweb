import { SkillType, DifficultyLevel, ExerciseStatus } from './learningPath'

// Types of focus areas in pronunciation exercises
export type PronunciationFocusArea = 'phoneme' | 'stress' | 'intonation'

// Video content data - main learning material
export interface VideoContent {
  videoId: string
  title: string
  transcript: string
  highlights: Array<{
    timestamp: number
    text: string
    focus: PronunciationFocusArea
  }>
}

// Practice text segment with phonetic transcription
export interface PracticeSegment {
  text: string
  phonetic: string
  focus: PronunciationFocusArea
  // Optional metadata for UI display
  translation?: string
  notes?: string
}

// Practice text provided by backend
export interface PracticeMaterial {
  text: string // Complete practice text
  segments: PracticeSegment[]
  // Optional display settings
  displayOptions?: {
    showPhonetics: boolean
    showTranslation: boolean
    showNotes: boolean
  }
}

// User's recording attempt
export interface RecordingAttempt {
  timestamp: string
  duration: number
  exerciseId: string
  segmentIndex: number
  audioData?: string // Base64 string instead of Blob
}

// Feedback item for specific pronunciation issue
export interface PronunciationFeedback {
  timestamp: number
  type: PronunciationFocusArea
  issue: string
  suggestion: string
  severity: 'low' | 'medium' | 'high'
  segmentIndex?: number // Reference to specific practice segment
}

// Backend response for recording submission
export interface PronunciationExerciseResult {
  exerciseId: string
  timestamp: string
  recording: RecordingAttempt
  completed: boolean
  scores: {
    accuracy: number
    fluency: number
    pronunciation: number
    overall: number
  }
  feedback: PronunciationFeedback[]
}

// Main pronunciation exercise type
export interface PronunciationExercise {
  id: string
  type: Extract<SkillType, 'pronunciation'>
  status: ExerciseStatus
  difficulty: DifficultyLevel
  title: string
  description: string
  
  // Core exercise content
  video: VideoContent
  practiceMaterial: PracticeMaterial
  
  // Exercise settings
  settings: {
    minRecordingDuration: number
    maxRecordingDuration: number
    attemptsAllowed: number
    passingScore: number
    allowSegmentRecording?: boolean // Optional: allow recording individual segments
  }

  // Exercise requirements
  requirements: {
    minAccuracy: number
    minAttempts: number
    focusAreas: PronunciationFocusArea[]
  }

  // Exercise metadata
  estimatedDuration: string
  focusAreas: string[] // Specific focus areas like 'phoneme-th', 'stress-patterns'
  prerequisites: string[]
  
  // UI state tracking
  progress?: {
    videoWatched: boolean
    currentSegment: number
    attemptsUsed: number
  }
}

// Progress tracking types
export interface ExerciseProgressData {
  exerciseId: string
  completed: boolean
  attempts: number
  bestScore: number
  lastAttempt: string | null
  metrics: {
    accuracy: number
    completedAttempts: number
    timeSpent: string
    focusAreaProgress: Record<PronunciationFocusArea, {
      accuracy: number
      needsWork: boolean
      attempts: number
    }>
  }
  // Recent activity
  recentActivity?: {
    lastPracticeDate: string
    currentStreak: number
    totalPracticeDays: number
  }
}