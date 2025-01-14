import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { onboardingService } from '@/lib/services/onboardingService'
import type { RootState } from '@/store'
import { 
  AssessmentType, 
  OnboardingStep, 
  OnboardingState,
  AssessmentPrompts,
  AssessmentResponses
} from '@/lib/types/onboardingTypes'
import type { LanguageCode } from '@/constants/languages'
import { BaseAssessmentRequest, ComprehensionAssessmentRequest, GrammarAssessmentRequest, PronunciationAssessmentRequest, VocabularyAssessmentRequest } from '@/lib/models/requests/assessments/AssessmentRequests'
import { onboardingStorage } from '@/lib/services/onboardingStorage'
import { languagePreferencesStorage } from '@/lib/services/languagePreferencesStorage'
import { LanguagePreferences } from '@/lib/models/languages/LanguagePreferencesModel'

// Async Thunks
export const startAssessment = createAsyncThunk(
  'onboarding/startAssessment',
  async (firstType: AssessmentType) => {
    return await onboardingService.startAssessment(firstType)
  }
)

export const submitLanguagePreferences = createAsyncThunk(
  'onboarding/submitLanguagePreferences',
  async (preferences: { nativeLanguage: LanguageCode; targetLanguage: LanguageCode }) => {
    await onboardingService.submitLanguagePreferences(preferences)
    // Store preferences locally
    await languagePreferencesStorage.setPreferences({
      ...preferences,
    })
    // Initialize prompt queue
    return await onboardingService.initializePromptQueue(AssessmentType.Pronunciation)
  }
)

export const getPrompt = createAsyncThunk(
  'onboarding/getPrompt',
  async (type: AssessmentType) => {
    return await onboardingService.getPrompt(type)
  }
)

export const submitAssessment = createAsyncThunk(
  'onboarding/submitAssessment',
  async ({ type, data }: { type: AssessmentType; data: BaseAssessmentRequest }) => {
    switch (type) {
      case AssessmentType.Pronunciation:
        return await onboardingService.submitPronunciationAssessment(data as PronunciationAssessmentRequest)
      case AssessmentType.Vocabulary:
        return await onboardingService.submitVocabularyAssessment(data as VocabularyAssessmentRequest)
      case AssessmentType.Grammar:
        return await onboardingService.submitGrammarAssessment(data as GrammarAssessmentRequest)
      case AssessmentType.Comprehension:
        return await onboardingService.submitComprehensionAssessment(data as ComprehensionAssessmentRequest)
      default:
        throw new Error('Invalid assessment type')
    }
  }
)

export const submitFinalAssessment = createAsyncThunk(
  'onboarding/submitFinalAssessment',
  async (assessmentId: string) => {
    return await onboardingService.submitFinalAssessment(assessmentId)
  }
)


// Update rehydrateState thunk
export const rehydrateState = createAsyncThunk(
  'onboarding/rehydrate',
  async (_, { dispatch }) => {
    const [savedState, languagePrefs] = await Promise.all([
      onboardingStorage.getSession(),
      languagePreferencesStorage.getPreferences()
    ])
 
    
    if (savedState) {
      if (savedState.currentStep) {
        dispatch(setCurrentStep(savedState.currentStep))
      }
      if (savedState.assessmentType) {
        dispatch(setAssessmentType(savedState.assessmentType))
      }
      if (savedState.assessmentProgress) {
        dispatch(updateAssessmentProgress(savedState.assessmentProgress))
      }
    
      
    }

     // Check if we need to initialize prompts
    const needsPrompts = !savedState?.prompts || 
      Object.keys(savedState.prompts).length === 0

    if (needsPrompts && languagePrefs) {
      try {
        console.log('Initializing prompts queue...')
        // Initialize with pronunciation as first assessment type
        const firstPrompt = await onboardingService.initializePromptQueue(
          AssessmentType.Pronunciation
        )
        console.log('firstPrompt', firstPrompt)
        
        // Update the saved state with the new prompts
        const updatedState = {
          ...savedState,
          prompts: {
            [AssessmentType.Pronunciation]: firstPrompt
          },
          assessmentType: AssessmentType.Pronunciation
        }

        console.log('updatedState with prompts', updatedState)

        // Save the updated state
        await onboardingStorage.setSession(updatedState as OnboardingState)

         // Handle background loading of other prompts
         const handleBackgroundPrompts = async () => {
          try {
            const remainingTypes = [
              AssessmentType.Vocabulary,
              AssessmentType.Grammar,
              AssessmentType.Comprehension
            ]

            // As each prompt loads, update the state
            remainingTypes.forEach(type => {
              onboardingService.getPrompt(type)
                .then(async (prompt) => {
                  if (prompt) {
                    // Get current state
                    const currentState = await onboardingStorage.getSession()
                    // Update state with new prompt
                    const newState = {
                      ...currentState,
                      prompts: {
                        ...currentState?.prompts,
                        [type]: prompt
                      }
                    }
                    // Save updated state
                    await onboardingStorage.setSession(newState as OnboardingState)
                    // Dispatch action to update Redux store
                    dispatch(updatePrompts(newState.prompts))
                  }
                })
                .catch(error => {
                  console.error(`Failed to load ${type} prompt:`, error)
                })
            })
          } catch (error) {
            console.error('Error in background prompt loading:', error)
          }
        }

        // Start background loading without awaiting
        handleBackgroundPrompts()
        
        // Return the updated state
        return {
          onboardingState: updatedState,
          languagePreferences: languagePrefs
        }
      } catch (error) {
        console.error('Failed to initialize prompts:', error)
        return {
          onboardingState: savedState,
          languagePreferences: languagePrefs
        }
      }
    }
    return {
      onboardingState: savedState,
      languagePreferences: languagePrefs
    }
  }
)


