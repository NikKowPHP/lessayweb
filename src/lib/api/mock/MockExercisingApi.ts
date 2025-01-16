import type { IExercisingApi } from '../interfaces/IExercisingApi'
import type { 
  ExerciseProgressData,
  PronunciationExercise,
  PronunciationExerciseResult,
  RecordingAttempt,
  VideoContent 
} from '@/lib/types/exercises'
import { exercisingStorage } from '@/lib/services/exercisingStorage'

export class MockExercisingApi implements IExercisingApi {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async handleMockRequest<T>(path: string, method: 'GET' | 'POST', body?: any): Promise<{ data: T }> {
    await this.delay(1000) // Simulate network delay
    
    // Add mock route handling logic here
    const mockData = await this.getMockData(path, method, body)
    return { data: mockData as T }
  }

  private async getMockData(path: string, method: string, body?: any): Promise<any> {
    // Mock data generation based on request
    if (path === '/exercises' && method === 'GET') {
      return this.generateMockExercisesList()
    }
    
    if (path.includes('/exercises/') && method === 'GET') {
      return this.generateMockExercise(path.split('/').pop() || '')
    }
    
    if (path.includes('/video/') && method === 'GET') {
      return this.generateMockVideoContent(path.split('/').pop() || '')
    }
    
    if (path.includes('/recording') && method === 'POST') {
      return this.generateMockRecordingResult(body?.recording)
    }

    throw new Error(`Mock route not found: ${method} ${path}`)
  }

  private generateMockExercise(exerciseId: string): PronunciationExercise {
    return {
      id: exerciseId,
      type: 'pronunciation',
      status: 'available',
      difficulty: 'B1',
      title: 'The "TH" Sound in English',
      description: 'Master the pronunciation of "th" sound in English with common words and phrases. Watch the video lesson first, then practice with the provided text.',
      
      // Learning video content
      video: {
        videoId: '7CeNTtbhYLs',
        title: 'How to Pronounce TH - English Pronunciation Guide',
        transcript: `Today we're learning about the "th" sound in English.
          There are two types of "th" sounds:
          1. The voiced "th" as in "this", "that", and "brother"
          2. The unvoiced "th" as in "think", "three", and "mouth"
          Watch carefully as we demonstrate the correct tongue position and practice these sounds.`,
        highlights: [
          {
            timestamp: 15,
            text: "Voiced TH demonstration",
            focus: 'phoneme'
          },
          {
            timestamp: 45,
            text: "Unvoiced TH demonstration",
            focus: 'phoneme'
          },
          {
            timestamp: 90,
            text: "Common word practice",
            focus: 'phoneme'
          }
        ]
      },

      // Practice material (shown after video)
      practiceMaterial: {
        text: "Think about this: the weather is perfect for a Thursday afternoon at the theater.",
        segments: [
          {
            text: "Think about this",
            phonetic: "θɪŋk əˈbaʊt ðɪs",
            focus: 'phoneme'
          },
          {
            text: "the weather",
            phonetic: "ðə ˈwɛðər",
            focus: 'phoneme'
          },
          {
            text: "is perfect for",
            phonetic: "ɪz ˈpɜrfɪkt fɔr",
            focus: 'stress'
          },
          {
            text: "a Thursday afternoon",
            phonetic: "eɪ ˈθɜrzdeɪ ˌæftərˈnun",
            focus: 'stress'
          },
          {
            text: "at the theater",
            phonetic: "æt ðə ˈθiːətər",
            focus: 'phoneme'
          }
        ]
      },

      // Exercise configuration
      settings: {
        minRecordingDuration: 5,
        maxRecordingDuration: 30,
        attemptsAllowed: 3,
        passingScore: 70
      },

      // Success criteria
      requirements: {
        minAccuracy: 70,
        minAttempts: 1,
        focusAreas: ['phoneme', 'stress', 'intonation']
      },

      // Exercise metadata
      estimatedDuration: '10 minutes',
      focusAreas: ['pronunciation', 'phoneme-th', 'stress-patterns'],
      prerequisites: []
    }
  }

  private generateMockVideoContent(videoId: string): VideoContent {
    return {
      videoId,
      title: 'Mock Video Content',
      transcript: 'Sample video transcript',
      highlights: []
    }
  }

  private generateMockRecordingResult(recording: RecordingAttempt): PronunciationExerciseResult {
    return {
      exerciseId: 'mock-exercise-id',
      timestamp: new Date().toISOString(),
      recording: {
        ...recording,
        // Don't include audioData in the result if you don't need it
        audioData: undefined
      },
      completed: true,
      scores: {
        accuracy: 85,
        fluency: 80,
        pronunciation: 75,
        overall: 80
      },
      feedback: [
        {
          timestamp: 0,
          type: 'phoneme',
          issue: 'Sample feedback',
          suggestion: 'Practice this sound more',
          severity: 'low'
        }
      ]
    }
  }

  private generateMockExercisesList(): PronunciationExercise[] {
    return [
      this.generateMockExercise('th-sounds'),
      this.generateMockExercise('r-sounds'),
      this.generateMockExercise('l-sounds'),
    ]
  }

  // IExercisingApi implementation
  async getExercise(exerciseId: string) {
    return this.handleMockRequest<PronunciationExercise>(`/exercises/${exerciseId}`, 'GET')
  }

  async getVideoContent(videoId: string) {
    return this.handleMockRequest<VideoContent>(`/exercises/video/${videoId}`, 'GET')
  }

  async submitRecording(exerciseId: string, recording: RecordingAttempt) {
    return this.handleMockRequest<PronunciationExerciseResult>(
      `/exercises/${exerciseId}/recording`,
      'POST',
      { recording }
    )
  }

  async getExerciseProgress(exerciseId: string){
    return this.handleMockRequest<ExerciseProgressData>(
      `/exercises/${exerciseId}/progress`,
      'GET'
    )
  }

  async getExercisesList() {
    return this.handleMockRequest<PronunciationExercise[]>('/exercises', 'GET')
  }
}