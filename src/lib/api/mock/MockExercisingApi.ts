import type { IExercisingApi } from '../interfaces/IExercisingApi'
import type { 
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
      title: 'Mock Pronunciation Exercise',
      description: 'Practice your pronunciation with this exercise',
      video: {
        videoId: 'mock-video-id',
        title: 'Sample Video',
        transcript: 'Sample transcript for practice',
        highlights: []
      },
      practiceMaterial: {
        text: 'Sample practice text',
        segments: []
      },
      modelData: {
        audioUrl: 'mock-audio-url',
        phonemes: [],
        stressPatterns: [],
        intonation: {
          pattern: 'rising',
          description: 'Rising intonation pattern'
        }
      },
      settings: {
        minRecordingDuration: 5,
        maxRecordingDuration: 30,
        attemptsAllowed: 3,
        passingScore: 70
      },
      requirements: {
        minAccuracy: 70,
        minAttempts: 1,
        focusAreas: ['phoneme', 'stress', 'intonation']
      },
      estimatedDuration: '5 minutes',
      focusAreas: ['pronunciation', 'intonation'],
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
      recording,
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

  async getExerciseProgress(exerciseId: string) {
    return this.handleMockRequest(
      `/exercises/${exerciseId}/progress`,
      'GET'
    )
  }
}