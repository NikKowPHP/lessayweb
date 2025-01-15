export type SkillType = 'pronunciation' | 'grammar' | 'vocabulary' | 'comprehension'
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type ExerciseStatus = 'locked' | 'available' | 'in_progress' | 'completed'
export type ChallengeType = 'critical' | 'improvement' | 'mastery'

export interface Skill {
  type: SkillType
  currentLevel: number
  targetLevel: number
  criticalPoints: string[]
}

export interface Exercise {
  id: string
  title: string
  description: string
  type: SkillType
  difficulty: DifficultyLevel
  status: ExerciseStatus
  estimatedDuration: string
  focusAreas: string[]
  prerequisites: string[]
  completionCriteria: {
    minAccuracy: number
    requiredAttempts: number
  }
  metrics?: {
    accuracy: number
    completedAttempts: number
    timeSpent: string
  }
}

export interface Challenge {
  id: string
  type: ChallengeType
  title: string
  description: string
  skills: SkillType[]
  difficulty: DifficultyLevel
  status: ExerciseStatus
  prerequisites: {
    exercises: string[]
    minSkillLevels: Record<SkillType, number>
  }
  rewards: {
    xp: number
    skillPoints: Record<SkillType, number>
  }
}

export interface LearningPathNode {
  id: string
  type: 'exercise' | 'challenge'
  data: Exercise | Challenge
  nextNodes: string[]
  completed: boolean
  unlockCriteria: {
    requiredNodes: string[]
    requiredSkills: Record<SkillType, number>
  }
}

export interface SkillProgress {
  currentLevel: number
  targetLevel: number
  criticalPoints: string[]
  recentProgress?: number // For progress visualization
  nextMilestone?: {
    target: number
    description: string
  }
}

export interface LearningPathMetrics {
  progress: {
    overallProgress: number
    skillProgress: Record<SkillType, number>
    completedExercises: number
    totalExercises: number
    streakDays: number
    lastActivity?: string // For engagement tracking
  }
  assessmentMetrics: {
    lastAssessmentDate: string
    overallScore: number
    skillScores: Record<SkillType, number>
    criticalAreas: Array<{
      skill: SkillType
      focus: string
      importance: 'high' | 'medium' | 'low'
      currentLevel: number
      targetLevel: number
    }>
  }
}

export interface LearningPath {
  id: string
  userId: string
  targetLanguage: string
  currentLevel: DifficultyLevel
  targetLevel: DifficultyLevel
  
  // Skills section - Keep this flat and simple
  skills: Record<SkillType, {
    currentLevel: number
    targetLevel: number
    criticalPoints: string[]
    progress?: number // For UI progress tracking
  }>
  
  // Learning content - Organized by sections
  exercises: {
    critical: Exercise[]
    recommended: Exercise[]
    practice: Exercise[]
  }
  
  challenges: {
    current: Challenge[]
    upcoming: Challenge[]
  }
  
  // Navigation
  progression: {
    currentNodeId: string
    availableNodeIds: string[]
    nodes: Record<string, LearningPathNode>
    dependencies: Record<string, string[]> // For quick dependency lookups
  }
  
  // Progress tracking
  progress: {
    overall: number
    bySkill: Record<SkillType, number>
    exercises: {
      completed: number
      total: number
      recent: string[] // Recently completed exercise IDs
    }
    streak: {
      current: number
      lastActivity: string
      bestStreak: number
    }
  }

  // UI-specific data
  ui?: {
    lastViewedExercise?: string
    expandedSections?: string[]
    bookmarkedExercises?: string[]
  }
}



export interface LearningPathUI extends LearningPath {
  // UI-specific helpers
  getNextExercise(): Exercise
  getProgressForSkill(skill: SkillType): number
  getAvailableExercises(): Exercise[]
  getRecommendedPath(): string[]
  
  // Progress tracking
  trackProgress(exerciseId: string, result: ExerciseResult): void
  updateSkillLevels(updates: Partial<Record<SkillType, number>>): void
}

export interface ExerciseResult {
  exerciseId: string
  result: 'correct' | 'incorrect'
  feedback?: string
}
