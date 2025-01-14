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

export interface LearningPath {
  userId: string
  targetLanguage: string
  currentLevel: DifficultyLevel
  targetLevel: DifficultyLevel
  skills: Record<SkillType, Skill>
  criticalExercises: Exercise[]
  upcomingChallenges: Challenge[]
  nodes: Record<string, LearningPathNode>
  currentNodeId: string
  progress: {
    overallProgress: number
    skillProgress: Record<SkillType, number>
    completedExercises: number
    totalExercises: number
    streakDays: number
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