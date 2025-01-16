import { SkillType, DifficultyLevel, ExerciseStatus } from './learningPath'

// Model response from the backend
export interface PronunciationModelData {
  audioUrl: string
  phonemes: Array<{
    symbol: string
    sound: string
    examples: string[]
  }>
  stressPatterns: Array<{
    pattern: string
    example: string
  }>
  intonation: {
    pattern: 'rising' | 'falling' | 'rise-fall' | 'fall-rise'
    description: string
  }
}

// Video content data
export interface VideoContent {
  videoId: string
  startTime?: number
  endTime?: number
  title: string
  transcript: string
  highlights: Array<{
    timestamp: number
    text: string
    focus: 'phoneme' | 'stress' | 'intonation'
  }>
}

// Practice text sections
export interface PracticeMaterial {
  text: string
  segments: Array<{
    text: string
    phonetic: string
    audioUrl?: string
    focus: 'phoneme' | 'stress' | 'intonation'
  }>
}

// User's recording attempt
export interface RecordingAttempt {
  timestamp: string
  audioUrl: string
  duration: number
  scores: {
    accuracy: number
    fluency: number
    pronunciation: number
    overall: number
  }
  feedback: Array<{
    timestamp: number
    type: 'phoneme' | 'stress' | 'intonation'
    issue: string
    suggestion: string
    severity: 'low' | 'medium' | 'high'
  }>
}

// Main pronunciation exercise type
export interface PronunciationExercise {
  id: string
  type: Extract<SkillType, 'pronunciation'>
  status: ExerciseStatus
  difficulty: DifficultyLevel
  title: string
  description: string
  
  // Exercise content
  video: VideoContent
  practiceMaterial: PracticeMaterial
  modelData: PronunciationModelData
  
  // Exercise settings
  settings: {
    minRecordingDuration: number
    maxRecordingDuration: number
    attemptsAllowed: number
    passingScore: number
  }

  // Progress tracking
  progress?: {
    attempts: RecordingAttempt[]
    bestScore: number
    lastAttemptAt: string
    completed: boolean
  }

  // Exercise requirements
  requirements: {
    minAccuracy: number
    minAttempts: number
    focusAreas: Array<'phoneme' | 'stress' | 'intonation'>
  }

  // Exercise metadata
  estimatedDuration: string
  focusAreas: string[]
  prerequisites: string[]
  
  // Optional metrics if exercise is completed
  metrics?: {
    accuracy: number
    completedAttempts: number
    timeSpent: string
    bestRecording?: string
  }
}

// Exercise result specific to pronunciation
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
  feedback: Array<{
    timestamp: number
    type: 'phoneme' | 'stress' | 'intonation'
    issue: string
    suggestion: string
    severity: 'low' | 'medium' | 'high'
  }>
}