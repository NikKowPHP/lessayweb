export interface PronunciationPromptData {
  prompt_text: string
  target_phonemes: string[]
  difficulty_level: string
}

export interface PronunciationPromptResponse {
  status: string
  data: PronunciationPromptData
}