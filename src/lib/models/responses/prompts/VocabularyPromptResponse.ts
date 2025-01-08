export interface VocabularyPromptData {
  image_url: string
  topic: string
  expected_vocabulary: string[]
  categories?: {
    name: string
    words: string[]
    description?: string
  }[]
  hints?: string[]
  difficulty_level?: string
}

export interface VocabularyPromptResponse {
  status: string
  data: VocabularyPromptData
}