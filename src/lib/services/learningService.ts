import { 
  LearningPath, 
  Exercise, 
  Challenge, 
  SkillType,
  ExerciseStatus 
} from '@/lib/types/learningPath'
import { LearningStorage, learningStorage } from './learningStorage'
import { FinalAssessmentResponse } from '@/lib/models/responses/assessments/FinalAssessmentResponse'
import { LearningState } from '@/store/slices/learningSlice'

export class LearningService {
  private static instance: LearningService
  private storage: LearningStorage

  private constructor() {
    this.storage = learningStorage
  }

  static getInstance(): LearningService {
    if (!LearningService.instance) {
      LearningService.instance = new LearningService()
    }
    return LearningService.instance
  }

  async getStoredState() {
    return await this.storage.getSession()
  }

  async setStoredState(state: LearningState) {
    return await this.storage.setSession(state)
  }

  async initializePath(path: LearningPath, assessmentResults: FinalAssessmentResponse) {
    const skillLevels = {
      pronunciation: assessmentResults.pronunciation_analysis.overall_score,
      grammar: assessmentResults.grammar_analysis.overall_score,
      vocabulary: assessmentResults.vocabulary_analysis.overall_score,
      comprehension: assessmentResults.comprehension_analysis.overall_score
    }

    // Store initial state
    await this.storage.setSession({
      currentPath: path,
      currentExercise: null,
      currentChallenge: null,
      lastActivity: new Date().toISOString(),
      ui: {
        expandedSections: [],
        bookmarkedExercises: [],
        lastViewedExercise: null
      }
    })

    return { path, skillLevels }
  }

  async completeExercise(exerciseId: string, metrics: Exercise['metrics']) {
    const session = await learningStorage.getSession()
    if (!session?.currentPath) throw new Error('No active learning path')

    const path = session.currentPath
    const node = path.progression.nodes[exerciseId]
    if (!node || node.type !== 'exercise') throw new Error('Invalid exercise')

    // Update exercise completion
    const exercise = node.data as Exercise
    exercise.status = 'completed'
    exercise.metrics = metrics
    node.completed = true

    // Update progress tracking
    path.progress.exercises.completed++
    path.progress.exercises.recent.push(exerciseId)
    
    // Update overall progress
    path.progress.overall = 
      path.progress.exercises.completed / path.progress.exercises.total

    // Update skill progress
    if (exercise.type) {
      const skillType = exercise.type
      const criticalExercisesOfType = path.exercises.critical
        .filter(e => e.type === skillType)
      
      if (criticalExercisesOfType.length > 0) {
        path.progress.bySkill[skillType] += 
          (1 / criticalExercisesOfType.length)
      }
    }

    // Save updated state
    await learningStorage.setSession({
      ...session,
      currentPath: path,
      lastActivity: new Date().toISOString()
    })

    return path
  }

  async unlockNextNodes(nodeIds: string[]) {
    const session = await learningStorage.getSession()
    if (!session?.currentPath) throw new Error('No active learning path')

    const path = session.currentPath

    nodeIds.forEach(nodeId => {
      const node = path.progression.nodes[nodeId]
      if (!node) return

      const allPrerequisitesMet = node.unlockCriteria.requiredNodes
        .every(reqId => path.progression.nodes[reqId]?.completed === true)

      if (allPrerequisitesMet) {
        if (node.type === 'exercise') {
          (node.data as Exercise).status = 'available'
        } else {
          (node.data as Challenge).status = 'available'
        }
      }
    })

    // Update available node IDs
    const newAvailableNodes = Object.entries(path.progression.nodes)
      .filter(([_, node]) => {
        if (node.type === 'exercise') {
          return (node.data as Exercise).status === 'available'
        } else {
          return (node.data as Challenge).status === 'available'
        }
      })
      .map(([id]) => id)

    path.progression.availableNodeIds = newAvailableNodes

    // Save updated state
    await learningStorage.setSession({
      ...session,
      currentPath: path
    })

    return path
  }

  // UI State Management
  async updateUIState(updates: Partial<{
    expandedSections: string[]
    bookmarkedExercises: string[]
    lastViewedExercise: string | null
  }>) {
    const session = await learningStorage.getSession()
    if (!session) throw new Error('No active session')

    const updatedSession = {
      ...session,
      ui: {
        ...session.ui,
        ...updates
      }
    }

    await learningStorage.setSession(updatedSession)
    return updatedSession
  }
}

export const learningService = LearningService.getInstance()
