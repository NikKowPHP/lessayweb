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
    
    if (path.includes('/recordings') && method === 'POST') {
      return this.generateMockAllRecordingsResult(
        path.split('/')[2], // exerciseId
        body?.recordings
      )
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
    const feedback = [
      {
        timestamp: 0,
        type: 'phoneme',
        issue: 'Pronunciation of "th" sound is unclear.',
        suggestion: 'Try to emphasize the "th" sound more clearly.',
        severity: 'medium'
      },
      {
        timestamp: 1,
        type: 'stress',
        issue: 'Incorrect stress on the word "theater".',
        suggestion: 'Make sure to stress the first syllable: "THE-a-ter".',
        severity: 'low'
      },
      {
        timestamp: 2,
        type: 'intonation',
        issue: 'Intonation is flat throughout the sentence.',
        suggestion: 'Try to vary your intonation to make it more engaging.',
        severity: 'high'
      }
    ];
    return {
      exerciseId: 'mock-exercise-id',
      timestamp: new Date().toISOString(),
      recordings: [
        {
          ...recording,
          // Don't include audioData in the result if you don't need it
          audioData: undefined
        }
      ],
      completed: true,
      scores: {
        accuracy: 85,
        fluency: 80,
        pronunciation: 75,
        overall: 80
      },
      feedback: feedback.map((item, index) => ({
        segmentIndex: recording.segmentIndex,
        timestamp: item.timestamp + index * 1000, // Increment timestamp for each feedback item
        type: item.type,
        issue: item.issue,
        suggestion: item.suggestion,
        severity: item.severity as 'low' | 'medium' | 'high'
      }))
    }
  }

  private generateMockAllRecordingsResult(
    exerciseId: string,
    recordings: RecordingAttempt[]
  ): PronunciationExerciseResult {
    return {
      exerciseId,
      timestamp: new Date().toISOString(),
      recordings: recordings.map(recording => ({
        ...recording,
        audioData: undefined // Remove audio data from result
      })),
      completed: true,
      scores: {
        accuracy: 85,
        fluency: 80,
        pronunciation: 75,
        overall: 80
      },
      feedback: recordings.map((recording, index) => ({
        segmentIndex: recording.segmentIndex,
        timestamp: index * 1000, // Mock timestamp for each segment
        type: 'phoneme',
        issue: `Sample feedback for segment ${recording.segmentIndex + 1}`,
        suggestion: 'Practice this sound more',
        severity: 'low'
      }))
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

  async submitAllRecordings(exerciseId: string, recordings: RecordingAttempt[]) {
    return this.handleMockRequest<PronunciationExerciseResult>(
      `/exercises/${exerciseId}/recordings`,
      'POST',
      { recordings }
    )
  }
}