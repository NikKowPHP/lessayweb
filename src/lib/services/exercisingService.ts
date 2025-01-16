import { 
  PronunciationExercise,
  PronunciationExerciseResult,
  RecordingAttempt,
  VideoContent 
} from '@/lib/types/exercises'
import { CACHE_DURATION, exercisingStorage } from './exercisingStorage'
import type { IExercisingApi } from '@/lib/api/interfaces/IExercisingApi'
import { MockExercisingApi } from '@/lib/api/mock/MockExercisingApi'
import { ExercisingApi } from '@/lib/api/ExercisingApi'

export class ExercisingService {
  private static instance: ExercisingService
  private api: IExercisingApi
  private submissionQueue: Map<string, Promise<any>>
  private videoLoadQueue: Map<string, Promise<VideoContent>>

  private constructor(api?: IExercisingApi) {
    this.api = api || (process.env.NODE_ENV === 'development' 
      ? new MockExercisingApi()
      : ExercisingApi.getInstance())
    this.submissionQueue = new Map()
    this.videoLoadQueue = new Map()
  }

  static getInstance(api?: IExercisingApi): ExercisingService {
    if (!ExercisingService.instance) {
      ExercisingService.instance = new ExercisingService(api)
    }
    return ExercisingService.instance
  }

  async startExercise(exerciseId: string): Promise<PronunciationExercise> {
    try {
      console.info('Starting exercise', { exerciseId })

      // Check if we already have this exercise in storage
      const storedExercise = await exercisingStorage.getCurrentExercise()
      if (storedExercise?.id === exerciseId) {
        console.info('Using stored exercise', { exerciseId })
        return storedExercise
      }

      const response = await this.api.getExercise(exerciseId)
      const exercise = response.data

      // Start preloading video content in background
      this.preloadVideoContent(exercise.video)
      
      await exercisingStorage.setCurrentExercise(exercise)
      console.info('Exercise started successfully', { exerciseId })
      
      return exercise
    } catch (error) {
      console.error('Failed to start exercise', error as Error, { exerciseId })
      throw new Error('Failed to start exercise')
    }
  }

  private preloadVideoContent(video: VideoContent): void {
    if (this.videoLoadQueue.has(video.videoId)) {
      return // Already loading
    }

    const loadPromise = (async () => {
      try {
        const response = await this.api.getVideoContent(video.videoId)
        return response.data
      } catch (error) {
        console.error('Failed to preload video content', error as Error)
        throw error
      } finally {
        this.videoLoadQueue.delete(video.videoId)
      }
    })()

    this.videoLoadQueue.set(video.videoId, loadPromise)
  }

  async submitRecording(
    recording: RecordingAttempt, 
    background: boolean = false
  ): Promise<PronunciationExerciseResult | { status: string, id: string }> {
    const submissionId = `recording_${Date.now()}`
    
    const submissionPromise = (async () => {
      try {
        const currentExercise = await exercisingStorage.getCurrentExercise()
        if (!currentExercise) throw new Error('No active exercise')

        console.info('Submitting recording', { 
          exerciseId: currentExercise.id,
          recordingDuration: recording.duration
        })

        // Remove audioData before storing in results if not needed
        const { audioData, ...recordingWithoutAudio } = recording
        const response = await this.api.submitRecording(currentExercise.id, recording)
        const result = {
          ...response.data,
          recording: recordingWithoutAudio
        }

        await exercisingStorage.setExerciseResult(result)
        
        console.info('Recording submitted successfully', {
          exerciseId: currentExercise.id,
          scores: result.scores
        })

        return result
      } catch (error) {
        console.error('Failed to submit recording', error as Error)
        throw new Error('Failed to submit recording')
      } finally {
        this.submissionQueue.delete(submissionId)
      }
    })()

    if (background) {
      this.submissionQueue.set(submissionId, submissionPromise)
      return { status: 'queued', id: submissionId }
    }

    return await submissionPromise
  }

  async getSubmissionStatus(submissionId: string) {
    const submission = this.submissionQueue.get(submissionId)
    if (!submission) {
      return { status: 'not_found' }
    }
    try {
      const result = await submission
      return { status: 'completed', result }
    } catch (error) {
      return { status: 'failed', error }
    }
  }

  async getCurrentExercise(): Promise<PronunciationExercise | null> {
    return await exercisingStorage.getCurrentExercise()
  }

  async getExerciseResult(): Promise<PronunciationExerciseResult | null> {
    return await exercisingStorage.getExerciseResult()
  }

  async clearExerciseSession(): Promise<void> {
    await exercisingStorage.clearExerciseSession()
  }

  async getStoredState() {
    const [currentExercise, results] = await Promise.all([
      this.getCurrentExercise(),
      this.getExerciseResult()
    ])
    return { currentExercise, results }
  }

  async setStoredState(state: {
    currentExercise: PronunciationExercise | null
    results: PronunciationExerciseResult | null
  }) {
    await Promise.all([
      exercisingStorage.setCurrentExercise(state.currentExercise),
      exercisingStorage.setExerciseResult(state.results)
    ])
  }

  async getExercisesList(): Promise<PronunciationExercise[]> {
    try {
      // Check cache first
      const { exercises, timestamp } = await exercisingStorage.getCachedExercises()
      const cacheAge = timestamp ? Date.now() - timestamp : Infinity

      // Use cache if available and fresh
      if (exercises && cacheAge < CACHE_DURATION) {
        console.info('Using cached exercises list')
        return exercises
      }

      // Fetch fresh data
      console.info('Fetching fresh exercises list')
      const response = await this.api.getExercisesList()
      const freshExercises = response.data

      // Update cache in background
      exercisingStorage.cacheExercises(freshExercises).catch(error => {
        console.warn('Failed to cache exercises', error)
      })

      return freshExercises
    } catch (error) {
      // If fetch fails and we have cached data, use it as fallback
      const { exercises } = await exercisingStorage.getCachedExercises()
      if (exercises) {
        console.warn('Using stale cache due to fetch failure')
        return exercises
      }

      console.error('Failed to get exercises list', error)
      throw new Error('Failed to get exercises list')
    }
  }

  async invalidateExercisesCache(): Promise<void> {
    await exercisingStorage.clearExercisesCache()
  }
}

// Export singleton instance
export const exercisingService = ExercisingService.getInstance()
