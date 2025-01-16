import { AbstractStorage, IStorageAdapter } from './abstractStorage'
import { LocalForageAdapter } from './localForageAdapter'
import { 
  PronunciationExercise, 
  PronunciationExerciseResult 
} from '@/lib/types/exercises'

const CURRENT_EXERCISE_KEY = 'current_exercise'
const EXERCISE_RESULT_KEY = 'exercise_result'
const EXERCISES_CACHE_KEY = 'exercises_cache'
const CACHE_TIMESTAMP_KEY = 'exercises_cache_timestamp'

const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export class ExercisingStorage extends AbstractStorage {
  private static instance: ExercisingStorage

  private constructor() {
    super({
      name: 'lessay',
      storeName: 'exercising',
      adapter: new LocalForageAdapter('lessay', 'exercising')
    })
  }

  static getInstance(): ExercisingStorage {
    if (!ExercisingStorage.instance) {
      ExercisingStorage.instance = new ExercisingStorage()
    }
    return ExercisingStorage.instance
  }

  protected getDefaultAdapter(): IStorageAdapter {
    // return new LocalForageAdapter('lessay', 'exercising')
    return this.adapter;
  }


  async getCurrentExercise(): Promise<PronunciationExercise | null> {
    return await this.get<PronunciationExercise>(CURRENT_EXERCISE_KEY)
  }

  async setCurrentExercise(exercise: PronunciationExercise): Promise<void> {
    await this.set(CURRENT_EXERCISE_KEY, exercise)
  }

  async getExerciseResult(): Promise<PronunciationExerciseResult | null> {
    return await this.get<PronunciationExerciseResult>(EXERCISE_RESULT_KEY)
  }

  async setExerciseResult(result: PronunciationExerciseResult): Promise<void> {
    await this.set(EXERCISE_RESULT_KEY, result)
  }

  async clearExerciseSession(): Promise<void> {
    await Promise.all([
      this.remove(CURRENT_EXERCISE_KEY),
      this.remove(EXERCISE_RESULT_KEY)
    ])
  }

  async getCachedExercises(): Promise<{
    exercises: PronunciationExercise[] | null,
    timestamp: number | null
  }> {
    const [exercises, timestamp] = await Promise.all([
      this.get<PronunciationExercise[]>(EXERCISES_CACHE_KEY),
      this.get<number>(CACHE_TIMESTAMP_KEY)
    ])
    return { exercises, timestamp }
  }

  async cacheExercises(exercises: PronunciationExercise[]): Promise<void> {
    await Promise.all([
      this.set(EXERCISES_CACHE_KEY, exercises),
      this.set(CACHE_TIMESTAMP_KEY, Date.now())
    ])
  }

  async clearExercisesCache(): Promise<void> {
    await Promise.all([
      this.remove(EXERCISES_CACHE_KEY),
      this.remove(CACHE_TIMESTAMP_KEY)
    ])
  }
}

export const exercisingStorage = ExercisingStorage.getInstance()