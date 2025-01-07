export interface AssessmentBaseResponse<T = Record<string, number>> {
  assessment_id: string
  step_id: string
  timestamp: string
  is_completed: boolean
  metrics: T
}

export interface SearchPrompt {
  search_query: string
  resource_type: string
  target_skill: string
  difficulty: string
  language_code: string
  keywords: string[]
  description: string
}

export interface DetectedIssue {
  type: string
  description: string
  confidence: number
  context: string
  suggestion: string
  examples_found: string[]
  search_prompts?: SearchPrompt[]
}