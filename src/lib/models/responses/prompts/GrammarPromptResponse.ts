export interface GrammarPromptData {
  prompt_text: string
  target_structures: string[]
  example_sentence: string
  difficulty_level?: string
  grammar_points?: Record<string, string[]>
}

export interface GrammarPromptResponse {
  status: string
  data: GrammarPromptData
}