const initialState: OnboardingState = {
  currentStep: OnboardingStep.Language,
  assessmentType: null,
  loading: false,
  error: null,
  assessmentProgress: 0,
  assessmentId: null,
  prompts: {} as Record<AssessmentType, any>,
  responses: {} as Record<AssessmentType, any>,
  promptsLoaded: false,
  sessionLoaded: false,
  finalAssessment: null,
  promptLoadStatus: {} as Record<AssessmentType, boolean>,
  languagePreferences: null
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    setAssessmentType: (state, action) => {
      state.assessmentType = action.payload
    },
    updateAssessmentProgress: (state, action) => {
      state.assessmentProgress = action.payload
    },
    resetOnboarding: () => initialState,
    updatePrompts: (state, action) => {
      state.prompts = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Start Assessment
      .addCase(startAssessment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startAssessment.fulfilled, (state, action) => {
        state.loading = false
        state.prompts[state.assessmentType!] = action.payload
        state.sessionLoaded = true
      })
      .addCase(startAssessment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to start assessment'
      })
      // Submit Language Preferences
      .addCase(submitLanguagePreferences.fulfilled, (state) => {
        state.currentStep = OnboardingStep.AssessmentIntro
      })
      // Get Prompt
      .addCase(getPrompt.fulfilled, (state, action) => {
        if (state.assessmentType) {
          state.prompts[state.assessmentType] = action.payload
        }
      })
      // Submit Assessment
      .addCase(submitAssessment.fulfilled, (state, action) => {
        if (state.assessmentType) {
          state.responses[state.assessmentType] = action.payload
        }
      })
      // Submit Final Assessment
      .addCase(submitFinalAssessment.fulfilled, (state, action) => {
        state.finalAssessment = action.payload
        state.currentStep = OnboardingStep.Complete
      })
      // rehydrate state
      .addCase(rehydrateState.fulfilled, (state, action) => {
        state.sessionLoaded = true;

        console.log('savedState', action.payload.onboardingState)
        console.log('saved languagePrefs', action.payload.languagePreferences)
      
        if (action.payload.onboardingState) {
          const {
            currentStep,
            assessmentType,
            assessmentProgress,
            prompts,
            responses,
            assessmentId,
            finalAssessment,
            promptLoadStatus
          } = action.payload.onboardingState;
      
          Object.assign(state, {
            currentStep,
            assessmentType,
            assessmentProgress,
            prompts: prompts || {},
            responses: responses || {},
            assessmentId,
            finalAssessment,
            promptLoadStatus: promptLoadStatus || {
              [AssessmentType.Pronunciation]: false,
              [AssessmentType.Vocabulary]: false,
              [AssessmentType.Grammar]: false,
              [AssessmentType.Comprehension]: false
            }
          });
        }
      
        if (action.payload.languagePreferences) {
          // Create a proper LanguagePreferencesState object from the simple preferences object
          state.languagePreferences = {
            nativeLanguage: action.payload.languagePreferences.nativeLanguage,
            targetLanguage: action.payload.languagePreferences.targetLanguage,
            isSubmitting: false,
            error: null
          };

          console.log('languagePreferences state', state.languagePreferences)
          console.log('state current', JSON.stringify(state, null, 2));
      
          // If we have language preferences but are still on the language step,
          // we should move to the next step
          if (state.currentStep === OnboardingStep.Language) {
            state.currentStep = OnboardingStep.AssessmentIntro;
          }
        }
      })
      
      // Persist state on all successful actions
      .addMatcher(
        (action) => action.type.startsWith('onboarding/'),
        (state) => {
          // Persist state after any onboarding action
          onboardingStorage.setSession(state).catch(console.error)
          return state
        }
      )
  }
})

// Selectors
export const selectOnboardingState = (state: RootState) => state.onboarding
export const selectCurrentStep = (state: RootState) => state.onboarding.currentStep
export const selectAssessmentType = (state: RootState) => state.onboarding.assessmentType
export const selectAssessmentProgress = (state: RootState) => state.onboarding.assessmentProgress
export const selectPrompts = (state: RootState) => state.onboarding.prompts
export const selectResponses = (state: RootState) => state.onboarding.responses

export const { 
  setCurrentStep, 
  setAssessmentType, 
  updateAssessmentProgress, 
  resetOnboarding,
  updatePrompts
} = onboardingSlice.actions

export default onboardingSlice.reducer





